import React from 'react';

const getAddressKey = (address) => address.addressId ?? address.id ?? address.address_id;

const AddressList = ({
    addresses,
    selectedAddressId,
    onSelectAddress,
    onEditAddress,
    onDeleteAddress,
    loading,
    error,
}) => {
    if (loading) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-3xl border border-gray-200 mb-4">
                <p className="fw-bold">Đang tải địa chỉ...</p>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-warning text-start">{error}</div>;
    }

    if (!addresses?.length) {
        return (
            <div className="text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 mb-4">
                <div className="display-4 mb-2">📍</div>
                <p className="text-muted fw-bold">Bạn chưa có địa chỉ giao hàng nào.</p>
                <p className="small text-secondary">Thêm địa chỉ để tiếp tục đặt hàng.</p>
            </div>
        );
    }

    return (
        <div className="relative p-6 rounded-3xl bg-white shadow-sm border border-gray-100 mb-4">
            <h1 className="h4 fw-bold mb-4 text-dark text-capitalize">Chọn địa chỉ giao hàng</h1>
            {addresses.map((address) => {
                const addressKey = getAddressKey(address);
                const isSelected = selectedAddressId === addressKey;

                return (
                    <div
                        key={addressKey}
                        className={`border rounded-3 p-3 mb-3 text-start ${isSelected ? 'border-primary bg-white shadow-sm' : 'border-gray-200 bg-light'}`}
                        onClick={() => onSelectAddress?.(address)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex justify-content-between align-items-start gap-3">
                            <div>
                                <h6 className="mb-2 fw-bold">{address.buildingName || address.street || 'Địa chỉ mặc định'}</h6>
                                <p className="mb-1 small text-secondary">{address.street}</p>
                                <p className="mb-0 small text-secondary">{address.city}, {address.state}, {address.country}</p>
                                <p className="mb-0 small text-secondary">Mã bưu chính: {address.pincode}</p>
                            </div>
                            <div className="text-end">
                                <div className="badge rounded-pill text-bg-primary mb-2">{isSelected ? 'Đã chọn' : 'Chọn'}</div>
                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditAddress?.(address);
                                        }}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteAddress?.(address);
                                        }}
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AddressList;
