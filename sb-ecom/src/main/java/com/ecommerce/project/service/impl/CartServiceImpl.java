package com.ecommerce.project.service.impl;

import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Cart;
import com.ecommerce.project.model.CartItem;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.CartDTO;
import com.ecommerce.project.payload.CartItemDTO;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.repositories.CartItemRepository;
import com.ecommerce.project.repositories.CartRepository;
import com.ecommerce.project.repositories.ProductRepository;

import com.ecommerce.project.service.CartService;
import com.ecommerce.project.util.AuthUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CartItemRepository cartItemRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    AuthUtil authUtil;

    @Override
    public CartDTO addProductToCart(Long productId, Integer quantity) {
        // 1. Tìm giỏ hàng hiện có hoặc tạo mới
        Cart cart = createCart();

        // 2. Tìm sản phẩm trong Database
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        // 3. Kiểm tra xem sản phẩm đã có trong giỏ hàng này chưa
        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cart.getCartId(), productId);

        if (cartItem != null) {
            return updateProductQuantityInCart(productId, quantity);
        }

        // 4. Kiểm tra kho hàng
        if (product.getQuantity() == 0) {
            throw new APIException(product.getProductName() + " is not available (Out of stock)");
        }

        if (product.getQuantity() < quantity) {
            throw new APIException("Please, make an order of the " + product.getProductName()
                    + " less than or equal to the quantity " + product.getQuantity() + ".");
        }

        // 5. Tạo CartItem mới
        CartItem newCartItem = new CartItem();
        newCartItem.setProduct(product);
        newCartItem.setCart(cart);
        newCartItem.setQuantity(quantity);
        newCartItem.setDiscount(product.getDiscount());
        newCartItem.setProductPrice(product.getSpecialPrice());

        // 6. LƯU VÀ ĐỒNG BỘ DỮ LIỆU (Bước quan trọng nhất)
        cartItemRepository.save(newCartItem); // Lưu vào DB

        // Thêm vào list trong bộ nhớ của đối tượng cart hiện tại
        cart.getCartItems().add(newCartItem);

        // Cập nhật tổng tiền của giỏ hàng
        cart.setTotalPrice(cart.getTotalPrice() + (product.getSpecialPrice() * quantity));
        cartRepository.save(cart);

        // 7. Chuyển đổi sang DTO để trả về
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

        // Map danh sách CartItems sang ProductDTOs
        List<ProductDTO> productDTOList = cart.getCartItems().stream().map(item -> {
            // Map thông tin sản phẩm
            ProductDTO productDTO = modelMapper.map(item.getProduct(), ProductDTO.class);
            // Ghi đè số lượng trong giỏ hàng thay vì số lượng trong kho
            productDTO.setQuantity(item.getQuantity());
            return productDTO;
        }).toList();

        cartDTO.setProducts(productDTOList);

        return cartDTO;
    }

    private Cart createCart() {
        // Cart userCart = cartRepository.findCartByEmail(authUtil.loggedInEmail());
        // if(userCart != null){
        // return userCart;
        // }
        //
        // Cart cart = new Cart();
        // cart.setTotalPrice(0.00);
        // cart.setUser(authUtil.loggedInUser());
        // Cart newCart = cartRepository.save(cart);
        //
        // return newCart;

        // 1. Lấy thông tin User đang đăng nhập chuẩn từ AuthUtil
        User user = authUtil.loggedInUser();

        // 2. Tìm giỏ hàng gắn liền với User này trong Database
        // Giả sử Repository của bạn có hàm findByUser (nếu chưa có thì phải thêm vào
        // CartRepository)
        Cart userCart = cartRepository.findByUser(user);

        if (userCart != null) {
            return userCart;
        }

        // 3. Nếu chưa có thì mới tạo mới cho RIÊNG User này
        Cart cart = new Cart();
        cart.setTotalPrice(0.00);
        cart.setUser(user); // Gán User vào Cart để xác định chủ sở hữu
        return cartRepository.save(cart);

    }

    @Override
    public List<CartDTO> getAllCarts() {
        // 1. Lấy tất cả Carts từ Database
        List<Cart> carts = cartRepository.findAll();

        // 2. Kiểm tra nếu không có giỏ hàng nào
        if (carts.isEmpty()) {
            throw new APIException("No carts found");
        }

        // 3. Chuyển đổi danh sách Cart sang CartDTO
        List<CartDTO> cartDTOs = carts.stream().map(cart -> {
            // Map thông tin cơ bản của Cart sang CartDTO
            CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

            // Map danh sách sản phẩm (CartItems) sang ProductDTOs để hiển thị
            List<ProductDTO> products = cart.getCartItems().stream().map(item -> {
                ProductDTO productDTO = modelMapper.map(item.getProduct(), ProductDTO.class);
                productDTO.setQuantity(item.getQuantity()); // Lấy số lượng khách đã chọn
                return productDTO;
            }).toList();

            cartDTO.setProducts(products);
            return cartDTO;
        }).toList();

        return cartDTOs;
    }

    @Override
    public CartDTO getCart(String emailId, Long cartId) {
        Cart cart = cartRepository.findCartByEmailAndCartId(emailId, cartId);

        // Sửa lại: Nếu bằng null (không tìm thấy) thì mới throw lỗi
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "cartId", cartId);
        }

        // Map sang DTO
        CartDTO cartDTO = modelMapper.map(cart, CartDTO.class);

        cart.getCartItems().forEach(item -> {
            // 1. Cập nhật lại giá sản phẩm trong giỏ hàng theo giá hiện tại trong kho
            item.setProductPrice(item.getProduct().getSpecialPrice());

            // 2. Cập nhật lại phần trăm giảm giá (nếu có thay đổi)
            item.setDiscount(item.getProduct().getDiscount());
        });

        // 3. Sau khi giá từng món thay đổi, phải lưu lại Cart để đảm bảo Database đồng
        // bộ
        cartRepository.save(cart);

        // Cực kỳ quan trọng: Bạn phải map danh sách sản phẩm để nó không bị rỗng []
        List<ProductDTO> products = cart.getCartItems().stream().map(item -> {
            ProductDTO productDTO = modelMapper.map(item.getProduct(), ProductDTO.class);
            productDTO.setQuantity(item.getQuantity()); // Lấy số lượng trong giỏ
            return productDTO;
        }).toList();

        cartDTO.setProducts(products);

        return cartDTO;
    }

    @Transactional
    @Override
    public CartDTO updateProductQuantityInCart(Long productId, Integer quantity) {
        // 1. Lấy thông tin giỏ hàng của người dùng hiện tại
        User user = authUtil.loggedInUser();

        // Tìm giỏ hàng theo User (Sửa từ findCartByEmail sang findByUser)
        Cart userCart = cartRepository.findByUser(user);

        if (userCart == null) {
            throw new ResourceNotFoundException("Cart", "user", user.getUserName());
        }
        Long cartId = userCart.getCartId();

        // 2. Tìm sản phẩm và CartItem (mục trong giỏ)
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);

        if (cartItem == null) {
            throw new APIException("Product " + product.getProductName() + " not available in the cart!!!");
        }

        // 3. KIỂM TRA LOGIC SỐ LƯỢNG (PHẦN QUAN TRỌNG)
        int newQuantity = cartItem.getQuantity() + quantity;

        // Nếu nhấn nút tăng (+) -> Kiểm tra kho
        if (quantity > 0 && product.getQuantity() < newQuantity) {
            throw new APIException("Please, make an order of the " + product.getProductName()
                    + " less than or equal to the quantity " + product.getQuantity() + ".");
        }

        // Nếu số lượng mới < 0 (Trường hợp nhấn trừ quá nhiều)
        if (newQuantity < 0) {
            throw new APIException("The quantity cannot be negative!");
        }

        // 4. CẬP NHẬT THÔNG TIN
        cartItem.setProductPrice(product.getSpecialPrice());
        cartItem.setQuantity(newQuantity);
        cartItem.setDiscount(product.getDiscount());

        // Cập nhật tổng tiền của giỏ hàng (Cũ + chênh lệch)
        userCart.setTotalPrice(userCart.getTotalPrice() + (product.getSpecialPrice() * quantity));

        // 5. LƯU THAY ĐỔI
        cartRepository.save(userCart);
        CartItem updatedItem = cartItemRepository.save(cartItem);

        // 6. XỬ LÝ KHI SỐ LƯỢNG VỀ 0 (XÓA KHỎI GIỎ)
        if (updatedItem.getQuantity() == 0) {
            cartItemRepository.deleteById(updatedItem.getCartItemId());
            // Quan trọng: Phải xóa thủ công khỏi list trong bộ nhớ để DTO trả về không còn
            // nó
            userCart.getCartItems().removeIf(item -> item.getCartItemId().equals(updatedItem.getCartItemId()));
        }

        // 7. CHUYỂN ĐỔI SANG DTO
        CartDTO cartDTO = modelMapper.map(userCart, CartDTO.class);

        List<ProductDTO> productDTOList = userCart.getCartItems().stream().map(item -> {
            ProductDTO prd = modelMapper.map(item.getProduct(), ProductDTO.class);
            prd.setQuantity(item.getQuantity());
            return prd;
        }).toList();

        cartDTO.setProducts(productDTOList);

        return cartDTO;
    }

    @Transactional
    @Override
    public String deleteProductFromCart(Long cartId, Long productId) {
        // 1. Tìm giỏ hàng theo ID
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        // 2. Tìm CartItem (mục sản phẩm cụ thể trong giỏ hàng đó)
        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);

        if (cartItem == null) {
            throw new ResourceNotFoundException("Product", "productId", productId);
        }

        // 3. Cập nhật lại tổng tiền của giỏ hàng trước khi xóa mục đó đi
        // Tổng tiền mới = Tổng tiền cũ - (Giá sản phẩm * Số lượng đang có trong giỏ)
        cart.setTotalPrice(cart.getTotalPrice() - (cartItem.getProductPrice() * cartItem.getQuantity()));

        // 4. Xóa mối quan hệ trong bộ nhớ (Rất quan trọng để tránh lỗi Hibernate)
        cartItemRepository.deleteCartItemByProductIdAndCartId(cartId, productId);

        // 6. Lưu lại thay đổi của Cart (cập nhật totalPrice)
        cartRepository.save(cart);

        return "Product " + cartItem.getProduct().getProductName() + " removed from the cart !!!";
    }

    @Transactional
    @Override
    public void updateProductInCarts(Long cartId, Long productId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "productId", productId));

        // sửa lại đúng thứ tự tham số
        CartItem cartItem = cartItemRepository.findCartItemByProductIdAndCartId(cartId, productId);

        if (cartItem == null) {
            throw new APIException("Product " + product.getProductName() + " not available in the cart!!!");
        }

        double oldItemTotal = cartItem.getProductPrice() * cartItem.getQuantity();

        cartItem.setProductPrice(product.getSpecialPrice());
        cartItem.setDiscount(product.getDiscount());

        double newItemTotal = cartItem.getProductPrice() * cartItem.getQuantity();

        cart.setTotalPrice(cart.getTotalPrice() - oldItemTotal + newItemTotal);

        cartItemRepository.save(cartItem);
        cartRepository.save(cart);
    }

    @Transactional
    @Override
    // CartServiceImpl.java
    public String createOrUpdateCartWithItems(List<CartItemDTO> cartItemDTOs) {
        // 1. Lấy thông tin User đang đăng nhập từ SecurityContext (Token)
        String email = authUtil.loggedInEmail();

        // 2. Tìm giỏ hàng của User này trong DB
        Cart cart = cartRepository.findCartByEmail(email);

        // 3. Nếu chưa có giỏ hàng, tạo mới một cái trống
        if (cart == null) {
            cart = new Cart();
            cart.setTotalPrice(0.00);
            cart.setUser(authUtil.loggedInUser());
            // thiết lập user cho cart...
            cart = cartRepository.save(cart);
        } else {
            cartItemRepository.deleteAllByCartId(cart.getCartId());

        }

        double totalPrice = 0.00;

        // 4. Duyệt qua danh sách DTO gửi từ Frontend lên
        for (CartItemDTO itemDTO : cartItemDTOs) {
            // - Tìm sản phẩm trong DB bằng ProductId
            Long productId = itemDTO.getProductId();
            Integer quantity = itemDTO.getQuantity();
            if (quantity == null || quantity <= 0) {
                throw new APIException("Số lượng sản phẩm không hợp lệ.");
            }

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductId", productId));

            if (product.getQuantity() < quantity) {
                throw new APIException(
                        "Sản phẩm " + product.getProductName() + " chỉ còn " + product.getQuantity() + " sản phẩm.");
            }

            product.setQuantity(product.getQuantity() - quantity);
            totalPrice += product.getSpecialPrice() * quantity;
            // - Nếu chưa có -> Tạo mới CartItem và gắn vào Cart
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setCart(cart);
            cartItem.setQuantity(quantity);
            cartItem.setProductPrice(product.getSpecialPrice());
            cartItem.setDiscount(product.getDiscount());
            cartItemRepository.save(cartItem);
        }
        cart.setTotalPrice(totalPrice);
        cartRepository.save(cart);

        return "Cart created/update with the new  items successfully";
    }

}
