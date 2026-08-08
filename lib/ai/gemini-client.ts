import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

/**
 * Reusable function to generate text using Gemini AI model with error handling and timeout.
 * @param prompt Prompt text to send to Gemini
 * @param timeoutMs Timeout limit in milliseconds (default 15000ms)
 */
export async function generateText(prompt: string, timeoutMs: number = 15000): Promise<string> {
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  let timerId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error(`Gemini request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const generatePromise = (async () => {
      const result = await geminiFlash.generateContent(prompt);
      const response = await result.response;
      return response.text();
    })();

    const responseText = await Promise.race([generatePromise, timeoutPromise]);
    return responseText;
  } catch (error: unknown) {
    console.error("Error in Gemini generateText:", error);
    throw error;
  } finally {
    // @ts-ignore
    if (timerId) clearTimeout(timerId);
  }
}
