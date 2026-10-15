import Groq from "groq-sdk";

const getApiKey = () => {
  return (
    import.meta.env.VITE_API_KEY ||
    import.meta.env.VITE_GROQ_API_KEY ||
    (typeof process !== 'undefined' ? (process.env?.API_KEY || process.env?.GEMINI_API_KEY) : '') ||
    ''
  );
};

const apiKey = getApiKey();

// Initialize Groq client
const groq = apiKey ? new Groq({ apiKey, dangerouslyAllowBrowser: true }) : null;

const getOfflineResponse = (prompt: string): string => {
  const p = prompt.toLowerCase();
  if (p.includes('project') || p.includes('プロジェクト') || p.includes('作') || p.includes('shigachat')) {
    return "Yuzuki has worked on several featured projects:\n1. ShigaChat: Multi-language Q&A service for foreign residents in Shiga using ChatGPT and RAG (FastAPI, React, MySQL).\n2. YuzukiOS Portfolio: This web-based interactive OS.\n3. Multi-Agent Dialogue Protocol: Research on collaborative LLM agents at SI Lab.\nCheck out the 'Projects' icon on the desktop!";
  }
  if (p.includes('skill') || p.includes('スキル') || p.includes('tech') || p.includes('stack') || p.includes('言語')) {
    return "Yuzuki's primary tech stack includes TypeScript, React, Next.js, Python, Node.js, NestJS, FastAPI, MySQL, Prisma, and Docker. He has practical experience building full-stack services with REST and gRPC. Open the 'Skills' app to see a radar chart!";
  }
  if (p.includes('research') || p.includes('研究') || p.includes('lab') || p.includes('大学') || p.includes('ritsumeikan') || p.includes('立命館')) {
    return "Yuzuki is a 1st-year Master's student at Ritsumeikan University, Graduate School of Information Science and Engineering, Social Intelligence Lab (SI Lab). His research explores Multi-Agent Dialogue Protocols with LLMs for cross-cultural collaboration and social problem-solving.";
  }
  if (p.includes('contact') || p.includes('連絡') || p.includes('email') || p.includes('github') || p.includes('mail')) {
    return "You can reach Yuzuki via email at is0690ke@ed.ritsumei.ac.jp or find his code on GitHub at https://github.com/Yuuzuukii.";
  }
  return "I'm YuzuBot! Masuo Yuzuki is a graduate student and software engineer studying LLM multi-agent dialogue protocols at Ritsumeikan University (SI Lab). Feel free to ask about his projects (like ShigaChat), skills, research, or background! (Tip: Set VITE_API_KEY to unlock full live Groq LLM generations).";
};

export const generateResponse = async (
  prompt: string, 
  history: string[]
): Promise<string> => {
  if (!groq) {
    return getOfflineResponse(prompt);
  }

  try {
    const systemInstruction = `You are "YuzuBot", a helpful AI assistant living inside the portfolio operating system of Masuo Yuzuki (増尾 柚希).

About Yuzuki:
- 1st Year Graduate Student at Ritsumeikan University, Graduate School of Information Science and Engineering (立命館大学 情報理工学研究科 1年生)
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
