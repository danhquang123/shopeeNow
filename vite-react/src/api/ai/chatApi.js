import axios from 'axios';

/**
 * API service cho AI Chat
 * Sử dụng axios instance riêng vì endpoint OpenAI không có /api prefix
 * URL động từ environment variable VITE_OPENAI_URL
 */
const aiAxios = axios.create({
    baseURL: import.meta.env.VITE_OPENAI_URL || 'http://localhost:8080',
    timeout: 30000
});

console.log('🤖 AI API URL:', import.meta.env.VITE_OPENAI_URL || 'http://localhost:8080');

// Chat endpoint - lưu trữ conversation history
export const chatWithAI = async (prompt) => {
    try {
        const response = await aiAxios.get('/openai/chat', {
            params: { prompt }
        });
        console.log('✅ Chat response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi chat với AI:', error.message);
        throw error;
    }
};

// Generate image endpoint
export const generateImage = async (prompt, n = 1, width = 1024, height = 1024) => {
    try {
        const response = await aiAxios.get('/openai/generate-image', {
            params: { prompt, n, width, height }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi generate image:', error.message);
        throw error;
    }
};

// Fashion advice endpoint
export const getFashionAdvice = async (style, gender = 'unisex', occasion = 'casual', season = 'summer') => {
    try {
        const response = await aiAxios.get('/openai/fashion-advice', {
            params: { style, gender, occasion, season }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Lỗi khi lấy tư vấn thời trang:', error.message);
        throw error;
    }
};
