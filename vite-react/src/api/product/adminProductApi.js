import axiosInstance from "../axiosInstance";

const ADMIN_BASE_URL = "/admin";

/**
 * 1. THÊM SẢN PHẨM MỚI (Dùng @RequestBody ở Java)
 */
export const addProductApi = async (categoryId, productData) => {
    try {
        const response = await axiosInstance.post(
            `${ADMIN_BASE_URL}/categories/${categoryId}/product`,
            productData
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi khi tạo sản phẩm";
    }
};

/**
 * 2. CẬP NHẬT THÔNG TIN CHỮ (Dùng @RequestBody ở Java)
 */
export const updateProductApi = async (productId, productData) => {
    try {
        const response = await axiosInstance.put(
            `${ADMIN_BASE_URL}/products/${productId}`,
            productData
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi khi cập nhật sản phẩm";
    }
};

/**
 * 3. UPLOAD ẢNH (Dùng MultipartFile ở Java)
 */
export const updateProductImageApi = async (productId, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("image", imageFile); // Key "image" phải khớp @RequestParam("image")

        const response = await axiosInstance.put(
            `${ADMIN_BASE_URL}/products/${productId}/image`,
            formData
            // Không cần set headers, interceptor sẽ tự động xử lý
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi khi upload ảnh";
    }
};

/**
 * 4. XÓA SẢN PHẨM (DELETE)
 */
export const deleteProductApi = async (productId) => {
    try {
        const response = await axiosInstance.delete(
            `${ADMIN_BASE_URL}/products/${productId}`
            // Không cần set headers, interceptor sẽ tự động xử lý
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Không thể xóa sản phẩm này";
    }
};

/**
 * 5. TÌM KIẾM SẢN PHẨM THEO TỪ KHÓA
 */
export const searchProductsByKeyword = async (keyword, pageNumber = 0, pageSize = 10, sortBy = "productId", sortOrder = "asc") => {
    try {
        const response = await axiosInstance.get(
            `/public/products/keyword/${keyword}`,
            {
                params: { pageNumber, pageSize, sortBy, sortOrder }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi khi tìm kiếm sản phẩm";
    }
};

/**
 * 6. LẤY SẢN PHẨM THEO DANH MỤC
 */
export const getProductsByCategory = async (categoryId, pageNumber = 0, pageSize = 10, sortBy = "productId", sortOrder = "asc") => {
    try {
        const response = await axiosInstance.get(
            `/public/categories/${categoryId}/products`,
            {
                params: { pageNumber, pageSize, sortBy, sortOrder }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi khi lấy sản phẩm theo danh mục";
    }
};