import React, { useState, useEffect } from 'react';
import { addAddressApi, updateAddressApi } from '../../api/address/addressApi';

const getAddressKey = (address) => address?.addressId ?? address?.id ?? address?.address_id;

const initialValues = {
    street: '',
    buildingName: '',
    city: '',
    state: '',
    country: 'Việt Nam',
    pincode: '',
};

const AddAddressForm = ({ address, onCancel, onSaved }) => {
    const [formData, setFormData] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (address) {
            setFormData({
                street: address.street || '',
                buildingName: address.buildingName || '',
                city: address.city || '',
                state: address.state || '',
                country: address.country || 'Việt Nam',
                pincode: address.pincode || '',
            });
        } else {
            setFormData(initialValues);
        }
    }, [address]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const isEdit = Boolean(getAddressKey(address));
            const saved = isEdit
                ? await updateAddressApi(getAddressKey(address), formData)
                : await addAddressApi(formData);
            alert(`Địa chỉ đã được ${isEdit ? 'cập nhật' : 'lưu'} thành công.`);
            setFormData(initialValues);
            onSaved?.(saved);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Lưu địa chỉ thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="text-start">
            {error && (
                <div className="alert alert-danger py-2 small mb-3" role="alert">
                    {error}
                </div>
            )}

            <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">ĐỊA CHỈ</label>
                <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="form-control rounded-xl border-2 shadow-none"
                    placeholder="Số nhà, tên đường"
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">TÊN TÒA NHÀ / DỰ ÁN</label>
                <input
                    type="text"
                    name="buildingName"
                    value={formData.buildingName}
                    onChange={handleChange}
                    className="form-control rounded-xl border-2 shadow-none"
                    placeholder="Chung cư, tòa nhà, khu phố..."
                    required
                />
            </div>
            <div className="mb-3 row g-2">
                <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">THÀNH PHỐ</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-control rounded-xl border-2 shadow-none"
                        placeholder="Hà Nội"
                        required
                    />
                </div>
                <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">TỈNH / QUẬN</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="form-control rounded-xl border-2 shadow-none"
                        placeholder="Cầu Giấy"
                        required
                    />
                </div>
            </div>
            <div className="mb-3 row g-2">
                <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">QUỐC GIA</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="form-control rounded-xl border-2 shadow-none"
                        required
                    />
                </div>
                <div className="col-6">
                    <label className="form-label small fw-bold text-secondary">MÃ BƯU CHÍNH</label>
                    <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="form-control rounded-xl border-2 shadow-none"
                        placeholder="100000"
                        required
                    />
                </div>
            </div>

            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary flex-grow-1 fw-bold rounded-xl py-2 shadow-sm" disabled={loading}>
                    {loading ? 'ĐANG LƯU...' : getAddressKey(address) ? 'CẬP NHẬT' : 'LƯU'}
                </button>
                <button type="button" className="btn btn-light flex-grow-1 fw-bold rounded-xl py-2" onClick={onCancel} disabled={loading}>
                    HỦY
                </button>
            </div>
        </form>
    );
};

export default AddAddressForm;