import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsersApi } from '../../api/user/userApi';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getUsersApi();
                setUsers(data || []);
            } catch (err) {
                setError('Không tải được danh sách người dùng. Vui lòng thêm API sau.');
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const handleAddUser = () => {
        alert('Chức năng thêm người dùng sẽ bật khi API thêm người dùng được triển khai.');
    };

    const handleEditUser = (username) => {
        alert(`Chức năng sửa ${username} sẽ bật khi API sửa người dùng được hoàn thiện.`);
    };

    const handleDeleteUser = (username) => {
        alert(`Chức năng xóa ${username} sẽ bật khi API xóa người dùng được hoàn thiện.`);
    };

    return (
        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '15px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold text-dark mb-1">Quản lý người dùng</h3>
                    <p className="text-muted small">Danh sách người dùng và vai trò của họ.</p>
                </div>
                <button
                    className="btn btn-primary px-4 fw-bold rounded-3 shadow-sm"
                    onClick={handleAddUser}
                >
                    + THÊM NGƯỜI DÙNG
                </button>
            </div>

            {loading ? (
                <div className="p-5 text-center fw-bold">⌛ Đang tải dữ liệu người dùng...</div>
            ) : error ? (
                <div className="alert alert-warning">{error}</div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th className="py-3">ID</th>
                                <th className="py-3">Tên đăng nhập</th>
                                <th className="py-3">Email</th>
                                <th className="py-3">Vai trò</th>
                                <th className="py-3 text-center">Trạng thái</th>
                                <th className="py-3 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>#{user.id}</td>
                                        <td className="fw-bold text-dark">{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.roles.join(', ')}</td>
                                        <td className="text-center">
                                            <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2 justify-content-center">
                                                <button
                                                    className="btn btn-sm btn-outline-warning px-3 fw-bold"
                                                    onClick={() => handleEditUser(user.username)}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger px-3 fw-bold"
                                                    onClick={() => handleDeleteUser(user.username)}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">
                                        Chưa có dữ liệu người dùng. Khi API sẵn sàng, danh sách sẽ xuất hiện ở đây.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
