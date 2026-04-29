import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI, getFashionAdvice } from '../../api/ai/chatApi';
import './AIDialogAdvanced.css';

/**
 * AI Chat Dialog Advanced - Với mode selection
 * Modes: General (General), Fashion (Thời trang), Support (Hỗ trợ)
 */
const AIDialogAdvanced = ({ show, handleClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Xin chào! 👋 Tôi là AI Assistant của ShopeeNow. Bạn muốn chúng ta nói chuyện về chủ đề nào?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatMode, setChatMode] = useState('general'); // general, fashion, support
    const messagesEndRef = useRef(null);

    // Chat mode config
    const modeConfig = {
        general: {
            name: 'Tư vấn chung',
            icon: '🤖',
            bg: 'linear-gradient(135deg, #0d6efd 0%, #0056b3 100%)',
            description: 'Hỏi về sản phẩm, đặt hàng, thanh toán'
        },
        fashion: {
            name: 'Tư vấn thời trang',
            icon: '👗',
            bg: 'linear-gradient(135deg, #d946ef 0%, #a855f7 100%)',
            description: 'Phong cách, kết hợp đồ, xu hướng'
        },
        support: {
            name: 'Hỗ trợ khách hàng',
            icon: '💬',
            bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            description: 'Đổi trả, vận chuyển, khiếu nại'
        }
    };

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setLoading(true);

        try {
            let response;

            // Gọi API tương ứng với mode
            if (chatMode === 'fashion') {
                response = await getFashionAdvice('casual', 'unisex', 'daily', 'all-season');
            } else {
                response = await chatWithAI(inputValue);
            }

            const aiMessage = {
                id: messages.length + 2,
                text: response,
                sender: 'ai',
                timestamp: new Date(),
                mode: chatMode
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error calling AI:', error);

            const errorMessage = {
                id: messages.length + 2,
                text: '😞 Xin lỗi, tôi gặp sự cố. Vui lòng thử lại sau.',
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleModeChange = (newMode) => {
        setChatMode(newMode);
        // Thêm message thông báo đổi mode
        const notifyMessage = {
            id: messages.length + 1,
            text: `✨ Chuyển sang mode "${modeConfig[newMode].name}"`,
            sender: 'system',
            timestamp: new Date()
        };
        setMessages((prev) => [...prev, notifyMessage]);
    };

    if (!show) return null;

    const currentMode = modeConfig[chatMode];

    return (
        <>
            {/* Backdrop */}
            <div className="ai-dialog-backdrop" onClick={handleClose} />

            {/* Dialog */}
            <div
                className="ai-dialog-advanced"
                style={{ '--mode-bg': currentMode.bg }}
            >
                {/* Header */}
                <div className="ai-dialog-header-advanced" style={{ background: currentMode.bg }}>
                    <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '24px' }}>{currentMode.icon}</span>
                        <div>
                            <h6 className="mb-0 fw-bold">{currentMode.name}</h6>
                            <small className="text-white-50">{currentMode.description}</small>
                        </div>
                    </div>
                    <button
                        className="btn-close btn-close-white"
                        onClick={handleClose}
                        aria-label="Close"
                    />
                </div>

                {/* Mode Selector */}
                <div className="mode-selector-container">
                    {Object.entries(modeConfig).map(([key, mode]) => (
                        <button
                            key={key}
                            className={`mode-btn ${chatMode === key ? 'active' : ''}`}
                            onClick={() => handleModeChange(key)}
                            style={{
                                borderBottomColor: chatMode === key ? mode.bg.split('(')[1].split(' ')[0] : 'transparent'
                            }}
                        >
                            <span>{mode.icon}</span>
                            <small>{mode.name}</small>
                        </button>
                    ))}
                </div>

                {/* Messages */}
                <div className="ai-dialog-messages-advanced">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message-wrapper ${message.sender === 'user' ? 'user-message' : message.sender === 'system' ? 'system-message' : 'ai-message'}`}
                        >
                            {message.sender === 'system' ? (
                                <div className="system-message-content">{message.text}</div>
                            ) : (
                                <>
                                    <div className={`message-bubble ${chatMode}`}>
                                        {message.text}
                                    </div>
                                    <small className="message-time">
                                        {message.timestamp.toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </small>
                                </>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="message-wrapper ai-message">
                            <div className={`message-bubble typing ${chatMode}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="ai-dialog-input-advanced">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={`Nhập câu hỏi về ${currentMode.name.toLowerCase()}...`}
                        className="message-input-advanced"
                        disabled={loading}
                        rows="2"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={loading || !inputValue.trim()}
                        className="btn-send-advanced"
                        style={{ background: currentMode.bg }}
                    >
                        {loading ? '⏳' : '📤'}
                    </button>
                </div>

                {/* Footer Tips */}
                <div className="ai-dialog-footer-advanced">
                    <small className="text-muted text-center d-block">
                        💡 Tip: Chọn mode khác để thay đổi chủ đề trò chuyện
                    </small>
                </div>
            </div>
        </>
    );
};

export default AIDialogAdvanced;
