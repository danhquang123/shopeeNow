import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCartsApi, getMyCartApi } from "../../api/cart/cartApi"; // Giả định bạn có getUserCartApi

// 1. Thunk lấy giỏ hàng của RIÊNG người dùng đang đăng nhập
export const fetchUserCart = createAsyncThunk(
    "cart/fetchUserCart",
    async (_, { rejectWithValue }) => {
        try {
            // Hàm này sẽ gọi API kiểu: /api/cart/user
            const data = await getMyCartApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi tải giỏ hàng cá nhân");
        }
    }
);

// 2. Thunk lấy TẤT CẢ giỏ hàng (Cho Admin)
export const fetchAllCarts = createAsyncThunk(
    "cart/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await getAllCartsApi();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi tải danh sách giỏ hàng");
        }
    }
);

const cartSlice = createSlice({
    name: "cartStore",
    initialState: {
        cart: { products: [] }, // Giỏ hàng của người dùng đang đăng nhập
        carts: [],              // Danh sách tất cả giỏ hàng (cho Admin)
        loading: false,
        error: null
    },
    reducers: {
        // Clear giỏ hàng khi logout
        clearCart: (state) => {
            state.cart = { products: [] };
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý fetchAllCarts (Admin)
            .addCase(fetchAllCarts.pending, (state) => { state.loading = true; })
            .addCase(fetchAllCarts.fulfilled, (state, action) => {
                state.loading = false;
                state.carts = action.payload;
            })
            .addCase(fetchAllCarts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Xử lý fetchUserCart (User) - CÁI NÀY GIÚP HIỆN SỐ GIỎ HÀNG
            .addCase(fetchUserCart.pending, (state) => { state.loading = true; })
            .addCase(fetchUserCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cart = action.payload; // Lưu dữ liệu vào cart cá nhân
            })
            .addCase(fetchUserCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;