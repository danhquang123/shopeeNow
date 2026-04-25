import React, { useState } from 'react';
import { registerApi } from '../api/auth/authApi';

const RegisterModal = ({ show, handleClose, openLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(''); // Xóa thông báo lỗi khi người dùng nhập lại
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- KIỂM TRA DỮ LIỆU (VALIDATION) ---
        if (!formData.username || !formData.email || !formData.password) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        if (formData.password.length < 6) {
            setError("Mật khẩu phải từ 6 ký tự trở lên!");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu nhập lại không chính xác!");
            return;
        }

        // --- GỬI ĐẾN BACKEND ---
        setLoading(true);
        try {
            await registerApi(formData.username, formData.email, formData.password);
            alert("Đăng ký thành công! Thông tin đã được lưu vào Database.");
            openLogin(); // Chuyển sang Modal đăng nhập
        } catch (err) {
            setError(err.message); // Hiển thị lỗi từ server
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div style={styles.overlay} onClick={handleClose}>
            <div className="card shadow-lg p-4 border-0" onClick={e => e.stopPropagation()} style={styles.content}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="fw-bold m-0">Đăng ký thành viên</h3>
                    <button type="button" className="btn-close shadow-none" onClick={handleClose}></button>
                </div>

                {error && <div className="alert alert-danger py-2 small border-0">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Tài khoản</label>
                        <input name="username" type="text" className="form-control" placeholder="Tên đăng nhập"
                            onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Email</label>
                        <input name="email" type="email" className="form-control" placeholder="Email của bạn"
                            onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Mật khẩu</label>
                        <input name="password" type="password" className="form-control" placeholder="Mật khẩu"
                            onChange={handleChange} required />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-bold">Xác nhận mật khẩu</label>
                        <input name="confirmPassword" type="password" className="form-control" placeholder="Nhập lại mật khẩu"
                            onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm" disabled={loading} style={{ borderRadius: '12px' }}>
                        {loading ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN"}
                    </button>
                </form>

                <div className="mt-3 text-center small">
                    Đã có tài khoản? <span className="text-primary fw-bold cursor-pointer" style={{ cursor: 'pointer' }} onClick={openLogin}>Đăng nhập ngay</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.45)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' },
    content: { width: '95%', maxWidth: '400px', borderRadius: '24px' }
};

export default RegisterModal;