import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllProductsApi } from "../../api/product/getAllProducts";

// 1. Thunk để lấy danh sách sản phẩm (Phân trang)
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (page, { rejectWithValue }) => {
        try {
            const data = await getAllProductsApi(page);
            return data; // Backend trả về Object chứa content, pageNumber...
        } catch (error) {
            return rejectWithValue(error.message || "Không thể tải danh sách sản phẩm");
        }
    }
);

const productSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        loading: false,
        error: null,
        pagination: {
            pageNumber: 0,
            totalPages: 0,
            totalElements: 0
        }
    },

    reducers: {
        // --- ACTION 1: THÊM SẢN PHẨM MỚI VÀO ĐẦU DANH SÁCH ---
        addProductToStore: (state, action) => {
            // Đẩy sản phẩm mới lên đầu mảng để Admin thấy ngay
            state.items.unshift(action.payload);
        },

        // --- ACTION 2: CẬP NHẬT SẢN PHẨM SAU KHI EDIT ---
        updateProductInStore: (state, action) => {
            const index = state.items.findIndex(
                (p) => p.productId === action.payload.productId
            );
            if (index !== -1) {
                // Thay thế hoàn toàn bằng dữ liệu mới từ Backend
                state.items[index] = action.payload;
            }
        },

        // --- ACTION 3: XÓA SẢN PHẨM KHỎI STORE ---
        deleteProductInStore: (state, action) => {
            // action.payload lúc này chính là productId được gửi từ Component
            state.items = state.items.filter(
                (p) => p.productId !== action.payload
            );
        }
    },

    extraReducers: (builder) => {
        builder
            // Bắt đầu gọi API
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Gọi API thành công
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                // Note: action.payload.content là mảng sản phẩm từ Spring Boot
                state.items = action.payload.content || [];
                state.pagination = {
                    pageNumber: action.payload.pageNumber,
                    totalPages: action.payload.totalPages,
                    totalElements: action.payload.totalElements
                };
            })
            // Gọi API thất bại
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export các actions để dùng trong các Component (Add, Edit, Delete)
export const {
    addProductToStore,
    updateProductInStore,
    deleteProductInStore
} = productSlice.actions;

export default productSlice.reducer;