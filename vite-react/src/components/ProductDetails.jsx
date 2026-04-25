import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCart } from './CartContext'; // Giữ lại nếu bạn vẫn dùng Context cho giỏ hàng

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 1. Lấy danh sách sản phẩm từ Redux Store
    const { items } = useSelector((state) => state.productStore);

    // 2. Tìm sản phẩm cụ thể dựa trên productId từ URL
    // Lưu ý: productId từ useParams thường là chuỗi, nên cần dùng == hoặc ép kiểu Number
    const product = items.find(p => p.productId == productId);

    // 3. Nếu chưa có dữ liệu (ví dụ user F5 trang chi tiết), ta có thể điều hướng về trang danh sách
    useEffect(() => {
        if (!product && items.length > 0) {
            navigate('/products');
        }
    }, [product, items, navigate]);

    const { addToCart } = useCart();

    const handleAddToCart = async () => {
        if (product) {
            console.log(`Đã thêm sản phẩm ${product.productName} vào giỏ`);
            const success = await addToCart(product.productId, 1);
            if (success) {
                navigate('/cart');
            }
        }
    };

    if (!product) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Đang tìm dữ liệu sản phẩm...</p>
        </div>
    );

    return (
        <div className="container py-5">
            <div className="row g-5 align-items-center">
                <div className="col-md-6">
                    {/* Xử lý ảnh default tương tự trang danh sách */}
                    <img
                        src={product.image === "default.png" ? "https://placehold.co/600x600?text=Sản+Phẩm" : product.image}
                        className="img-fluid rounded-4 shadow-lg"
                        alt={product.productName}
                    />
                </div>
                <div className="col-md-6">
                    <span className="text-primary fw-bold text-uppercase mb-2 d-block">Chi tiết sản phẩm</span>
                    <h1 className="display-5 fw-bold mb-3">{product.productName}</h1>

                    <div className="d-flex align-items-center gap-3 mb-4">
                        <h2 className="text-danger fw-bold mb-0">
                            {product.specialPrice.toLocaleString('vi-VN')}đ
                        </h2>
                        {product.discount > 0 && (
                            <span className="text-muted text-decoration-line-through h4 mb-0">
                                {product.price.toLocaleString('vi-VN')}đ
                            </span>
                        )}
                        {product.discount > 0 && (
                            <span className="badge bg-danger rounded-pill">-{product.discount}%</span>
                        )}
                    </div>

                    <p className="text-muted mb-4 fs-5" style={{ lineHeight: '1.8' }}>
                        {product.description || "Sản phẩm bóng đá chất lượng cao, bền bỉ và thoáng mát cho mọi hoạt động thể thao."}
                    </p>

                    <div className="p-3 bg-light rounded-3 mb-4">
                        <small className="d-block text-muted">Tình trạng kho:</small>
                        <span className="fw-bold text-dark">{product.quantity > 0 ? `Còn hàng (${product.quantity})` : "Hết hàng"}</span>
                    </div>

                    <div className="d-grid gap-3">
                        <button
                            className="btn btn-primary btn-lg py-3 fw-bold rounded-3 shadow border-0"
                            style={{ background: 'linear-gradient(90deg, #4f46e5, #6366f1)' }}
                            onClick={handleAddToCart}
                            disabled={product.quantity <= 0}
                        >
                            {product.quantity > 0 ? "XÁC NHẬN THÊM VÀ ĐẾN GIỎ HÀNG" : "HẾT HÀNG"}
                        </button>
                        <button
                            className="btn btn-outline-secondary py-2"
                            onClick={() => navigate('/products')}
                        >
                            ← Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;