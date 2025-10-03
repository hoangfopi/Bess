// netlify/functions/get-gemini-data.js
export const handler = async (event) => {
    const apiKey = process.env.GEMINI_API_KEY; // 从环境变量安全地获取密钥
    // 注意：这里的模型和你的前端需要一致
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent';

    try {
        const { prompt } = JSON.parse(event.body); // 获取前端发来的复杂 prompt

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            tools: [{"google_search": {}}] // 确保在后端函数里添加 tools 参数
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Gemini API error: ${errorData.error.message}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
