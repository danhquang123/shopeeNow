import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategoryToStore, deleteCategoryInStore, updateCategoryInStore } from '../../store/slices/categorySlice';
import { addCategoryApi, deleteCategoryApi, updateCategoryApi } from '../../api/category/categoryApi';

const AdminCategories = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector(state => state.categoryStore);
    const [newCatName, setNewCatName] = useState("");

    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleEditClick = (cat) => {
        setEditId(cat.categoryId);
        setEditName(cat.categoryName);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const res = await addCategoryApi({ categoryName: newCatName });
            dispatch(addCategoryToStore(res));
            setNewCatName("");
            alert("Thêm danh mục thành công!");
        } catch (err) {
            alert("Lỗi khi thêm: " + err);
        }
    };

    const handleUpdate = async (id) => {
        try {
            const res = await updateCategoryApi(id, { categoryName: editName });
            dispatch(updateCategoryInStore(res));
            setEditId(null);
            alert("Cập nhật thành công!");
        } catch (err) {
            alert("Lỗi khi sửa: " + err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
            try {
                await deleteCategoryApi(id);
                dispatch(deleteCategoryInStore(id));
            } catch (err) {
                alert("Lỗi khi xóa: " + err);
            }
        }
    };

    if (loading) return <div className="p-5 text-center fw-bold">⌛ Đang tải danh mục...</div>;

    return (
        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
            <h3 className="fw-bold mb-4 text-dark text-uppercase">📁 Quản lý danh mục</h3>

            <form onSubmit={handleAdd} className="d-flex gap-2 mb-4 bg-light p-3 rounded-3 border">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tên danh mục mới..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                />
                <button className="btn btn-primary px-4 fw-bold">THÊM</button>
            </form>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th className="py-3">ID</th>
                            <th className="py-3">Tên danh mục</th>
                            <th className="py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items && items.length > 0 ? (
                            items.map(cat => (
                                <tr key={cat.categoryId}>
                                    <td>#{cat.categoryId}</td>
                                    <td>
                                        {editId === cat.categoryId ? (
                                            <input
                                                type="text"
                                                className="form-control form-control-sm border-primary"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                            />
                                        ) : (
                                            <span className="fw-bold text-primary">{cat.categoryName}</span>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        {editId === cat.categoryId ? (
                                            <>
                                                <button onClick={() => handleUpdate(cat.categoryId)} className="btn btn-sm btn-success me-2 fw-bold">Lưu</button>
                                                <button onClick={() => setEditId(null)} className="btn btn-sm btn-secondary">Hủy</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEditClick(cat)} className="btn btn-sm btn-outline-primary me-2">Sửa</button>
                                                <button onClick={() => handleDelete(cat.categoryId)} className="btn btn-sm btn-outline-danger px-3 fw-bold">Xóa</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-5 text-muted">Chưa có dữ liệu.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategories;