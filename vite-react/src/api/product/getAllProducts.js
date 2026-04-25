import axiosInstance from "../axiosInstance";

export const getAllProductsApi = async (pageNumber = 0) => {
    try {
        const response = await axiosInstance.get("/public/products", {
            params: { pageNumber, pageSize: 50 }
        });
        // Trả về response.data (chứa object có mảng 'content')
        return response.data;
    } catch (error) {
        console.error("Lỗi gọi API:", error);
        throw error;
    }
};