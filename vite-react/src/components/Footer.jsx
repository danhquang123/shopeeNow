import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-section bg-dark text-light mt-5 pt-5 pb-4 position-relative overflow-hidden">
            <style>{`
                .footer-section {
                    background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
                }
                .footer-link {
                    color: #9ca3af;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .footer-link:hover {
                    color: #ffffff;
                    transform: translateX(5px);
                }
                .footer-link::before {
                    content: '•';
                    color: #6366f1;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .footer-link:hover::before {
                    opacity: 1;
                }
                .social-icon {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.05);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    color: #fff;
                    transition: 0.3s;
                }
                .social-icon:hover {
                    background: #6366f1;
                    transform: translateY(-5px);
                    color: #fff;
                }
                .newsletter-input {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #fff;
                    border-radius: 10px;
                }
                .newsletter-input:focus {
                    background: rgba(255,255,255,0.1);
                    border-color: #6366f1;
                    box-shadow: none;
                    color: #fff;
                }
                .footer-title {
                    position: relative;
                    padding-bottom: 12px;
                    font-weight: 700;
                }
                .footer-title::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 40px;
                    height: 2px;
                    background: #6366f1;
                }
            `}</style>

            <div className="container">
                <div className="row g-4 mb-5">
                    {/* Brand Section */}
                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="bg-primary rounded-3 p-2 shadow">
                                <span className="fw-bold px-2">SH</span>
                            </div>
                            <h3 className="h4 fw-bold mb-0">ShopHub</h3>
                        </div>
                        <p className="text-secondary small leading-relaxed mb-4">
                            Nền tảng mua sắm trực tuyến hàng đầu với hàng ngàn sản phẩm chất lượng cao,
                            giao hàng siêu tốc và dịch vụ tận tâm 24/7.
                        </p>
                        <div className="d-flex gap-2">
                            <a href="#" className="social-icon"><i className="fab fa-facebook-f">f</i></a>
                            <a href="#" className="social-icon"><i className="fab fa-twitter">𝕏</i></a>
                            <a href="#" className="social-icon"><i className="fab fa-instagram">📷</i></a>
                            <a href="#" className="social-icon"><i className="fab fa-youtube">▶️</i></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6">
                        <h5 className="footer-title mb-4">Liên kết</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><Link to="/" className="footer-link">Trang chủ</Link></li>
                            <li className="mb-2"><Link to="/products" className="footer-link">Sản phẩm</Link></li>
                            <li className="mb-2"><Link to="/cart" className="footer-link">Giỏ hàng</Link></li>
                            <li className="mb-2"><a href="#" className="footer-link">Blog</a></li>
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div className="col-lg-2 col-md-6">
                        <h5 className="footer-title mb-4">Hỗ trợ</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="#" className="footer-link">Trợ giúp</a></li>
                            <li className="mb-2"><a href="#" className="footer-link">Đổi trả</a></li>
                            <li className="mb-2"><a href="#" className="footer-link">Vận chuyển</a></li>
                            <li className="mb-2"><a href="#" className="footer-link">Liên hệ</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="col-lg-4 col-md-6">
                        <h5 className="footer-title mb-4">Nhận tin mới</h5>
                        <p className="text-secondary small mb-3">Đăng ký để nhận ưu đãi đặc biệt hàng tuần.</p>
                        <div className="input-group mb-3">
                            <input type="email" className="form-control newsletter-input py-2" placeholder="Email của bạn" />
                            <button className="btn btn-primary px-4" type="button">Đăng ký</button>
                        </div>
                        <div className="d-flex gap-3 text-secondary small mt-4">
                            <span>💳 Thanh toán an toàn</span>
                            <span>🚚 Giao hàng tận nơi</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-top border-secondary pt-4">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start">
                            <p className="text-secondary small mb-0">
                                &copy; 2026 ShopHub. Tất cả quyền được bảo lưu.
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
                            <div className="d-flex justify-content-center justify-content-md-end gap-3 small">
                                <a href="#" className="text-secondary text-decoration-none hover-white">Bảo mật</a>
                                <a href="#" className="text-secondary text-decoration-none hover-white">Điều khoản</a>
                                <a href="#" className="text-secondary text-decoration-none hover-white">Cookie</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;