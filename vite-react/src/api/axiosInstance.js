import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    timeout: 30000,
    // Không bật withCredentials toàn cục, vì app này dùng localStorage token và Authorization header.
});

axiosInstance.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem("token");

        console.log("🔐 Request đến:", config.url);

        if (token) {
            // 🛡️ BƯỚC QUAN TRỌNG: Gọt vỏ nếu token bị dính rác Cookie
            // Nếu token chứa "quang_jwt=", chỉ lấy phần mã JWT ở giữa
            if (token.includes("quang_jwt=")) {
                token = token.split("quang_jwt=")[1].split(";")[0];
                console.log("✂️ Đã gọt rác khỏi Token");
            }

            config.headers.Authorization = `Bearer ${token.trim()}`;
            console.log("✅ Authorization header đã được đính kèm sạch sẽ");
        } else {
            console.warn("⚠️ Không tìm thấy token trong localStorage!");
        }

        // Xử lý Content-Type cho FormData (Upload ảnh)
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"]; // Để trình duyệt tự xử lý boundary
        } else {
            config.headers["Content-Type"] = "application/json";
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Nếu lỗi 401 (Token sai/hết hạn) thì mới xóa để ép login lại
        if (error.response?.status === 401) {
            console.warn("🚫 401 Unauthorized - Token có vấn đề, đang xóa...");
            localStorage.removeItem("token");
            localStorage.removeItem("username");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;