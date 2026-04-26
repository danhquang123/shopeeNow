// 📦 Centralized API exports - Dễ dàng import tất cả functions từ một chỗ

// ========== AUTH APIS ==========
export {
    loginApi,
    registerApi,
    getCurrentUsername,
    getUserDetails,
    getUserEmail,
    logoutApi
} from './auth/authApi';

// ========== PRODUCT APIS ==========
export {
    getAllProductsApi,
    getProductById
} from './product/getAllProducts';

export {
    addProductApi,
    updateProductApi,
    updateProductImageApi,
    deleteProductApi,
    searchProductsByKeyword,
    getProductsByCategory
} from './product/adminProductApi';

// ========== CATEGORY APIS ==========
export {
    fetchCategoriesApi,
    addCategoryApi,
    updateCategoryApi,
    deleteCategoryApi
} from './category/categoryApi';

// ========== CART APIS ==========
export {
    getAllCartsApi,
    getMyCartApi,
    addProductToCartApi,
    updateCartItemApi,
    removeProductFromCartApi,
    createOrUpdateCartWithItemsApi
} from './cart/cartApi';

// ========== ADDRESS APIS ==========
export {
    getUserAddressesApi,
    addAddressApi,
    updateAddressApi,
    deleteAddressApi,
    getAllAddressesApi,
    getAddressById
} from './address/addressApi';

// ========== USER APIS ==========
export {
    getUsersApi,
    registerApi as registerUserApi
} from './user/userApi';

// ========== ORDER & PAYMENT APIS ==========
export {
    createStripePaymentIntent,
    placeOrder,
    formatOrderRequest
} from './order/orderApi';
