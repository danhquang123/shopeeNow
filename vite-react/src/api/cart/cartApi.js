import axiosInstance from "../axiosInstance";

// 1. Lấy tất cả giỏ hàng (Admin)
export const getAllCartsApi = async () => {
    const res = await axiosInstance.get("/carts");
    return res.data;
};

// 2. Lấy giỏ hàng của chính người đang đăng nhập (User)
export const getMyCartApi = async () => {
    const res = await axiosInstance.get("/carts/users/cart");
    return res.data;
};

// 3. THÊM SẢN PHẨM (Hàm này bạn đang bị thiếu đây!)
export const addProductToCartApi = async (productId, quantity) => {
    // Khớp với @PostMapping("/carts/products/{productId}/quantity/{quantity}") trong Java
    const res = await axiosInstance.post(`/carts/products/${productId}/quantity/${quantity}`);
    return res.data;
};

// 4. Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItemApi = async (productId, operation) => {
    // Khớp với @PutMapping("/cart/products/{productId}/quantity/{operation}")
    const res = await axiosInstance.put(`/cart/products/${productId}/quantity/${operation}`);
    return res.data;
};

// 5. Xóa sản phẩm khỏi giỏ
export const removeProductFromCartApi = async (cartId, productId) => {
    // Khớp với @DeleteMapping("/carts/{cartId}/product/{productId}")
    const res = await axiosInstance.delete(`/carts/${cartId}/product/${productId}`);
    return res.data;
};

// 6. Tạo hoặc cập nhật toàn bộ giỏ hàng với danh sách items (mới)
export const createOrUpdateCartWithItemsApi = async (cartItemDTOs) => {
    // Khớp với @PostMapping("/cart/create") trong Java
    const res = await axiosInstance.post("/cart/create", cartItemDTOs);
    return res.data;
};