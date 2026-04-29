# ✨ AI Chat Advanced Features - Complete Guide

## 🎉 Mới Tạo (April 29, 2026)

### 1️⃣ **AIDialogAdvanced** ✨ 
- Hộp thoại chat với **3 modes**
- Mode selector ở header
- Dynamic background gradient
- Message color changes by mode
- System notifications

### 2️⃣ **FooterAIChat** ✨
- 🤖 Floating button ở footer (fixed position)
- Bobbing animation
- Green pulse dot (online indicator)
- Tooltip on hover
- Mở AIDialogAdvanced khi click

### 3️⃣ **Environment Variables** ✨
- URL động từ `.env.local`
- Support production URLs
- No hardcoding localhost:8080

---

## 🚀 Quick Setup

### Step 1: Create `.env.local`
```bash
cd d:\Start\full_stack_ec\vite-react
```

Tạo file `.env.local`:
```env
VITE_API_URL=http://localhost:8080/api
VITE_OPENAI_URL=http://localhost:8080
```

### Step 2: Restart Dev Server
```bash
npm run dev
```

### Step 3: See Floating Button
```
✅ 🤖 Button xuất hiện ở bottom-right corner
✅ Có green pulse dot (online)
✅ Hover hiển thị "Chat với AI"
```

### Step 4: Click to Open
```
✅ Dialog mở với 3 mode selector
✅ Mode: 🤖 General | 👗 Fashion | 💬 Support
✅ Background thay đổi theo mode
✅ Chat bình thường
```

---

## 📁 Folder Structure

```
vite-react/
├── .env                              # Template
├── .env.local                        # ✨ Your config (gitignored)
├── ENV_SETUP_GUIDE.md               # ✨ Environment setup guide
├── src/
│   ├── api/
│   │   └── ai/
│   │       └── chatApi.js            # 🔄 Updated (env variable)
│   ├── components/
│   │   └── AIChat/
│   │       ├── AIIcon.jsx
│   │       ├── AIDialog.jsx
│   │       ├── AIDialog.css
│   │       ├── AIDialogAdvanced.jsx   # ✨ NEW
│   │       ├── AIDialogAdvanced.css   # ✨ NEW
│   │       ├── FooterAIChat.jsx       # ✨ NEW
│   │       ├── FooterAIChat.css       # ✨ NEW
│   │       ├── index.jsx              # 🔄 Updated
│   │       └── README.md              # 🔄 Updated
│   └── layouts/
│       ├── Layout.jsx                # 🔄 Added FooterAIChat
│       └── AdminLayout.jsx
```

---

## 🎨 Chat Modes Details

### Mode 1: General (🤖)
- **Color**: Blue (#0d6efd → #0056b3)
- **API**: `chatWithAI()`
- **Use**: Sản phẩm, đặt hàng, thanh toán
- **Background**: Blue gradient

### Mode 2: Fashion (👗)
- **Color**: Purple (#d946ef → #a855f7)
- **API**: `getFashionAdvice()`
- **Use**: Phong cách, kết hợp, xu hướng
- **Background**: Purple gradient

### Mode 3: Support (💬)
- **Color**: Green (#10b981 → #059669)
- **API**: `chatWithAI()`
- **Use**: Hỗ trợ, đổi trả, khiếu nại
- **Background**: Green gradient

---

## 🔧 Code Examples

### Use in Components
```jsx
import FooterAIChat from '../components/AIChat/FooterAIChat';

// Auto show floating button at footer
<FooterAIChat />
```

### Manual Dialog
```jsx
import { AIDialogAdvanced } from '../components/AIChat';
import { useState } from 'react';

export function MyComponent() {
    const [show, setShow] = useState(false);

    return (
        <>
            <button onClick={() => setShow(true)}>Open AI</button>
            <AIDialogAdvanced show={show} handleClose={() => setShow(false)} />
        </>
    );
}
```

### API Usage
```jsx
import { chatWithAI, getFashionAdvice } from '../api/ai/chatApi';

// General chat
const response = await chatWithAI("Hỏi gì?");

// Fashion advice (mode Fashion)
const advice = await getFashionAdvice("casual", "male", "daily", "summer");
```

### Environment Variables
```javascript
// Sử dụng URL động
const apiUrl = import.meta.env.VITE_API_URL;
const aiUrl = import.meta.env.VITE_OPENAI_URL;

console.log('API:', apiUrl); // http://localhost:8080/api
console.log('AI:', aiUrl);   // http://localhost:8080
```

---

## 🔐 Production Deployment

### Step 1: Build
```bash
npm run build
```

### Step 2: Create `.env.production`
```env
VITE_API_URL=https://api.shopee-now.com/api
VITE_OPENAI_URL=https://api.shopee-now.com
```

### Step 3: Deploy
```bash
# Auto pick .env.production on build
npm run build

# Upload dist/ to server
```

### Step 4: Verify
```javascript
// Frontend will use production URLs
import.meta.env.VITE_OPENAI_URL 
// → https://api.shopee-now.com
```

---

## 🎯 Features at a Glance

| Feature | Status | Details |
|---------|--------|---------|
| Footer Button | ✅ NEW | 🤖 Fixed position, bobbing animation |
| Mode Selector | ✅ NEW | 3 modes: General, Fashion, Support |
| Dynamic Background | ✅ NEW | Change gradient by mode |
| Environment Variables | ✅ NEW | No hardcoded localhost:8080 |
| Responsive | ✅ | Mobile, tablet, desktop |
| Typing Animation | ✅ | 3 dots animation |
| Message History | ✅ | 20 latest messages |
| Error Handling | ✅ | User-friendly messages |

---

## 📱 Responsive Breakpoints

```
Desktop (> 1024px):
- Button: 60x60px
- Dialog: 420px width
- Full features

Tablet (768px - 1024px):
- Button: 55x55px
- Dialog: responsive
- All features

Mobile (< 768px):
- Button: 50x50px
- Dialog: full width - 20px
- Mode labels hidden
- Optimized for touch
```

---

## 🐛 Common Issues & Fixes

### Issue 1: Floating button not showing
```bash
# Check 1: .env.local exists?
ls .env.local

# Check 2: npm run dev restarted?
npm run dev

# Check 3: Hard refresh browser?
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### Issue 2: API 404 error
```bash
# Check 1: Backend running?
http://localhost:8080/openai/chat

# Check 2: VITE_OPENAI_URL correct?
console.log(import.meta.env.VITE_OPENAI_URL)

# Check 3: Browser console log?
🤖 AI API URL: http://localhost:8080
```

### Issue 3: Mode background not changing
```bash
# Hard refresh browser
# Check CSS file imported
# Clear browser cache
```

---

## 📚 Related Files

- `ENV_SETUP_GUIDE.md` - Complete environment setup
- `src/components/AIChat/README.md` - AI Chat component docs
- `src/api/ai/chatApi.js` - API service code
- `sb-ecom/BACKEND_AI_SETUP.md` - Backend setup

---

## 💡 Next Steps

### Optional Enhancements:
1. **Save Chat History**: Store in localStorage or database
2. **User Identification**: Tie chat to specific user
3. **Chat Analytics**: Track user questions
4. **Rate System**: User rate AI responses
5. **Image Upload**: Ask AI about uploaded images
6. **Multi-language**: Support English, Chinese, etc.

### Production Ready:
- ✅ Environment variables setup
- ✅ 3 chat modes working
- ✅ Responsive design
- ✅ Error handling
- ✅ Footer button optimized

---

## 🚀 Deployment Checklist

- [ ] `.env.local` created with dev URLs
- [ ] `.env.production` created for production
- [ ] `npm run dev` tested locally
- [ ] 🤖 Button visible at footer
- [ ] Mode selector working (background changes)
- [ ] Chat mode sends messages correctly
- [ ] Backend responds on all 3 modes
- [ ] Responsive tested on mobile
- [ ] Hard refresh tested (Ctrl+Shift+R)
- [ ] Console logs show correct URLs
- [ ] Ready to deploy!

---

## 📞 Support

**Questions?**
- Check `ENV_SETUP_GUIDE.md` for environment setup
- Check `AIChat/README.md` for component docs
- Check console for error logs
- Check Network tab for API calls

---

**Status**: ✅ Production Ready  
**Version**: 2.0 (Advanced Features)  
**Date**: April 29, 2026  
**Project**: ShopeeNow E-Commerce

---

### 🎓 Learn More
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Spring AI OpenAI](https://docs.spring.io/spring-ai/reference/api/chat.html)
- [React Hooks](https://react.dev/reference/react)
