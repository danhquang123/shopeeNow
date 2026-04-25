import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginApi } from '../api/auth/authApi';
import { loginSuccess } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ show, handleClose, openRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginApi(username, password);
            console.log('📧 [Login] Backend response:', data);

            if (data.jwtToken) {
                dispatch(loginSuccess(data));
                const isAdmin = data.roles?.includes("ROLE_ADMIN");

                // Verify email was saved
                const savedEmail = localStorage.getItem('userEmail');
                console.log('✓ [Login] Email saved to localStorage:', savedEmail);

                alert(isAdmin ? "Chào Admin quay trở lại!" : "Đăng nhập thành công!");

                handleClose();
                navigate('/products');
            } else {
                throw new Error("Não recebi o Token do servidor!");
            }
        } catch (err) {
            console.error('❌ [Login] Erro:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div style={styles.overlay} onClick={handleClose}>
            <div className="modal-content-custom card shadow-lg border-0"
                onClick={(e) => e.stopPropagation()}
                style={styles.content}>

                <div className="card-header bg-white border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                    <div>
                        <h3 className="fw-bold mb-1 text-dark">Đăng nhập</h3>
                        <p className="small text-muted mb-0">Hệ thống mua sắm ShopeeNow</p>
                    </div>
                    <button type="button" className="btn-close shadow-none" onClick={handleClose}></button>
                </div>

                <div className="card-body p-4">
                    {error && (
                        <div className="alert alert-danger py-2 small mb-3 text-center border-0 shadow-sm" style={{ borderRadius: '10px' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">TÀI KHOẢN</label>
                            <input
                                type="text"
                                className="form-control form-control-lg fs-6 border-2 shadow-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tên đăng nhập..."
                                required
                                style={{ borderRadius: '12px' }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-secondary">MẬT KHẨU</label>
                            <div className="position-relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control form-control-lg fs-6 border-2 shadow-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{ borderRadius: '12px', paddingRight: '45px' }}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                            style={styles.loginBtn} disabled={loading}>
                            {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="small text-muted mb-0">Chưa có tài khoản?</p>
                        <button className="btn btn-link btn-sm text-decoration-none fw-bold" onClick={openRegister}>
                            Đăng ký thành viên mới
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.45)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' },
    content: { width: '95%', maxWidth: '420px', borderRadius: '24px', border: 'none' },
    loginBtn: { borderRadius: '14px', padding: '12px', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', border: 'none' }
};

export default LoginModal;