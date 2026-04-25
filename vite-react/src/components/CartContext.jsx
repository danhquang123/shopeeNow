import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
// Import đầy đủ các hàm từ file API của bạn
import {
    getMyCartApi,
    addProductToCartApi,
    updateCartItemApi,
    removeProductFromCartApi,
    createOrUpdateCartWithItemsApi
} from '../api/cart/cartApi';

const CartContext = createContext();

const getCartItemKey = (item) => item?.productId ?? item?.id;

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItemIds, setSelectedItemIds] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useSelector((state) => state.auth);

    // 1. Hàm lấy giỏ hàng từ Server
    const refreshCart = async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            setSelectedItemIds(new Set());
            return;
        }

        try {
            setLoading(true);
            const data = await getMyCartApi();
            const products = data.products || [];
            setCartItems(products);

            setSelectedItemIds((current) => {
                const nextSelected = new Set();
                if (current.size === 0) {
                    products.forEach((item) => {
                        const key = getCartItemKey(item);
                        if (key !== undefined && key !== null) nextSelected.add(key);
                    });
                } else {
                    products.forEach((item) => {
                        const key = getCartItemKey(item);
                        if (key !== undefined && current.has(key)) nextSelected.add(key);
                    });
                }
                return nextSelected;
            });
        } catch (error) {
            console.error('Lỗi fetch giỏ hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedCartItems = useMemo(
        () => cartItems.filter((item) => selectedItemIds.has(getCartItemKey(item))),
        [cartItems, selectedItemIds]
    );

    const toggleItemSelection = (itemKey) => {
        setSelectedItemIds((previous) => {
            const next = new Set(previous);
            if (next.has(itemKey)) next.delete(itemKey);
            else next.add(itemKey);
            return next;
        });
    };

    const selectAllItems = () => {
        setSelectedItemIds(new Set(cartItems.map(getCartItemKey).filter((key) => key !== undefined && key !== null)));
    };

    const deselectAllItems = () => {
        setSelectedItemIds(new Set());
    };

    const isAllSelected = cartItems.length > 0 && selectedItemIds.size === cartItems.length;

    // Tự động load khi mount và khi trạng thái đăng nhập thay đổi
    useEffect(() => {
        refreshCart();
    }, [isAuthenticated]);

    // 2. Hàm thêm sản phẩm (Dùng API)
    const addToCart = async (productId, quantity = 1) => {
        try {
            await addProductToCartApi(productId, quantity);
            await refreshCart(); // Cập nhật lại danh sách sau khi thêm thành công
            return true;
        } catch (error) {
            console.error("Lỗi thêm sản phẩm:", error);
            const message = error.response?.data?.message || "Không thể thêm vào giỏ. Vui lòng thử lại.";
            alert(message);
            return false;
        }
    };

    // 3. Cập nhật số lượng
    const updateQuantity = async (productId, newQuantity, currentQuantity) => {
        // 1. Kiểm tra nếu số lượng mới là 0 (hoặc nhỏ hơn) thì gọi hàm xóa
        if (newQuantity <= 0) {
            await removeItem(productId);
            return; // Dừng hàm tại đây, không gọi API update nữa
        }

        // 2. Nếu số lượng > 0 thì mới tiến hành cập nhật như bình thường
        try {
            const operation = newQuantity > currentQuantity ? "add" : "delete";
            await updateCartItemApi(productId, operation);
            await refreshCart();
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
        }
    };

    // 4. Xóa sản phẩm
    const removeItem = async (productId) => {
        try {
            const data = await getMyCartApi();
            await removeProductFromCartApi(data.cartId, productId);
            await refreshCart();
        } catch (error) {
            console.error("Lỗi xóa sản phẩm:", error);
        }
    };

    // 5. Đồng bộ selected items lên backend (tối ưu cho checkout)
    const syncSelectedItemsToBackend = async () => {
        if (selectedCartItems.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
            return false;
        }

        try {
            setLoading(true);
            // Chuyển đổi selectedCartItems thành CartItemDTO format
            const cartItemDTOs = selectedCartItems.map((item) => ({
                productId: getCartItemKey(item),
                quantity: item.quantity || 1
            }));

            const response = await createOrUpdateCartWithItemsApi(cartItemDTOs);
            alert(response); // "Cart created/update with the new items successfully"
            await refreshCart(); // Đồng bộ lại giỏ hàng từ backend
            return true;
        } catch (error) {
            console.error("Lỗi đồng bộ giỏ hàng:", error);
            const message = error.response?.data?.message || "Không thể cập nhật giỏ hàng. Vui lòng thử lại.";
            alert(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, loading, selectedItemIds, selectedCartItems, isAllSelected, addToCart, updateQuantity, removeItem, refreshCart, toggleItemSelection, selectAllItems, deselectAllItems, syncSelectedItemsToBackend }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);