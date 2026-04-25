import React from 'react';
import { Outlet, Link, useNavigate, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 1. Chỉ lấy những gì thực sự dùng: user (hiển thị tên) và roles (kiểm tra quyền)
    const { user, roles } = useSelector(state => state.auth);

    // Lấy token trực tiếp từ máy để check nhanh
    const token = localStorage.getItem("token");
    const isAdmin = roles?.includes("ROLE_ADMIN");

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    // 2. LOGIC CHẶN: 
    // Nếu không có token trong máy -> Chặn ngay
    // Nếu đã load xong roles mà không có ROLE_ADMIN -> Chặn ngay
    if (!token || (roles.length > 0 && !isAdmin)) {
        return <Navigate to="/" replace />;
    }

    // 3. Trạng thái chờ (F5 trang)
    if (token && roles.length === 0) {
        return <div className="p-5 text-center">Đang xác thực quyền Admin...</div>;
    }

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <div className="bg-dark text-white p-3 shadow" style={{ width: '250px', position: 'sticky', top: 0, height: '100vh' }}>
                <h3 className="text-primary fw-bold mb-4">ADMIN PANEL</h3>
                <nav className="nav flex-column gap-2">
                    <Link to="/admin/products" className="nav-link text-white border-bottom pb-2">📦 Quản lý sản phẩm</Link>
                    <Link to="/admin/categories" className="nav-link text-white border-bottom pb-2">📁 Quản lý danh mục</Link>
                    <Link to="/admin/carts" className="nav-link text-white border-bottom pb-2">🛒 Quản lý đơn hàng</Link>
                    <Link to="/admin/users" className="nav-link text-white border-bottom pb-2">👥 Quản lý người dùng</Link>
                </nav>
                <div className="mt-auto">
                    <button onClick={handleLogout} className="btn btn-outline-danger w-100 mt-5 fw-bold">ĐĂNG XUẤT</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 bg-light">
                <header className="bg-white p-3 shadow-sm d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-muted">Hệ thống quản lý ShopHub</span>
                    <div className="d-flex align-items-center gap-3">
                        <span className="badge bg-primary">Admin</span>
                        <span>Xin chào, <strong>{user}</strong></span>
                    </div>
                </header>
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;