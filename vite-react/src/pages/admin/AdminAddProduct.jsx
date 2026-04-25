import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addProductApi, updateProductImageApi } from '../../api/product/adminProductApi';
import { fetchCategories } from '../../store/slices/categorySlice';

const AdminAddProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: categories } = useSelector(state => state.categoryStore || { items: [] });

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: 0,
        discount: 0,
        quantity: 10,
        categoryId: ''
    });

    const specialPrice = formData.price - (formData.price * formData.discount / 100);

    useEffect(() => {
        if (categories.length === 0) dispatch(fetchCategories());
    }, [dispatch]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.categoryId) return alert("Vui lòng chọn danh mục!");

        setLoading(true);
        try {
            // Bước 1: Tạo sản phẩm
            const productData = {
                productName: formData.productName,
                description: formData.description,
                price: parseFloat(formData.price),
                discount: parseFloat(formData.discount),
                specialPrice: specialPrice,
                quantity: parseInt(formData.quantity)
            };

            console.log("🚀 Đang gửi dữ liệu tạo sản phẩm...");
            const result = await addProductApi(formData.categoryId, productData);

            // SỬA Ở ĐÂY: Spring Boot trả về trực tiếp DTO, lấy productId ngay
            const newId = result?.productId;
            console.log("🆔 ID sản phẩm mới tạo:", newId);

            // Bước 2: Upload ảnh nếu có file và có ID
            if (newId && imageFile) {
                console.log("📸 Bắt đầu upload ảnh cho ID:", newId);
                await updateProductImageApi(newId, imageFile);
                console.log("✅ Upload ảnh hoàn tất!");
            }

            alert("Thành công: Đã tạo sản phẩm và cập nhật ảnh!");
            navigate('/admin/products');
        } catch (error) {
            console.error("❌ Lỗi xử lý:", error);
            alert("Lỗi: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
            <h3 className="fw-bold mb-4 text-primary">Thêm sản phẩm mới</h3>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Danh mục</label>
                                <select className="form-select" required value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Tên sản phẩm</label>
                                <input type="text" className="form-control" required
                                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-bold">Mô tả chi tiết</label>
                            <textarea className="form-control" rows="3"
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                        </div>

                        <div className="row bg-light p-3 rounded-3 mb-3">
                            <div className="col-md-4 mb-2">
                                <label className="form-label fw-bold text-muted">Giá niêm yết (đ)</label>
                                <input type="number" className="form-control" required
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                            </div>
                            <div className="col-md-4 mb-2">
                                <label className="form-label fw-bold text-danger">Khuyến mãi (%)</label>
                                <input type="number" className="form-control"
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })} />
                            </div>
                            <div className="col-md-4 mb-2">
                                <label className="form-label fw-bold text-success">Giá tổng</label>
                                <div className="form-control bg-white fw-bold text-success">
                                    {specialPrice.toLocaleString()}đ
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 text-center border-start">
                        <label className="form-label fw-bold">Ảnh sản phẩm</label>
                        <div className="mt-2 border rounded p-2 bg-white">
                            {imagePreview ? (
                                <img src={imagePreview} className="rounded mb-2" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                            ) : (
                                <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '220px' }}>
                                    <span className="text-muted small">Xem trước ảnh</span>
                                </div>
                            )}
                            <input type="file" className="form-control mt-2" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    <div className="col-12 mt-4 text-end">
                        <button type="button" className="btn btn-light me-2 px-4" onClick={() => navigate('/admin/products')}>Hủy</button>
                        <button type="submit" className="btn btn-primary px-5 fw-bold" disabled={loading}>
                            {loading ? "ĐANG LƯU..." : "TẠO SẢN PHẨM"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminAddProduct;