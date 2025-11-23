import Groq from "groq-sdk";

const apiKey = import.meta.env.VITE_API_KEY;

// Debug: Check if API key is loaded
console.log("API Key loaded:", apiKey ? "Yes (length: " + apiKey.length + ")" : "No");

// Initialize Groq client
const groq = apiKey ? new Groq({ apiKey, dangerouslyAllowBrowser: true }) : null;

export const generateResponse = async (
  prompt: string, 
  history: string[]
): Promise<string> => {
  if (!groq) {
    return "System Error: API Key missing. Please configure the environment.";
  }

  try {
    const systemInstruction = `You are "YuzuBot", a helpful AI assistant living inside the portfolio operating system of Masuo Yuzuki (増尾 柚希).

About Yuzuki:
- 4th Year Student at Ritsumeikan University, Faculty of Information Science and Engineering (立命館大学 情報理工学部 4年生)
- Research: Multi-Agent Dialogue Protocol using Large Language Models at Social Intelligence Lab (SI Lab)
- Research Focus: Cross-cultural collaboration and solving social issues using LLM multi-agents
- Tech Stack: React, Next.js, TypeScript, Python, Node.js, NestJS, MySQL, Prisma, Docker, GitHub, FastAPI
- Skills: Full-stack development with REST API and gRPC
- Certifications: Fundamental Information Technology Engineer (基本情報技術者), TOEIC IP: 895
- Email: is0690ke@ed.ritsumei.ac.jp
- GitHub: https://github.com/Yuuzuukii

Featured Projects:
1. ShigaChat - Multi-language Q&A service for foreigners in Shiga using ChatGPT and RAG (React, Python, FastAPI, MySQL)
2. YuzukiOS Portfolio - This Windows-like OS running in browser (React, TypeScript, Tailwind, Vite)
3. Multi-Agent Dialogue Protocol Research - Academic research on LLM agents

Your Goal:
- Answer questions about Yuzuki's skills, education, research, and projects accurately
- Maintain a friendly, professional, and slightly tech-savvy persona
- Keep responses concise (under 100 words) as you are in a chat window
- If asked to open apps, guide them to click the desktop icons or taskbar
- Provide information in Japanese or English based on the user's language`;

    // Construct messages array with history
    const messages: any[] = [
      { role: "system", content: systemInstruction }
    ];

    // Add history (alternating user/assistant)
    for (let i = 0; i < history.length; i++) {
      const role = i % 2 === 0 ? "user" : "assistant";
      messages.push({ role, content: history[i] });
    }

    // Add current prompt
    messages.push({ role: "user", content: prompt });

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // 最新の高速で高品質なモデル
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || "I couldn't process that request.";
  } catch (error: any) {
    console.error("Groq Error Details:", error);
    console.error("Error message:", error?.message);
    console.error("Error response:", error?.response?.data);
    
    if (error?.status === 401) {
      return "API Key is invalid. Please check your Groq API key.";
    }
    if (error?.status === 429) {
      return "Rate limit exceeded. Please try again in a moment.";
    }
    
    return `Connection error: ${error?.message || 'Please try again later.'}`;
  }
};
