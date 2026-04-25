import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { useSelector } from 'react-redux'; // Để kiểm tra đăng nhập// Kiểm tra kỹ đường dẫn này

const getCartItemKey = (item) => item?.productId ?? item?.id;

const ShoppingCart = () => {
    // Lấy dữ liệu và các hàm điều khiển từ kho dùng chung
    const {
        cartItems,
        updateQuantity,
        removeItem,
        selectedCartItems,
        isAllSelected,
        toggleItemSelection,
        selectAllItems,
        deselectAllItems,
    } = useCart();
    const navigate = useNavigate();
    // Lấy trạng thái đăng nhập từ Redux
    const { isAuthenticated } = useSelector((state) => state.auth || {});

    const subtotal = selectedCartItems?.reduce((sum, item) => sum + item.specialPrice * item.quantity, 0) || 0;
    const totalDiscount = selectedCartItems?.reduce((sum, item) => sum + ((item.price - item.specialPrice) * item.quantity), 0) || 0;
    const IMAGE_BASE_URL = 'http://localhost:8080/images/';

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            alert('Vui lòng đăng nhập để tiến hành thanh toán!');
            return;
        }
        if (selectedCartItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
            return;
        }

        navigate('/checkout');
    };

    const handleToggleAll = () => {
        if (isAllSelected) {
            deselectAllItems();
        } else {
            selectAllItems();
        }
    };

    // Trạng thái giỏ hàng trống
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container py-5">
                <div className="p-5 bg-white rounded-4 shadow-sm text-center">
                    <div className="mb-4 display-1 text-muted">🛒</div>
                    <h2 className="fw-bold">Giỏ hàng đang trống</h2>
                    <p className="text-muted mb-4">Có vẻ như bạn chưa chọn được món đồ ưng ý nào.</p>
                    <Link to="/products" className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-sm">
                        Khám phá sản phẩm ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100 py-5">
            <div className="container">
                <h1 className="fw-bold display-5 mb-5 text-center">
                    Giỏ hàng <span className="text-primary">của bạn</span>
                </h1>

                <div className="row g-4">
                    {/* Danh sách sản phẩm bên trái */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm p-4 rounded-4">
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div>
                                    <h4 className="fw-bold mb-1 text-dark">Sản phẩm ({cartItems.length})</h4>
                                    <p className="small text-muted mb-0">Chọn sản phẩm bạn muốn thanh toán.</p>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="selectAllItems"
                                        checked={isAllSelected}
                                        onChange={handleToggleAll}
                                    />
                                    <label className="form-check-label small" htmlFor="selectAllItems">
                                        Chọn tất cả ({selectedCartItems.length}/{cartItems.length})
                                    </label>
                                </div>
                            </div>

                            {cartItems.map((item) => {
                                const itemKey = getCartItemKey(item);
                                const isSelected = selectedCartItems.some((selected) => getCartItemKey(selected) === itemKey);
                                return (
                                    <div key={itemKey} className="row align-items-center mb-4 pb-4 border-bottom g-3">
                                        <div className="col-auto d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="form-check-input me-3"
                                                checked={isSelected}
                                                onChange={() => toggleItemSelection(itemKey)}
                                            />
                                            <img
                                                src={`${IMAGE_BASE_URL}${item.image}`}
                                                alt={item.productName}
                                                className="rounded-3 shadow-sm"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                onError={(e) => { e.target.src = 'https://placehold.co/100?text=No+Image'; }}
                                            />
                                        </div>
                                        <div className="col">
                                            <h5 className="fw-bold mb-1">{item.productName}</h5>
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <span className="fw-bold text-primary h5 mb-0">${item.specialPrice.toLocaleString()}</span>
                                                {item.discount > 0 && (
                                                    <small className="text-muted text-decoration-line-through">${item.price.toLocaleString()}</small>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="input-group" style={{ width: '120px' }}>
                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.quantity)}
                                                    >
                                                        −
                                                    </button>

                                                    <span className="form-control text-center fw-bold bg-white">{item.quantity}</span>

                                                    <button
                                                        className="btn btn-outline-secondary"
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.quantity)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button className="btn btn-link text-danger text-decoration-none p-0" onClick={() => removeItem(item.productId)}>
                                                    <small>🗑 Xóa</small>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-auto text-end d-none d-md-block">
                                            <p className="small text-muted mb-0">Thành tiền</p>
                                            <span className="fw-bold h5 text-dark">${(item.specialPrice * item.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bảng tính tiền bên phải */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: '100px' }}>
                            <h4 className="fw-bold mb-4">Tóm tắt đơn hàng</h4>
                            <p className="small text-muted mb-3">Chỉ sản phẩm được chọn mới được tính vào tổng.</p>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Tạm tính</span>
                                <span className="fw-bold">${(subtotal + totalDiscount).toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2 text-danger font-semibold">
                                <span>Tiết kiệm</span>
                                <span>-${totalDiscount.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 text-success font-semibold">
                                <span>Vận chuyển</span>
                                <span>Miễn phí</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="fw-bold h5 mb-0">Tổng cộng</span>
                                <span className="h3 fw-bold text-primary mb-0">${subtotal.toLocaleString()}</span>
                            </div>
                            <button
                                className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm mb-3"
                                onClick={handleCheckout}
                            >
                                TIẾP TỤC THANH TOÁN
                            </button>
                            <Link to="/products" className="btn btn-outline-secondary w-100 py-2 rounded-3 text-decoration-none">
                                Quay lại mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;