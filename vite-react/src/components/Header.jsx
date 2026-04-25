import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import { logout } from '../store/slices/authSlice';
import { fetchUserCart } from '../store/slices/cartSlice';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { isAuthenticated, user, roles = [] } = useSelector((state) => state.auth);
    const cart = useSelector((state) => state.cartStore?.cart || { products: [] });
    const totalItems = cart.products?.reduce((total, item) => total + item.quantity, 0) || 0;

    const isAdmin = roles.includes("ROLE_ADMIN");

    // Khi đăng nhập thành công: Đóng hết modal và lấy giỏ hàng
    useEffect(() => {
        if (isAuthenticated) {
            setShowLoginModal(false);
            setShowRegisterModal(false);
            dispatch(fetchUserCart());
        }
    }, [isAuthenticated, dispatch]);

    const handleLogout = () => {
        if (window.confirm("Bạn muốn đăng xuất?")) {
            dispatch(logout());
            setShowUserMenu(false);
            navigate('/');
        }
    };

    return (
        <>
            <header className="navbar navbar-expand-md navbar-light bg-white shadow-sm sticky-top py-3">
                <div className="container">
                    <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '40px', height: '40px' }}>SN</div>
                        <span>Shopee<span className="text-primary">Now</span></span>
                    </Link>

                    <div className="d-flex align-items-center gap-3">
                        <Link to="/cart" className="position-relative text-secondary">
                            🛒 {totalItems > 0 && <span className="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">{totalItems}</span>}
                        </Link>

                        {isAuthenticated ? (
                            <div className="position-relative">
                                <button className="btn btn-primary rounded-circle fw-bold" style={{ width: '40px', height: '40px' }} onClick={() => setShowUserMenu(!showUserMenu)}>
                                    {user?.charAt(0).toUpperCase()}
                                </button>
                                {showUserMenu && (
                                    <div className="position-absolute end-0 mt-2 p-2 bg-white shadow-lg rounded-3 border" style={{ zIndex: 3000, minWidth: '150px' }}>
                                        {isAdmin && <Link to="/admin/products" className="dropdown-item p-2">Admin Panel</Link>}
                                        <button className="dropdown-item p-2 text-danger" onClick={handleLogout}>Đăng xuất</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="btn btn-outline-primary btn-sm fw-bold" onClick={() => setShowLoginModal(true)}>Đăng nhập</button>
                        )}
                    </div>
                </div>
            </header>

            <LoginModal
                show={showLoginModal}
                handleClose={() => setShowLoginModal(false)}
                openRegister={() => { setShowLoginModal(false); setShowRegisterModal(true); }}
            />
            <RegisterModal
                show={showRegisterModal}
                handleClose={() => setShowRegisterModal(false)}
                openLogin={() => { setShowRegisterModal(false); setShowLoginModal(true); }}
            />
        </>
    );
};

export default Header;