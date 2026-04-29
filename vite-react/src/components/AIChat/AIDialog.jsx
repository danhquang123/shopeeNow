import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../../api/ai/chatApi';
import './AIDialog.css';

/**
 * AI Chat Dialog - Hộp thoại chat với AI Assistant
 * @param {Boolean} show - Hiển thị hay ẩn dialog
 * @param {Function} handleClose - Hàm đóng dialog
 */
const AIDialog = ({ show, handleClose }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Xin chào! 👋 Tôi là AI Assistant của ShopeeNow. Có thể giúp bạn điều gì?",
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto scroll to bottom khi có message mới
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
            // Call AI API
            const response = await chatWithAI(inputValue);

            const aiMessage = {
                id: messages.length + 2,
                text: response,
                sender: 'ai',
                timestamp: new Date()
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

    if (!show) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="ai-dialog-backdrop"
                onClick={handleClose}
            />

            {/* Dialog */}
            <div className="ai-dialog-container">
                {/* Header */}
                <div className="ai-dialog-header">
                    <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '24px' }}>🤖</span>
                        <div>
                            <h6 className="mb-0 fw-bold">AI Assistant</h6>
                            <small className="text-muted">Online</small>
                        </div>
                    </div>
                    <button
                        className="btn-close"
                        onClick={handleClose}
                        aria-label="Close"
                    />
                </div>

                {/* Messages */}
                <div className="ai-dialog-messages">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message-wrapper ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                        >
                            <div className="message-bubble">
                                {message.text}
                            </div>
                            <small className="message-time">
                                {message.timestamp.toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </small>
                        </div>
                    ))}

                    {loading && (
                        <div className="message-wrapper ai-message">
                            <div className="message-bubble typing">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="ai-dialog-input">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập câu hỏi của bạn..."
                        className="message-input"
                        disabled={loading}
                        rows="2"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={loading || !inputValue.trim()}
                        className="btn-send"
                    >
                        {loading ? '⏳' : '📤'}
                    </button>
                </div>

                {/* Footer Tips */}
                <div className="ai-dialog-footer">
                    <small className="text-muted text-center d-block">
                        💡 Bạn có thể hỏi về sản phẩm, thời trang, hàng mới, v.v...
                    </small>
                </div>
            </div>
        </>
    );
};

export default AIDialog;
