import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import { useCart } from '../components/CartContext';
import Filter from '../components/Filter'; // Import đúng file Filter.jsx của bạn

const Products = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { addToCart } = useCart();

    // --- 1. KHAI BÁO CÁC BIẾN CÒN THIẾU Ở ĐÂY ---
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || "");
    const [sortType, setSortType] = useState(searchParams.get('sort') || "default");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All"); // Biến 1: Danh mục đang chọn

    const { items, loading, error } = useSelector((state) => state.productStore);

    // Biến 2: Tự động lấy danh sách Category từ dữ liệu Backend trả về
    const categories = items
        ? [...new Set(items.map(item => item.category?.categoryName).filter(Boolean))].sort()
        : [];

    useEffect(() => {
        dispatch(fetchProducts(0));
    }, [dispatch]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (searchTerm) params.set('q', searchTerm);
        if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
        if (sortType && sortType !== 'default') params.set('sort', sortType);
        setSearchParams(params, { replace: true });
    }, [searchTerm, selectedCategory, sortType, setSearchParams]);

    // Biến 3: Hàm xóa bộ lọc
    const handleClearFilter = () => {
        setSearchTerm("");
        setSelectedCategory("All");
        setSortType("default");
    };

    // --- 2. LOGIC LỌC PHẢI BAO GỒM CẢ CATEGORY ---
    const filteredAndSortedItems = items
        ? [...items]
            .filter(product => {
                // Lọc theo tên
                const matchSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());

                // Lọc theo Category
                const productCatName = product.category?.categoryName || "Other";
                const matchCategory = selectedCategory === "All" ||
                    productCatName.toLowerCase() === selectedCategory.toLowerCase();

                return matchSearch && matchCategory;
            })
            .sort((a, b) => {
                if (sortType === "priceAsc") return a.specialPrice - b.specialPrice;
                if (sortType === "priceDesc") return b.specialPrice - a.specialPrice;
                return 0;
            })
        : [];

    const handleAddToCart = async (e, productId) => {
        e.stopPropagation();
        const success = await addToCart(productId, 1);
        if (success) navigate('/cart');
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border"></div></div>;

    return (
        <div className="bg-light min-vh-100 py-5">
            <style>{`
                .product-card { border: none; border-radius: 20px; transition: all 0.3s ease; background: white; height: 100%; }
                .product-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
                .toolbar { background: white; border-radius: 15px; padding: 20px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .product-image { width: 100%; height: 250px; object-fit: cover; border-top-left-radius: 20px; border-top-right-radius: 20px; }
            `}</style>

            <div className="container">
                {/* --- THANH CÔNG CỤ (Sử dụng component Filter bạn đã tạo) --- */}
                <div className="toolbar row align-items-center g-3">
                    <Filter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        sortType={sortType}
                        setSortType={setSortType}
                        categories={categories}
                        handleClearFilter={handleClearFilter}
                    />
                </div>

                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold mb-3">SẢN PHẨM <span className="text-primary">MỚI NHẤT</span></h2>
                </div>

                <div className="row g-4">
                    {filteredAndSortedItems.length > 0 ? (
                        filteredAndSortedItems.map((product) => (
                            <div key={product.productId} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                <div className="card product-card shadow-sm" onClick={() => navigate(`/products/${product.productId}`)}>
                                    <div className="position-relative">
                                        {product.discount > 0 && <div className="badge bg-danger position-absolute m-3" style={{ zIndex: 5 }}>-{product.discount}%</div>}
                                        <img
                                            src={product.image && !product.image.includes("default.png") ? product.image : "https://placehold.co/600x400?text=No+Image"}
                                            alt={product.productName}
                                            className="product-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://placehold.co/600x400?text=Error+Image";
                                            }}
                                        />
                                    </div>
                                    <div className="card-body p-4 d-flex flex-column">
                                        <h5 className="fw-bold text-dark text-truncate">{product.productName}</h5>
                                        <div className="d-flex align-items-center gap-2 my-3">
                                            <span className="h5 fw-bold text-primary mb-0">{product.specialPrice.toLocaleString('vi-VN')}đ</span>
                                            {product.discount > 0 && <small className="text-muted text-decoration-line-through">{product.price.toLocaleString('vi-VN')}đ</small>}
                                        </div>
                                        <button className="btn btn-primary w-100 mt-auto" onClick={(e) => handleAddToCart(e, product.productId)}>
                                            Thêm vào giỏ hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <h4>☹️ Không tìm thấy sản phẩm phù hợp</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Products;