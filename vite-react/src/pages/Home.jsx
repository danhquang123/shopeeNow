import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    return (
        <div className="home-wrapper overflow-hidden">
            <style>{`
                .hero-section {
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    padding: 100px 0;
                }
                .gradient-text {
                    background: linear-gradient(90deg, #4f46e5, #06b6d4);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .feature-card {
                    border: none;
                    border-radius: 20px;
                    transition: all 0.3s ease;
                    background: #ffffff;
                }
                .feature-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1);
                }
                .btn-modern {
                    border-radius: 12px;
                    padding: 12px 30px;
                    font-weight: 700;
                    transition: 0.3s;
                }
                .stat-box {
                    border-right: 1px solid #dee2e6;
                }
                .stat-box:last-child { border: none; }
                @media (max-width: 768px) {
                    .stat-box { border: none; margin-bottom: 20px; }
                }
            `}</style>

            {/* Hero Section */}
            <section className="hero-section text-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2">
                                🚀 Chào mừng đến với thế giới mua sắm hiện đại
                            </span>
                            <h1 className="display-3 fw-bold text-dark mb-4">
                                Khám phá <span className="gradient-text">Bộ sưu tập</span> <br />
                                <span className="text-primary">Sản phẩm chất lượng</span>
                            </h1>
                            <p className="lead text-muted mb-5 px-md-5">
                                Trải nghiệm mua sắm trực tuyến với hàng ngàn sản phẩm chất lượng cao,
                                giao hàng siêu tốc và dịch vụ tận tâm 24/7.
                            </p>
                            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                                <Link to="/products" className="btn btn-primary btn-modern btn-lg shadow">
                                    Khám phá ngay
                                </Link>
                                <Link to="/cart" className="btn btn-outline-primary btn-modern btn-lg">
                                    🛒 Xem giỏ hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-5 bg-white border-bottom">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-3 stat-box">
                            <h2 className="fw-bold text-primary">10K+</h2>
                            <p className="text-muted">Sản phẩm</p>
                        </div>
                        <div className="col-md-3 stat-box">
                            <h2 className="fw-bold text-primary">50K+</h2>
                            <p className="text-muted">Khách hàng</p>
                        </div>
                        <div className="col-md-3 stat-box">
                            <h2 className="fw-bold text-primary">99%</h2>
                            <p className="text-muted">Hài lòng</p>
                        </div>
                        <div className="col-md-3 stat-box">
                            <h2 className="fw-bold text-primary">24/7</h2>
                            <p className="text-muted">Hỗ trợ</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Tại sao chọn <span className="gradient-text">ShopHub</span>?</h2>
                        <p className="text-muted">Chúng tôi mang đến trải nghiệm mua sắm tốt nhất</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="card feature-card p-4 h-100 shadow-sm text-center">
                                <div className="icon-box mb-3 text-primary fs-1">🛡️</div>
                                <h4 className="fw-bold">Chất lượng</h4>
                                <p className="text-muted small">Sản phẩm chọn lọc kỹ càng từ các nhà cung cấp uy tín nhất.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card feature-card p-4 h-100 shadow-sm text-center">
                                <div className="icon-box mb-3 text-success fs-1">🚚</div>
                                <h4 className="fw-bold">Giao hàng nhanh</h4>
                                <p className="text-muted small">Miễn phí vận chuyển 24h và theo dõi đơn hàng thời gian thực.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card feature-card p-4 h-100 shadow-sm text-center">
                                <div className="icon-box mb-3 text-warning fs-1">💬</div>
                                <h4 className="fw-bold">Hỗ trợ 24/7</h4>
                                <p className="text-muted small">Đội ngũ chuyên nghiệp luôn sẵn sàng giải đáp mọi thắc mắc.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-5 bg-primary text-white text-center">
                <div className="container">
                    <h2 className="display-5 fw-bold mb-4">Sẵn sàng trải nghiệm mua sắm?</h2>
                    <p className="mb-4 opacity-75">Tham gia cùng hàng ngàn khách hàng đã tin tưởng ShopHub</p>
                    <Link to="/products" className="btn btn-light text-primary btn-modern btn-lg px-5">
                        Bắt đầu ngay
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;