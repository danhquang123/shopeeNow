import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
    reducer: {
        productStore: productReducer,
        auth: authReducer, // Phải đặt tên là 'auth'
        categoryStore: categoryReducer,
        cartStore: cartReducer,
    },
});

export default store;