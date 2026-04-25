package com.ecommerce.project.service.impl;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.*;
import com.ecommerce.project.payload.CartItemDTO;
import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderItemDTO;
import com.ecommerce.project.repositories.*;
import com.ecommerce.project.service.CartService;
import com.ecommerce.project.service.OrderService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    CartService cartService;

    @Transactional // CỰC KỲ QUAN TRỌNG: Lỗi ở bất kỳ bước nào sẽ hoàn tác (Rollback) toàn bộ
    @Override
    public OrderDTO placeOrder(String emailId, Long addressId, String paymentMethod, String pgPaymentId,
            String pgStatus, String pgResponseMessage, String pgName, List<CartItemDTO> selectedItems) {

        // 1. Getting User Cart - Tìm giỏ hàng của người dùng
        Cart cart = cartRepository.findCartByEmail(emailId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "email", emailId);
        }

        // Kiểm tra địa chỉ giao hàng
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        // 2. Determine which cart items should be part of the order
        List<CartItem> cartItems = cart.getCartItems();
        if (cartItems.isEmpty()) {
            throw new APIException("Cart is empty!");
        }

        List<CartItem> itemsToOrder;
        if (selectedItems == null || selectedItems.isEmpty()) {
            itemsToOrder = new ArrayList<>(cartItems);
        } else {
            List<Long> selectedProductIds = selectedItems.stream()
                    .map(CartItemDTO::getProductId)
                    .collect(Collectors.toList());
            itemsToOrder = cartItems.stream()
                    .filter(cartItem -> selectedProductIds.contains(cartItem.getProduct().getProductId()))
                    .collect(Collectors.toList());
            if (itemsToOrder.isEmpty()) {
                throw new APIException("Không có sản phẩm hợp lệ để tạo đơn hàng.");
            }
        }

        // 3. Create Order with payment info - Khởi tạo đơn hàng và thanh toán
        double totalAmount = itemsToOrder.stream()
                .mapToDouble(item -> item.getProductPrice() * item.getQuantity())
                .sum();

        Order order = new Order();
        order.setEmail(emailId);
        order.setOrderDate(LocalDate.now());
        order.setTotalAmount(totalAmount);
        order.setOrderStatus("Order Accepted"); // Trạng thái ban đầu
        order.setAddress(address);

        Payment payment = new Payment(paymentMethod, pgPaymentId, pgStatus, pgResponseMessage, pgName);
        payment.setOrder(order);
        payment = paymentRepository.save(payment);
        order.setPayment(payment);

        // Lưu Order tạm thời để lấy ID cho OrderItem
        Order savedOrder = orderRepository.save(order);

        // 4. Get selected items from the cart into the order items - Chuyển hàng từ Giỏ
        // sang Đơn
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : itemsToOrder) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setDiscount(cartItem.getDiscount());
            orderItem.setOrderedProductPrice(cartItem.getProductPrice()); // Chụp ảnh giá lúc mua
            orderItem.setOrder(savedOrder);
            orderItems.add(orderItem);
        }

        orderItems = orderItemRepository.saveAll(orderItems);

        // 5. Update product stock and remove ordered items from cart
        for (CartItem item : itemsToOrder) {
            int quantity = item.getQuantity();
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() - quantity);
            productRepository.save(product);

            cartService.deleteProductFromCart(cart.getCartId(), item.getProduct().getProductId());
        }

        // 6. Send back the order summary - Trả về kết quả
        OrderDTO orderDTO = modelMapper.map(savedOrder, OrderDTO.class);
        orderItems.forEach(item -> orderDTO.getOrderItems()
                .add(modelMapper.map(item, OrderItemDTO.class)));

        orderDTO.setAddressId(addressId);

        return orderDTO;
    }
}
