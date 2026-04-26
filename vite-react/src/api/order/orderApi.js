import axiosInstance from "../axiosInstance";

/**
 * 1. TẠO PAYMENT INTENT CHO STRIPE
 * Gọi API để tạo clientSecret dùng cho Stripe Payment Element
 */
export const createStripePaymentIntent = async (stripePaymentData) => {
    try {
        const response = await axiosInstance.post(
            "/order/stripe-client-secret",
            stripePaymentData
        );
        // Backend trả về clientSecret (string)
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi khi tạo payment intent!";
    }
};

/**
 * 2. ĐẶT HÀN - THANH TOÁN BẰNG STRIPE/RAZORPAY/COD
 * @param {string} paymentMethod - "STRIPE", "RAZORPAY", "COD"
 * @param {object} orderRequestData - Chứa addressId, pgName, pgPaymentId, pgStatus, selectedItems
 */
export const placeOrder = async (paymentMethod, orderRequestData) => {
    try {
        const response = await axiosInstance.post(
            `/order/users/payment/${paymentMethod}`,
            orderRequestData
        );
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Lỗi khi đặt hàng!";
    }
};

/**
 * 3. HELPER: Format Order Data
 * Hàm này giúp chuẩn bị dữ liệu trước khi gửi lên server
 */
export const formatOrderRequest = (addressId, paymentMethod = "COD", selectedItems = [], pgData = {}) => {
    return {
        addressId,
        paymentMethod,
        selectedItems, // Danh sách productId được chọn
        pgName: pgData.pgName || "", // Payment Gateway Name (vd: "Stripe", "Razorpay")
        pgPaymentId: pgData.pgPaymentId || "", // Transaction ID
        pgStatus: pgData.pgStatus || "", // "success", "pending", "failed"
        pgResponseMessage: pgData.pgResponseMessage || "" // Message từ payment gateway
    };
};
