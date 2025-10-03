// netlify/functions/get-gemini-data.js

export const handler = async (event) => {
  // 从环境变量中安全地获取 API 密钥
  const apiKey = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  try {
    // 从前端请求中获取查询内容
    const { prompt } = JSON.parse(event.body);

    // 构造发送给 Gemini API 的请求体
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt,
        }],
      }],
    };

    // 使用 fetch 向 Gemini API 发送请求
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      // 如果 API 返回错误，则抛出异常
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error.message}`);
    }

    const data = await response.json();

    // 将从 Gemini API 获取的数据返回给前端
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    // 捕获并返回任何发生的错误
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
