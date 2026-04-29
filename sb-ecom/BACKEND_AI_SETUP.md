# 🔧 Backend Setup cho AI Chat Integration

## 📋 Yêu cầu

Backend Spring Boot cần có:
- ✅ Spring AI (OpenAI integration)
- ✅ OpenAI API Key
- ✅ CORS Configuration (đã có WebConfig)

## 📦 Dependencies (pom.xml)

```xml
<!-- OpenAI Spring AI -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
</dependency>

<!-- Spring Web (nếu chưa có) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

## 🔑 Environment Setup

### 1. Thêm OpenAI API Key vào `application.properties`

```properties
# OpenAI Configuration
spring.ai.openai.api-key=${OPENAI_API_KEY}
spring.ai.openai.base-url=https://api.openai.com/v1

# Model settings
spring.ai.openai.chat.model=gpt-3.5-turbo
spring.ai.openai.image.model=dall-e-2

# CORS
frontend.url=http://localhost:3000,http://localhost:5173
```

### 2. Hoặc set Environment Variable
```bash
# Windows
set OPENAI_API_KEY=your_api_key_here

# Linux/Mac
export OPENAI_API_KEY=your_api_key_here
```

## 📁 Backend File Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/ecommerce/project/
│   │       ├── config/
│   │       │   └── WebConfig.java          # ✅ CORS config
│   │       ├── controller/
│   │       │   └── GenAIController.java    # ✅ AI endpoints
│   │       └── service/
│   │           └── OpenChat/
│   │               ├── ChatMemoryService.java      # ✅ Chat logic
│   │               ├── FashionAssistantService.java # ✅ Fashion advice
│   │               └── ImageService.java           # ✅ Image generation
│   └── resources/
│       └── application.properties           # ✅ Configuration
```

## ✅ Kiểm tra API Endpoints

### Test Chat Endpoint
```bash
curl "http://localhost:8080/openai/chat?prompt=Xin%20chào"
```

Response:
```json
"Xin chào! Tôi là AI Assistant của ShopeeNow..."
```

### Test Image Generation
```bash
curl "http://localhost:8080/openai/generate-image?prompt=áo%20thun%20nam&n=1&width=1024&height=1024"
```

Response:
```json
["https://oaidalleapiprodscus.blob.core.windows.net/private/..."]
```

### Test Fashion Advice
```bash
curl "http://localhost:8080/openai/fashion-advice?style=casual&gender=male&occasion=daily&season=summer"
```

Response:
```json
"Hãy mặc áo thun white và quần jean xanh..."
```

## 🔄 CORS Configuration (WebConfig.java)

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${frontend.url:http://localhost:3000,http://localhost:5173}")
    private String frontendUrl;
    
    @Bean
    public WebMvcConfigurer corsConfigurer(){
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(frontendUrl.split(","))
                        .allowedMethods("GET","POST","PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

## 🚀 Start Backend

```bash
# Terminal ở folder sb-ecom
cd d:\Start\full_stack_ec\sb-ecom

# Run Spring Boot
mvn spring-boot:run

# Hoặc
./mvnw spring-boot:run
```

Backend chạy ở: `http://localhost:8080`

## 🔍 Debugging

### Lỗi: "Cannot resolve ChatModel bean"
- ✅ Đảm bảo Spring AI dependency được thêm vào pom.xml
- ✅ Đảm bảo OpenAI API key được set

### Lỗi: "401 Unauthorized"
- ✅ Kiểm tra OpenAI API key
- ✅ API key phải hợp lệ và có balance

### Lỗi: "CORS error"
- ✅ Kiểm tra `frontend.url` trong application.properties
- ✅ Thêm frontend URL vào `allowedOrigins()`

### Lỗi: "Message history is empty"
- ✅ Đảm bảo ChatMemoryService khởi tạo `conversationHistory` list

## 📌 Production Deployment

```properties
# application.properties (Production)
spring.ai.openai.api-key=${OPENAI_API_KEY}
spring.ai.openai.base-url=https://api.openai.com/v1

# Frontend URLs (Production)
frontend.url=https://your-frontend.vercel.app,https://your-admin.vercel.app

# CORS
server.servlet.session.cookie.secure=true
server.servlet.session.cookie.http-only=true
```

---

✨ **Status**: Ready for Frontend Integration  
🔗 **Frontend**: vite-react app (http://localhost:5173)  
⚡ **Performance**: Optimized with conversation history management
