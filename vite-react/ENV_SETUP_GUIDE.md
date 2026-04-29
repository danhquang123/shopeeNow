# 🔐 Environment Variables Setup

## 📋 Tạo `.env.local` File

Tạo file `.env.local` tại root của `vite-react` folder:

```bash
d:\Start\full_stack_ec\vite-react\.env.local
```

## ✅ Development Configuration

```env
# ===== LOCAL DEVELOPMENT =====
VITE_API_URL=http://localhost:8080/api
VITE_OPENAI_URL=http://localhost:8080
```

## 🚀 Production Configuration

```env
# ===== PRODUCTION (EXAMPLE) =====
VITE_API_URL=https://api.shopee-now.com/api
VITE_OPENAI_URL=https://api.shopee-now.com
```

Hoặc nếu dùng domain khác:

```env
# ===== PRODUCTION (AWS/Azure) =====
VITE_API_URL=https://backend-api.herokuapp.com/api
VITE_OPENAI_URL=https://backend-api.herokuapp.com
```

## 🔧 Sử Dụng trong Code

### Frontend API:
```javascript
// Tự động sử dụng từ .env.local
import.meta.env.VITE_API_URL
// Kết quả: http://localhost:8080/api
```

### AI Chat API:
```javascript
// Tự động sử dụng từ .env.local
import.meta.env.VITE_OPENAI_URL
// Kết quả: http://localhost:8080
```

## 📝 File Reference

### `.env` (Template)
```env
VITE_API_URL=http://localhost:8080/api
VITE_OPENAI_URL=http://localhost:8080
```

### `.env.local` (Your Config - **Không commit lên Git**)
```env
VITE_API_URL=http://localhost:8080/api
VITE_OPENAI_URL=http://localhost:8080
```

### `.env.production` (Build time)
```env
VITE_API_URL=https://api.shopee-now.com/api
VITE_OPENAI_URL=https://api.shopee-now.com
```

## ⚙️ Vite Auto-load Priority

```
.env.local (highest priority - không commit)
  ↓
.env.[mode].local (e.g., .env.production.local)
  ↓
.env.[mode] (e.g., .env.production)
  ↓
.env (lowest priority - commit được)
```

## 🌐 Domain Examples

### AWS:
```env
VITE_API_URL=https://api-12345.execute-api.us-east-1.amazonaws.com/api
VITE_OPENAI_URL=https://api-12345.execute-api.us-east-1.amazonaws.com
```

### Azure:
```env
VITE_API_URL=https://shopee-now-api.azurewebsites.net/api
VITE_OPENAI_URL=https://shopee-now-api.azurewebsites.net
```

### Vercel (Frontend) + Custom Backend:
```env
VITE_API_URL=https://shopee-backend.herokuapp.com/api
VITE_OPENAI_URL=https://shopee-backend.herokuapp.com
```

### Docker/Local Network:
```env
VITE_API_URL=http://backend:8080/api
VITE_OPENAI_URL=http://backend:8080
```

## ✨ Tips

1. **Dev Server:**
   ```bash
   npm run dev
   # Sẽ tự load .env.local
   ```

2. **Production Build:**
   ```bash
   npm run build
   # Sẽ tự load .env.production
   ```

3. **Verify Environment:**
   ```javascript
   console.log(import.meta.env.VITE_API_URL);
   console.log(import.meta.env.VITE_OPENAI_URL);
   ```

4. **Change at Runtime:**
   Không được! Phải rebuild. Nhưng có thể dùng API endpoint detect dynamic:
   ```javascript
   const backendUrl = localStorage.getItem('backendUrl') || import.meta.env.VITE_OPENAI_URL;
   ```

## 🚨 Troubleshooting

### Vite không tìm thấy env variable?
```javascript
❌ process.env.VITE_API_URL  // WRONG - Vite specific
✅ import.meta.env.VITE_API_URL  // CORRECT
```

### URL không update sau khi đổi .env?
```bash
# Xóa cache + restart dev server
npm run dev

# Hoặc Ctrl+Shift+R (hard refresh browser)
```

### Env variable undefined?
```bash
# Kiểm tra file .env.local tồn tại chưa
# Kiểm tra console có warning không
# Restart npm run dev
```

## 📌 Git Configuration

### `.gitignore`
```
.env.local
.env.production.local
```

### Commit only these:
```
✅ .env (template)
✅ .env.example (example)
❌ .env.local (never!)
❌ .env.production.local (never!)
```

---

**Status**: ✅ Setup Complete  
**Updated**: April 29, 2026
