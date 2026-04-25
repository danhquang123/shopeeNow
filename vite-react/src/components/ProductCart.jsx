import React, { useState } from 'react';

const ProductCart = () => {
    const [cartItems, setCartItems] = useState([
        {
            productId: 652,
            productName: "Iphone Xs max",
            image: "https://placehold.co/600x400",
            price: 1450.0,
            specialPrice: 1305.0,
            discount: 10.0,
            quantity: 2,
        },
        {
            productId: 654,
            productName: "MacBook Air M2s",
            image: "https://placehold.co/600x400",
            price: 2550.0,
            specialPrice: 2040.0,
            discount: 20.0,
            quantity: 1,
        }
    ]);

    // Xóa sản phẩm khỏi giỏ hàng
    const removeItem = (productId) => {
        setCartItems(cartItems.filter(item => item.productId !== productId));
    };

    // Cập nhật số lượng
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(productId);
        } else {
            setCartItems(cartItems.map(item =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    // Tính tổng tiền
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.specialPrice * item.quantity), 0);
    const totalDiscount = cartItems.reduce((sum, item) => sum + ((item.price - item.specialPrice) * item.quantity), 0);

    // Trạng thái giỏ hàng trống
    if (cartItems.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-20">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn trống</h2>
                        <p className="text-gray-500 mb-8">Hãy thêm các sản phẩm yêu thích để bắt đầu mua sắm</p>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200 shadow-lg shadow-indigo-200">
                            Tiếp tục mua sắm
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 uppercase tracking-wider">
                    Giỏ hàng của bạn
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Danh sách sản phẩm - 2 cột */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                            {cartItems.map((item, index) => (
                                <div key={item.productId} className={`p-6 flex flex-col md:flex-row gap-6 ${index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                                    {/* Hình ảnh */}
                                    <div className="flex-shrink-0 w-full md:w-32 h-48 md:h-32 rounded-3xl overflow-hidden bg-gray-100 shadow-inner">
                                        <img
                                            src={item.image}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Thông tin sản phẩm */}
                                    <div className="flex-grow flex flex-col justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {item.productName}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Còn {item.quantity} sản phẩm trong kho
                                            </p>
                                            <div className="flex items-center flex-wrap gap-3">
                                                <span className="text-2xl font-bold text-indigo-600">
                                                    ${item.specialPrice.toLocaleString()}
                                                </span>
                                                {item.discount > 0 && (
                                                    <>
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ${item.price.toLocaleString()}
                                                        </span>
                                                        <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                                            -{item.discount}%
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Điều khiển số lượng */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="px-5 py-2 text-center font-semibold text-gray-800">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="w-full sm:w-auto text-red-500 hover:text-white hover:bg-red-500 border border-red-500 rounded-full px-5 py-3 transition-all duration-200 font-semibold"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tóm tắt đơn hàng - 1 cột */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính:</span>
                                    <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-red-500 font-semibold">
                                    <span>Tiết kiệm:</span>
                                    <span>-${totalDiscount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển:</span>
                                    <span className="text-green-500 font-semibold">Miễn phí</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                                <span className="text-3xl font-bold text-indigo-600">
                                    ${totalAmount.toLocaleString()}
                                </span>
                            </div>

                            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-200 shadow-lg shadow-indigo-200 mb-3">
                                Thanh toán
                            </button>

                            <button className="w-full border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-4 rounded-xl transition-colors duration-200">
                                Tiếp tục mua sắm
                            </button>

                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Được bảo vệ bởi chính sách bảo mật của chúng tôi
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCart;