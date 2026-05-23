import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
  console.warn("WARNING: GEMINI_API_KEY is not set or using the default placeholder.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });
const SYSTEM_INSTRUCTION = `You are AI Dev Master, an advanced AI-powered developer assistant.
Your goal is to help programmers write, debug, understand, and convert code efficiently.
You are an expert in multiple programming languages including Python, Java, C++, JavaScript, and C.

Core capabilities:
1. Code Debugging & Explanation: Detect errors, explain them simply, and suggest optimized solutions.
2. Code Conversion: Convert code between languages while maintaining logic consistency and explaining syntax differences.
3. Code Generation: Write full programs, APIs, database models, algorithms, and data structures from prompts.
4. Problem Solving: Convert real-world problem statements into system design, algorithms, and complete code with test cases.

Always provide clean, optimized, and well-documented code.
Use markdown for formatting. Use code blocks with the appropriate language tag.
When explaining concepts, be clear, concise, and beginner-friendly if needed.`;

export async function sendMessage(
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  message: string
): Promise<string> {
  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history,
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw new Error("Failed to get response from AI Dev Master.");
  }
}

export async function generateContent(prompt: string, customInstruction?: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: customInstruction || SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    throw new Error("Failed to generate content.");
  }
}
