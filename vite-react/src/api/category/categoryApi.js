import axiosInstance from "../axiosInstance";

const ADMIN_URL = "/admin/categories";
const PUBLIC_URL = "/public/categories";

// 1. Lấy danh sách (Trả về PageResponse nên phải chấm .content ở Component)
export const fetchCategoriesApi = async (pageNumber = 0, pageSize = 10) => {
    const res = await axiosInstance.get(`${PUBLIC_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return res.data;
};

// 2. Thêm mới (Phải là POST vào /admin/categories)
export const addCategoryApi = async (categoryData) => {
    const res = await axiosInstance.post(ADMIN_URL, categoryData);
    return res.data;
};

// 3. Cập nhật (Phải là PUT vào /admin/categories/{id})
export const updateCategoryApi = async (id, categoryData) => {
    const res = await axiosInstance.put(`${ADMIN_URL}/${id}`, categoryData);
    return res.data;
};

// 4. Xóa (Phải là DELETE vào /admin/categories/{id})
export const deleteCategoryApi = async (id) => {
    const res = await axiosInstance.delete(`${ADMIN_URL}/${id}`);
    return res.data;
};