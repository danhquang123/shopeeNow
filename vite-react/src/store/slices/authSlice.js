import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || null,
        user: localStorage.getItem("username") || null,
        email: localStorage.getItem("userEmail") || null,
        // SỬA Ở ĐÂY: Lấy roles từ LocalStorage và chuyển từ chuỗi sang mảng
        roles: JSON.parse(localStorage.getItem("roles")) || [],
        isAuthenticated: !!localStorage.getItem("token"),
    },
    reducers: {
        loginSuccess: (state, action) => {
            // Backend trả về: { jwtToken: "...", username: "...", email: "...", roles: ["ROLE_ADMIN"] }
            const { jwtToken, username, email, roles } = action.payload;
            state.token = jwtToken;
            state.user = username;
            state.email = email || '';
            state.roles = roles; // Cập nhật roles vào store
            state.isAuthenticated = true;

            localStorage.setItem("token", jwtToken);
            localStorage.setItem("username", username);
            localStorage.setItem("userEmail", email || '');
            localStorage.setItem("userName", username || 'Guest');
            // SỬA Ở ĐÂY: Lưu mảng roles vào LocalStorage
            localStorage.setItem("roles", JSON.stringify(roles));

            console.log('✓ [AuthSlice] Login bem-sucedido. Dados salvos:');
            console.log('  - Token:', jwtToken?.substring(0, 20) + '...');
            console.log('  - Username:', username);
            console.log('  - Email:', email);
            console.log('  - Roles:', roles);
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.email = null;
            state.roles = []; // Xóa trắng roles
            state.isAuthenticated = false;

            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userName");
            localStorage.removeItem("roles"); // Xóa nốt roles trong LocalStorage

            console.log('✓ [AuthSlice] Logout bem-sucedido. LocalStorage limpo.');
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;