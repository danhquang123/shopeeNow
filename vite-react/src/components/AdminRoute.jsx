import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    // 1. Lấy trạng thái đăng nhập và quyền từ Redux
    const { isAuthenticated, roles } = useSelector((state) => state.auth);

    // 2. Kiểm tra xem có quyền ADMIN hay không
    const isAdmin = roles?.includes("ROLE_ADMIN");

    // 3. Nếu không phải Admin, đuổi về trang chủ hoặc trang Login
    if (!isAuthenticated || !isAdmin) {
        alert("Dừng lại Quang ơi! Bạn không có quyền vào khu vực này.");
        return <Navigate to="/" replace />;
    }

    // 4. Nếu là Admin xịn, cho phép đi tiếp vào các trang con (Outlet)
    return <Outlet />;
};

export default AdminRoute;