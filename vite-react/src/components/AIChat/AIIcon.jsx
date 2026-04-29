import React from 'react';

/**
 * AI Icon Button - Nút để mở dialog chat
 * @param {Function} onClick - Hàm xử lý khi click
 */
const AIIcon = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="btn btn-light rounded-circle d-flex align-items-center justify-content-center"
            style={{
                width: '45px',
                height: '45px',
                border: '2px solid #0d6efd',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(13, 110, 253, 0.2)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.4)';
                e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(13, 110, 253, 0.2)';
                e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Chat với AI Assistant"
        >
            <span style={{ fontSize: '20px' }}>🤖</span>
            {/* Pulse animation dot */}
            <div
                style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#28a745',
                    borderRadius: '50%',
                    border: '2px solid white',
                    animation: 'pulse 2s infinite'
                }}
            />
            <style>{`
                @keyframes pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
                    }
                    70% {
                        box-shadow: 0 0 0 8px rgba(40, 167, 69, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
                    }
                }
            `}</style>
        </button>
    );
};

export default AIIcon;
