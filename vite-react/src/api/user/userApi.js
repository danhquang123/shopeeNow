import axiosInstance from "../axiosInstance";


export const getUsersApi = async () => {
    try {
        // Phải gọi API thật từ Spring Boot để lấy dữ liệu trong SQL
        const response = await axiosInstance.get('/admin/users');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Không thể tải danh sách người dùng";
    }
};



export const registerApi = async (username, email, password) => {
    try {
        // Gửi đúng cấu trúc JSON mà Postman của bạn đã test thành công
        const response = await axiosInstance.post("/auth/signup", {
            username,
            email,
            password,
            role: ["user"] // Mặc định role là user
        });
        return response.data;
    } catch (error) {
        // Quăng lỗi cụ thể từ Backend (ví dụ: "Username already taken")
        throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
};