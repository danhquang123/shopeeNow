import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, deleteProductInStore } from '../../store/slices/productSlice';
import { deleteProductApi } from '../../api/product/adminProductApi';

const AdminProducts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // 1. Lấy dữ liệu từ store
    const { items, loading, error } = useSelector((state) => state.productStore);

    useEffect(() => {
        // Tự động load sản phẩm khi vào trang (Page 0)
        dispatch(fetchProducts(0));
    }, [dispatch]);

    // 2. Logic xử lý XÓA
    const handleDeleteClick = async (id) => {
        if (window.confirm(`Quang có chắc chắn muốn xóa sản phẩm #${id} không?`)) {
            try {
                await deleteProductApi(id);
                dispatch(deleteProductInStore(id));
                alert("Đã xóa sản phẩm thành công!");
            } catch (err) {
                alert("Lỗi khi xóa: " + err);
            }
        }
    };

    if (loading && items.length === 0) return <div className="p-5 text-center fw-bold">⌛ Đang tải dữ liệu...</div>;
    if (error) return <div className="p-5 text-danger text-center">❌ Lỗi: {error}</div>;

    return (
        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark mb-1">Quản lý sản phẩm</h3>
                    <p className="text-muted small">Dữ liệu thực tế từ hệ thống</p>
                </div>
                <button
                    className="btn btn-primary px-4 fw-bold rounded-3 shadow-sm"
                    onClick={() => navigate('/admin/add-product')}
                >
                    + THÊM SẢN PHẨM
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th className="py-3">ID</th>
                            <th className="py-3">Ảnh</th>
                            <th className="py-3">Tên sản phẩm</th>
                            <th className="py-3">Giá niêm yết</th>
                            <th className="py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items && items.length > 0 ? (
                            items.map((product) => (
                                <tr key={product.productId}>
                                    <td>#{product.productId}</td>
                                    <td>
                                        <img
                                            // GIẢI THÍCH: product.image từ Backend trả về đã có sẵn http://localhost:8080/images/...
                                            src={product.image && !product.image.includes("default.png")
                                                ? product.image
                                                : "https://placehold.co/50x50?text=No+Image"}
                                            alt={product.productName}
                                            className="rounded-2 shadow-sm border"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            // Dự phòng nếu link ảnh từ server bị lỗi 404
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://placehold.co/50x50?text=Error";
                                            }}
                                        />
                                    </td>
                                    <td className="fw-bold text-dark">{product.productName}</td>
                                    <td className="text-primary fw-bold">
                                        {product.price ? product.price.toLocaleString() : 0}đ
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button
                                                className="btn btn-sm btn-outline-primary px-3 fw-bold"
                                                // Quang kiểm tra kỹ đoạn link này nhé
                                                onClick={() => navigate(`/admin/edit/${product.productId}`)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger px-3 fw-bold"
                                                onClick={() => handleDeleteClick(product.productId)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">Hệ thống chưa có sản phẩm nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;