import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AddressInfoModal from './AddressInfoModal';
import AddressForm from './AddressForm';
import AddressList from './AddressList';
import { getUserAddressesApi, deleteAddressApi } from '../../api/address/addressApi';

const AddressInfo = ({ selectedAddressId, onSelectAddress }) => {
    const [openAddressModal, setOpenAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { isAuthenticated } = useSelector((state) => state.auth || {});

    const getAddressKey = (address) => address.addressId ?? address.id ?? address.address_id;

    const loadAddresses = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getUserAddressesApi();
            const addressList = Array.isArray(data) ? data : [];
            setAddresses(addressList);

            if (addressList.length > 0 && !selectedAddressId) {
                onSelectAddress?.(addressList[0]);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Không tải được địa chỉ người dùng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadAddresses();
        } else {
            setAddresses([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const handleAddressSaved = (newAddress) => {
        setOpenAddressModal(false);
        setEditingAddress(null);
        if (newAddress) {
            onSelectAddress?.(newAddress);
        }
        loadAddresses();
    };

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setOpenAddressModal(true);
    };

    const handleDeleteAddress = async (address) => {
        const addressKey = getAddressKey(address);
        if (!addressKey) return;
        const confirmed = window.confirm('Bạn có chắc muốn xóa địa chỉ này không?');
        if (!confirmed) return;

        try {
            await deleteAddressApi(addressKey);
            if (selectedAddressId === addressKey) {
                onSelectAddress?.(null);
            }
            await loadAddresses();
            alert('Xóa địa chỉ thành công.');
        } catch (err) {
            console.error('Lỗi xóa địa chỉ:', err);
            alert(err.response?.data?.message || err.message || 'Xóa địa chỉ thất bại.');
        }
    };

    const addNewAddressHandler = () => {
        if (!isAuthenticated) {
            alert('Bạn cần đăng nhập trước khi thêm địa chỉ. Vui lòng mở form đăng nhập ở góc trên bên phải.');
            return;
        }

        setEditingAddress(null);
        setOpenAddressModal(true);
    };

    return (
        <div className="text-start p-3 max-w-xl mx-auto">
            {!isAuthenticated ? (
                <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mb-4">
                    <div className="display-4 mb-2">🔒</div>
                    <p className="text-muted fw-bold">Bạn cần đăng nhập để xem và thêm địa chỉ giao hàng.</p>
                    <p className="small text-secondary">Nhấn nút Đăng nhập ở góc trên bên phải để tiếp tục.</p>
                </div>
            ) : (
                <AddressList
                    addresses={addresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={onSelectAddress}
                    onEditAddress={handleEditAddress}
                    onDeleteAddress={handleDeleteAddress}
                    loading={loading}
                    error={error}
                />
            )}

            <AddressInfoModal open={openAddressModal} setOpen={setOpenAddressModal}>
                <AddressForm
                    address={editingAddress}
                    onCancel={() => {
                        setEditingAddress(null);
                        setOpenAddressModal(false);
                    }}
                    onSaved={handleAddressSaved}
                />
            </AddressInfoModal>

            <button
                className="btn btn-outline-primary w-100 mb-4 py-3 rounded-2xl fw-bold border-2 d-flex align-items-center justify-content-center gap-2"
                onClick={addNewAddressHandler}
            >
                <span>+</span> Thêm địa chỉ mới
            </button>
        </div>
    );
};

export default AddressInfo;