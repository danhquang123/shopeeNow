import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategoriesApi } from "../../api/category/categoryApi";

// 1. Hàm gọi API lấy danh sách
export const fetchCategories = createAsyncThunk(
    "categories/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchCategoriesApi();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 2. Cấu hình Slice
const categorySlice = createSlice({
    name: "categories",
    initialState: { items: [], loading: false },
    reducers: {
        addCategoryToStore: (state, action) => {
            state.items.push(action.payload);
        },
        // Thêm cái này để xóa nhanh trên giao diện
        deleteCategoryInStore: (state, action) => {
            state.items = state.items.filter(cat => cat.categoryId !== action.payload);
        },
        // --- THÊM CHỖ NÀY ĐỂ SỬA ---
        updateCategoryInStore: (state, action) => {
            const index = state.items.findIndex(cat => cat.categoryId === action.payload.categoryId);
            if (index !== -1) {
                // Cập nhật phần tử tại vị trí đó bằng dữ liệu mới
                state.items[index] = action.payload;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.content || action.payload || [];
            })
            .addCase(fetchCategories.rejected, (state) => {
                state.loading = false;
            });
    }
});

// ĐỪNG QUÊN EXPORT Ở ĐÂY
export const { addCategoryToStore, deleteCategoryInStore, updateCategoryInStore } = categorySlice.actions;
export default categorySlice.reducer;