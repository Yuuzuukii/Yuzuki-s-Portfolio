import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

// Initialize safe instance
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateResponse = async (
  prompt: string, 
  history: string[]
): Promise<string> => {
  if (!ai) {
    return "System Error: API Key missing. Please configure the environment.";
  }

  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      You are "YuzuBot", a helpful AI assistant living inside the portfolio operating system of Masuo Yuzuki (Information Systems, 4th Year).
      
      About Yuzuki:
      - 4th Year University Student (Information Systems).
      - Passionate about Frontend Engineering, UI/UX, and Creative Coding.
      - Tech Stack: React, TypeScript, Tailwind, Python, Docker, AWS.
      - Personality: Cheerful, detail-oriented, loves sleek designs.
      
      Your Goal:
      - Answer questions about Yuzuki's skills and projects.
      - Maintain a slightly tech-savvy, helpful, and witty persona.
      - Keep responses concise (under 100 words) as you are in a chat window.
      - If asked to open apps, explain that you can't control the OS yet, but guide them to click the icons.
    `;

    // Construct a simple chat history context
    const context = history.join("\n");
    const fullPrompt = `${context}\nUser: ${prompt}`;

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Connection error. Please try again later.";
  }
};
