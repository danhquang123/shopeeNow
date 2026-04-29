import React, { useState } from 'react';
import AIDialogAdvanced from './AIDialogAdvanced';
import './FooterAIChat.css';

/**
 * Footer AI Chat - Icon cố định ở footer, mở AIDialogAdvanced khi click
 */
const FooterAIChat = () => {
    const [showAIDialog, setShowAIDialog] = useState(false);

    return (
        <>
            {/* Floating AI Chat Button - Fixed ở footer */}
            <button
                className="footer-ai-chat-btn"
                onClick={() => setShowAIDialog(true)}
                title="Mở AI Chat Assistant"
            >
                <span className="ai-chat-icon">🤖</span>
                <div className="pulse-dot"></div>
            </button>

            {/* AI Dialog Advanced */}
            <AIDialogAdvanced
                show={showAIDialog}
                handleClose={() => setShowAIDialog(false)}
            />
        </>
    );
};

export default FooterAIChat;
