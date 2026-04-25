import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCarts } from '../../store/slices/cartSlice';
import { removeProductFromCartApi } from '../../api/cart/cartApi';

const AdminCarts = () => {
    const dispatch = useDispatch();
    const { carts, loading, error } = useSelector(state => state.cartStore);
    const [expandedCart, setExpandedCart] = useState(null);

    // QUANG KIỂM TRA LẠI DÒNG NÀY: Hãy chắc chắn đường dẫn này hiện được ảnh khi dán vào trình duyệt
    const IMAGE_BASE_URL = "http://localhost:8080/images/";

    useEffect(() => {
        dispatch(fetchAllCarts());
    }, [dispatch]);

    const handleRemoveItem = async (cartId, productId) => {
        if (window.confirm("Xóa sản phẩm này khỏi giỏ của khách?")) {
            try {
                await removeProductFromCartApi(cartId, productId);
                alert("Đã xóa thành công!");
                dispatch(fetchAllCarts());
            } catch (err) {
                alert("Lỗi: " + err);
            }
        }
    };

    if (loading) return <div className="p-5 text-center fw-bold text-primary">⌛ Đang tải dữ liệu...</div>;
    if (error) return <div className="alert alert-danger m-4">❌ {error}</div>;

    return (
        <div className="container-fluid py-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
                <h3 className="fw-bold text-dark mb-4 text-center">🛒 QUẢN LÝ GIỎ HÀNG HỆ THỐNG</h3>

                <div className="table-responsive">
                    <table className="table table-bordered align-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                        <thead className="table-dark">
                            <tr>
                                <th className="text-center">Cart ID</th>
                                <th>Tổng giá trị</th>
                                <th className="text-center">Số lượng</th>
                                <th className="text-center">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carts.map(cart => (
                                <React.Fragment key={cart.cartId}>
                                    <tr className="shadow-sm">
                                        <td className="text-center fw-bold">#{cart.cartId}</td>
                                        <td className="text-danger fw-bold">{cart.totalPrice.toLocaleString()} VNĐ</td>
                                        <td className="text-center">
                                            <span className="badge bg-success">{cart.products.length} sản phẩm</span>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className={`btn btn-sm ${expandedCart === cart.cartId ? 'btn-secondary' : 'btn-primary'}`}
                                                onClick={() => setExpandedCart(expandedCart === cart.cartId ? null : cart.cartId)}
                                            >
                                                {expandedCart === cart.cartId ? "Đóng lại" : "Soi chi tiết"}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* PHẦN CHI TIẾT SẢN PHẨM: Dùng table-light để phân biệt */}
                                    {expandedCart === cart.cartId && (
                                        <tr>
                                            <td colSpan="4" className="p-0 border-0">
                                                <div className="p-3 bg-light">
                                                    <table className="table table-sm table-hover bg-white mb-0 shadow-sm border">
                                                        <thead className="bg-secondary text-white">
                                                            <tr className="small">
                                                                <th className="ps-3">ẢNH</th>
                                                                <th>TÊN SẢN PHẨM</th>
                                                                <th>ĐƠN GIÁ</th>
                                                                <th className="text-center">SL</th>
                                                                <th className="text-end">THÀNH TIỀN</th>
                                                                <th className="text-center">QUẢN LÝ</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {cart.products.map(p => (
                                                                <tr key={p.productId}>
                                                                    <td className="ps-3">
                                                                        <img
                                                                            src={`${IMAGE_BASE_URL}${p.image}`}
                                                                            width="50" height="50"
                                                                            className="rounded object-fit-cover border"
                                                                            alt=""
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = "https://via.placeholder.com/50?text=Error";
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <div className="fw-bold small">{p.productName}</div>
                                                                        <div className="text-muted" style={{ fontSize: '10px' }}>ID: {p.productId}</div>
                                                                    </td>
                                                                    <td className="small">{p.specialPrice.toLocaleString()}</td>
                                                                    <td className="text-center fw-bold">x{p.quantity}</td>
                                                                    <td className="text-end fw-bold text-primary pe-3">
                                                                        {(p.specialPrice * p.quantity).toLocaleString()}
                                                                    </td>
                                                                    <td className="text-center">
                                                                        <button
                                                                            onClick={() => handleRemoveItem(cart.cartId, p.productId)}
                                                                            className="btn btn-sm btn-outline-danger border-0"
                                                                        >
                                                                            🗑️
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminCarts;