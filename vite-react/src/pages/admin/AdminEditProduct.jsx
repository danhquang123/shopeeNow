import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateProductApi, updateProductImageApi } from '../../api/product/adminProductApi';
import { updateProductInStore } from '../../store/slices/productSlice';

const AdminEditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const productToEdit = useSelector((state) =>
        state.productStore.items.find(item => item.productId === parseInt(productId))
    );

    const [formData, setFormData] = useState({
        productName: '',
        price: 0,
        discount: 0,
        description: '',
        quantity: 0
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const priceNum = Number(formData.price) || 0;
    const discountNum = Number(formData.discount) || 0;
    const specialPrice = priceNum - (priceNum * discountNum / 100);

    useEffect(() => {
        if (productToEdit) {
            setFormData({
                productName: productToEdit.productName || '',
                price: productToEdit.price || 0,
                discount: productToEdit.discount || 0,
                description: productToEdit.description || '',
                quantity: productToEdit.quantity || 0
            });
            // Ban đầu, xem trước chính là URL ảnh cũ từ database
            setImagePreview(productToEdit.image);
        }
    }, [productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- RÀNG BUỘC LOGIC CỦA QUANG ---
        // Nếu không có cả ảnh mới (imageFile) lẫn ảnh cũ (imagePreview)
        if (!imagePreview) {
            alert("Lỗi: Sản phẩm bắt buộc phải có ảnh! Vui lòng chọn ảnh.");
            return;
        }

        setLoading(true);
        try {
            // Bước 1: Cập nhật thông tin text
            const updatedData = {
                productName: formData.productName,
                description: formData.description,
                price: priceNum,
                discount: discountNum,
                specialPrice: specialPrice,
                quantity: parseInt(formData.quantity)
            };

            const result = await updateProductApi(productId, updatedData);

            // Bước 2: Xử lý phần ảnh
            if (imageFile) {
                // Nếu người dùng chọn FILE MỚI -> Gọi API upload ảnh
                console.log("📸 Đang upload ảnh mới thay thế ảnh cũ...");
                const uploadResult = await updateProductImageApi(productId, imageFile);
                dispatch(updateProductInStore(uploadResult));
            } else {
                // Nếu KHÔNG chọn file mới -> Dùng kết quả từ bước 1 (vẫn giữ ảnh cũ)
                dispatch(updateProductInStore(result));
            }

            alert("Cập nhật sản phẩm thành công!");
            navigate('/admin/products');

        } catch (error) {
            console.error("❌ Lỗi cập nhật:", error);
            alert("Lỗi: " + error);
        } finally {
            setLoading(false);
        }
    };

    if (!productToEdit) return <div className="p-5 text-center fw-bold">⌛ Đang lấy dữ liệu...</div>;

    return (
        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-primary text-uppercase m-0">Sửa sản phẩm #{productId}</h3>
                <span className="badge bg-info text-dark">Chế độ chỉnh sửa</span>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                    <div className="col-md-8">
                        <div className="mb-3">
                            <label className="form-label fw-bold text-secondary">Tên sản phẩm</label>
                            <input type="text" name="productName" className="form-control border-2 shadow-sm"
                                value={formData.productName} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold text-secondary">Mô tả sản phẩm</label>
                            <textarea name="description" className="form-control border-2 shadow-sm" rows="4"
                                value={formData.description} onChange={handleChange}></textarea>
                        </div>

                        <div className="row g-3 p-3 bg-light rounded-4 border mx-0 shadow-sm mb-3">
                            <div className="col-md-4">
                                <label className="form-label small fw-bold">GIÁ NIÊM YẾT (đ)</label>
                                <input type="number" name="price" className="form-control fw-bold"
                                    value={formData.price} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-danger">GIẢM GIÁ (%)</label>
                                <input type="number" name="discount" className="form-control fw-bold text-danger"
                                    value={formData.discount} onChange={handleChange} />
                            </div>
                            <div className="col-md-4 text-center">
                                <label className="form-label small fw-bold text-success">GIÁ SAU GIẢM</label>
                                <div className="h4 mt-1 fw-bold text-success">
                                    {specialPrice.toLocaleString()}đ
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label fw-bold text-secondary">Số lượng tồn kho</label>
                            <input type="number" name="quantity" className="form-control border-2"
                                value={formData.quantity} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="col-md-4 text-center border-start">
                        <label className="form-label fw-bold text-secondary">Ảnh đại diện sản phẩm</label>
                        <div className="mt-2 p-3 bg-white rounded shadow-sm border">
                            <div className="position-relative mb-2">
                                <img
                                    src={imagePreview ? imagePreview : "https://placehold.co/400x400?text=No+Image"}
                                    className="img-fluid rounded shadow-sm"
                                    style={{ maxHeight: '250px', width: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = "https://placehold.co/400x400?text=Error"; }}
                                />
                                {imagePreview && (
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                        onClick={() => { setImagePreview(null); setImageFile(null); }}
                                    >
                                        Xóa ảnh
                                    </button>
                                )}
                            </div>

                            <input
                                type="file"
                                className="form-control form-control-sm"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <p className="text-muted small mt-2 italic">
                                * Để trống nếu muốn giữ ảnh cũ.
                            </p>
                        </div>
                    </div>

                    <div className="col-12 mt-4 d-flex justify-content-end gap-2 border-top pt-4">
                        <button type="button" className="btn btn-outline-secondary px-4 fw-bold" onClick={() => navigate('/admin/products')}>HỦY BỎ</button>
                        <button type="submit" className="btn btn-primary px-5 fw-bold shadow" disabled={loading}>
                            {loading ? "ĐANG XỬ LÝ..." : "LƯU THAY ĐỔI"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminEditProduct;