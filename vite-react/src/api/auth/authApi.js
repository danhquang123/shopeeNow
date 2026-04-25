import axiosInstance from "../axiosInstance";

export const loginApi = async (username, password) => {
    try {
        const response = await axiosInstance.post("/auth/signin", { username, password });
        return response.data;
    } catch (error) {
        // Lấy message lỗi từ backend: error.response.data.message
        throw new Error(error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
    }
};

export const registerApi = async (username, email, password) => {
    try {
        const response = await axiosInstance.post("/auth/signup", {
            username,
            email,
            password,
            role: ["user"]
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Đăng ký thất bại!");
    }
};