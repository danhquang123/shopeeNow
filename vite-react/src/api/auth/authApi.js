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

export const getCurrentUsername = async () => {
    try {
        const response = await axiosInstance.get("/auth/username");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Không thể lấy tên đăng nhập!");
    }
};

export const getUserDetails = async () => {
    try {
        const response = await axiosInstance.get("/auth/user");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Không thể lấy thông tin người dùng!");
    }
};

export const getUserEmail = async () => {
    try {
        const response = await axiosInstance.get("/auth/user/email");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Không thể lấy email người dùng!");
    }
};

export const logoutApi = async () => {
    try {
        const response = await axiosInstance.post("/auth/signout");
        // Xóa token sau khi logout thành công
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Logout thất bại!");
    }
};