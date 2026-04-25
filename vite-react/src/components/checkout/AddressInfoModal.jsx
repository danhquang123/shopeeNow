import React from 'react';

const AddressInfoModal = ({ open, setOpen, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
            <div className="absolute inset-0" onClick={() => setOpen(false)}></div>
            <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl z-10">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="h4 fw-bold text-dark">New Shipping Address</h3>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setOpen(false)} />
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default AddressInfoModal;