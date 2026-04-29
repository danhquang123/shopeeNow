# 🤖 AI Chat Integration Guide

## 📁 Cấu trúc Folder

```
src/
├── api/
│   └── ai/
│       └── chatApi.js           # API service cho AI Chat (dùng env variable)
├── components/
│   └── AIChat/
│       ├── AIIcon.jsx           # Nút icon AI ở header
│       ├── AIDialog.jsx         # Hộp thoại chat đơn giản
│       ├── AIDialogAdvanced.jsx # Hộp thoại chat với mode selection ✨ NEW
│       ├── FooterAIChat.jsx     # Icon cố định ở footer ✨ NEW
│       ├── AIDialog.css         # Styling cho AIDialog
│       ├── AIDialogAdvanced.css # Styling cho AIDialogAdvanced ✨ NEW
│       ├── FooterAIChat.css     # Styling cho FooterAIChat ✨ NEW
│       ├── index.jsx            # Export chung
│       └── README.md            # This file
└── layouts/
    ├── Layout.jsx               # Layout user (có Header + Footer + AI)
    └── AdminLayout.jsx          # Layout admin (có AI)
```

## 🚀 Tính Năng

### AIDialog (Simple)
- ✅ Chat cơ bản ở header
- ✅ Conversation history (20 messages)
- ✅ Typing animation
- ✅ Responsive

### AIDialogAdvanced (Footer - NEW) ✨
- ✅ **3 Chat Modes:**
  - 🤖 General (Tư vấn chung)
  - 👗 Fashion (Tư vấn thời trang)
  - 💬 Support (Hỗ trợ khách hàng)
- ✅ Mode selector với background khác nhau
- ✅ Dynamic background gradient
- ✅ Message color changes by mode
- ✅ System notifications
- ✅ Better UI/UX

### FooterAIChat (NEW) ✨
- ✅ Fixed button ở footer (bottom-right)
- ✅ 🤖 Icon với bobbing animation
- ✅ Green pulse dot (online indicator)
- ✅ Mở AIDialogAdvanced khi click
- ✅ Responsive
- ✅ Tooltip "Chat với AI"

### Environment Variables (NEW) ✨
- ✅ URL động từ `.env.local`
- ✅ Support production URLs
- ✅ No hardcoding localhost:8080

## 📝 Cách Sử Dụng

### 1. Setup Environment Variables

Tạo file `.env.local` ở root `vite-react`:

```env
# Development
VITE_API_URL=http://localhost:8080/api
VITE_OPENAI_URL=http://localhost:8080

# Production (example)
# VITE_API_URL=https://api.shopee-now.com/api
# VITE_OPENAI_URL=https://api.shopee-now.com
```

### 2. Footer AI Chat (Tự động)
Không cần cấu hình gì, `Layout.jsx` đã include `FooterAIChat`:
```jsx
import FooterAIChat from '../components/AIChat/FooterAIChat';

const Layout = () => {
    return (
        <>
            <Header />
            <main><Outlet /></main>
            <Footer />
            <FooterAIChat /> {/* ✨ Auto show floating button */}
        </>
    );
};
```

### 3. Header AI Chat (Optional)
Nếu muốn header có AI button:
```jsx
import { AIIcon, AIDialog } from '../components/AIChat';
const [showAI, setShowAI] = useState(false);

<AIIcon onClick={() => setShowAI(true)} />
<AIDialog show={showAI} handleClose={() => setShowAI(false)} />
```

### 4. API Service
```javascript
import { chatWithAI, getFashionAdvice, generateImage } from '../api/ai/chatApi';

// Chat
const response = await chatWithAI("Hỏi gì đó");

// Fashion
const advice = await getFashionAdvice("casual", "male", "daily", "summer");

// Image
const images = await generateImage("áo thun nam");
```

## 🎨 Chat Modes

| Mode | Icon | Background | Use Case |
|------|------|-----------|----------|
| General | 🤖 | Blue | Sản phẩm, đặt hàng |
| Fashion | 👗 | Purple | Phong cách, kết hợp |
| Support | 💬 | Green | Hỗ trợ, khiếu nại |

## 🔧 Tùy chỉnh

### Đổi màu mode
Sửa ở `AIDialogAdvanced.jsx`:
```javascript
const modeConfig = {
    general: {
        bg: 'linear-gradient(135deg, #0d6efd 0%, #0056b3 100%)', // Đổi này
        ...
    },
    ...
};
```

### Đổi icon
```javascript
fashion: {
    icon: '👗', // Đổi emoji này
    ...
}
```

### Đổi kích thước footer button
Sửa ở `FooterAIChat.css`:
```css
.footer-ai-chat-btn {
    width: 60px;  /* Đổi */
    height: 60px; /* Đổi */
    bottom: 40px; /* Position */
    right: 40px;  /* Position */
}
```

## 🔐 Environment Variable

**Không cần** hardcode URL nữa! Sử dụng:

```javascript
// OLD (❌ Hardcoded)
const baseURL = 'http://localhost:8080';

// NEW (✅ Dynamic)
const baseURL = import.meta.env.VITE_OPENAI_URL;
```

### Deploy lên Production:
1. Build: `npm run build`
2. Tạo `.env.production`:
```env
VITE_OPENAI_URL=https://api.shopee-now.com
```
3. Push lên server
4. Auto load production URL! 🚀

## 📱 Responsive Behavior

```
Desktop:
- Footer button: 60x60px, bottom-right
- Dialog: 420px width, bottom-right

Tablet:
- Footer button: 55x55px
- Dialog: responsive 100% width

Mobile:
- Footer button: 50x50px, hidden label
- Dialog: Full width - 20px
- Mode selector: 3 icons only (no text)
```

## 🔍 Debugging

### Check environment:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('OpenAI URL:', import.meta.env.VITE_OPENAI_URL);
```

### Check Network Tab:
```
http://localhost:8080/openai/chat ✅ (should see 200 OK)
```

### Check Console:
```
🤖 AI API URL: http://localhost:8080
```

## 🐛 Common Issues

### 1. Dialog tidak hiển thị?
```bash
# Kiểm tra CSS import
# Kiểm tra .env.local tồn tại
# Hard refresh: Ctrl+Shift+R
```

### 2. API 404?
```bash
# Kiểm tra backend đang chạy port 8080
# Kiểm tra VITE_OPENAI_URL đúng
# Check console: 🤖 AI API URL log
```

### 3. Environment variable undefined?
```bash
# Restart: npm run dev
# Xóa .env.local cache
# Kiểm tra file .env.local tồn tại
```

### 4. Button không nổi lên footer?
```css
/* Kiểm tra z-index */
.footer-ai-chat-btn {
    z-index: 1000; /* Should be high */
}
```

## 📚 Files Created

```
✨ src/api/ai/chatApi.js (Updated - env variable)
✨ src/components/AIChat/AIDialogAdvanced.jsx (NEW)
✨ src/components/AIChat/AIDialogAdvanced.css (NEW)
✨ src/components/AIChat/FooterAIChat.jsx (NEW)
✨ src/components/AIChat/FooterAIChat.css (NEW)
✨ .env.local (NEW - your config)
✨ ENV_SETUP_GUIDE.md (NEW - reference)
🔄 src/layouts/Layout.jsx (Updated - added FooterAIChat)
🔄 src/components/AIChat/index.jsx (Updated - exports)
```

## 🚀 Quick Start

1. **Create `.env.local`:**
```bash
cd d:\Start\full_stack_ec\vite-react
# Create .env.local with above config
```

2. **Restart dev server:**
```bash
npm run dev
```

3. **See floating button:**
```
Should see 🤖 button at bottom-right corner
```

4. **Click to open:**
```
Dialog opens with mode selector (🤖 👗 💬)
```

5. **Test modes:**
```
- Switch between modes (background changes)
- Type message and send
- AI responds!
```

---

**Status**: ✅ Production Ready  
**Last Updated**: April 29, 2026  
**Features**: 3 Chat Modes + Environment Variables + Footer Button

