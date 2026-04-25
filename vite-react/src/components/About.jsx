import React from 'react';

const About = () => {
    return (
        <div className="about-wrapper bg-white min-vh-100">
            <style>{`
                .about-hero {
                    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
                    padding: 120px 0;
                    color: white;
                    clip-path: ellipse(150% 100% at 50% 0%);
                }
                .mission-card {
                    border: none;
                    border-radius: 20px;
                    background: #f8fafc;
                    transition: all 0.3s ease;
                }
                .mission-card:hover {
                    background: #ffffff;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                    transform: translateY(-5px);
                }
                .team-img {
                    width: 150px;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 50%;
                    border: 5px solid #fff;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .stat-circle {
                    width: 80px;
                    height: 80px;
                    background: rgba(99, 102, 241, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    color: #4f46e5;
                    font-size: 1.5rem;
                }
            `}</style>

            {/* 1. Hero Section */}
            <section className="about-hero text-center mb-5">
                <div className="container">
                    <h1 className="display-3 fw-bold mb-4">Về ShopHub</h1>
                    <p className="lead opacity-75 max-w-2xl mx-auto">
                        Chúng tôi không chỉ bán sản phẩm, chúng tôi mang đến giải pháp <br />
                        cho một cuộc sống tiện nghi và hiện đại hơn.
                    </p>
                </div>
            </section>

            {/* 2. Story & Mission */}
            <section className="container py-5">
                <div className="row align-items-center g-5">
                    <div className="col-lg-6">
                        <h2 className="fw-bold mb-4">Câu chuyện của chúng tôi</h2>
                        <p className="text-muted mb-4">
                            Được thành lập từ năm 2024, ShopHub bắt đầu với một niềm tin đơn giản:
                            Mọi người đều xứng đáng được tiếp cận với những sản phẩm công nghệ tốt nhất
                            mà không phải lo lắng về giá cả hay chất lượng.
                        </p>
                        <p className="text-muted">
                            Từ một cửa hàng nhỏ, chúng tôi đã vươn mình trở thành hệ thống bán lẻ trực tuyến
                            hàng đầu, phục vụ hàng ngàn khách hàng trên khắp cả nước với tiêu chí
                            "Khách hàng là trọng tâm".
                        </p>
                    </div>
                    <div className="col-lg-6">
                        <div className="row g-4">
                            <div className="col-6">
                                <div className="mission-card p-4 text-center h-100">
                                    <div className="stat-circle">🎯</div>
                                    <h5 className="fw-bold">Sứ mệnh</h5>
                                    <p className="small text-muted mb-0">Nâng tầm trải nghiệm mua sắm số.</p>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="mission-card p-4 text-center h-100">
                                    <div className="stat-circle">💎</div>
                                    <h5 className="fw-bold">Giá trị</h5>
                                    <p className="small text-muted mb-0">Cam kết hàng thật, giá trị thật.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Core Features (Bootstrap Grid) */}
            <section className="bg-light py-5">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Tại sao tin tưởng chúng tôi?</h2>
                    </div>
                    <div className="row g-4">
                        {[
                            { icon: "🛡️", title: "Bảo hành uy tín", desc: "Cam kết 1 đổi 1 trong 30 ngày nếu lỗi từ nhà sản xuất." },
                            { icon: "🚚", title: "Giao hàng nhanh", desc: "Hệ thống vận chuyển phủ sóng 63 tỉnh thành." },
                            { icon: "💬", title: "Hỗ trợ 24/7", desc: "Đội ngũ chuyên viên tư vấn luôn sẵn sàng giải đáp mọi thắc mắc." }
                        ].map((item, idx) => (
                            <div key={idx} className="col-md-4">
                                <div className="card h-100 border-0 shadow-sm p-4 rounded-4 text-center">
                                    <div className="fs-1 mb-3">{item.icon}</div>
                                    <h5 className="fw-bold">{item.title}</h5>
                                    <p className="text-muted small mb-0">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Meet The Team */}
            <section className="container py-5 text-center">
                <h2 className="fw-bold mb-5">Đội ngũ sáng lập</h2>
                <div className="row justify-content-center g-4">
                    <div className="col-md-4 col-lg-3">
                        <img src="https://placehold.co/400x400" alt="CEO" className="team-img mb-3" />
                        <h5 className="fw-bold mb-1">Quang Oaks</h5>
                        <p className="text-primary small fw-bold">Founder & CEO</p>
                    </div>
                    <div className="col-md-4 col-lg-3">
                        <img src="https://placehold.co/400x400" alt="CTO" className="team-img mb-3" />
                        <h5 className="fw-bold mb-1">Anh Dev</h5>
                        <p className="text-primary small fw-bold">CTO</p>
                    </div>
                </div>
            </section>

            {/* 5. Contact CTA */}
            <section className="container py-5 mb-5">
                <div className="bg-dark text-white rounded-5 p-5 text-center shadow-lg">
                    <h2 className="fw-bold mb-4">Bạn có câu hỏi nào không?</h2>
                    <p className="opacity-75 mb-4">Đội ngũ của chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.</p>
                    <button className="btn btn-primary px-5 py-3 rounded-pill fw-bold">Liên hệ ngay</button>
                </div>
            </section>
        </div>
    );
};

export default About;