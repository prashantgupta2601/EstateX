import { getGeminiModel, GEMINI_MODEL } from "@/lib/gemini";

/**
 * Returns a GenerativeModel instance using the centrally configured model.
 * All AI routes should use this instead of a hardcoded model string.
 */
export const geminiFlash = getGeminiModel();

/**
 * Reusable function to generate text using Gemini AI model with error handling and timeout.
 * @param prompt Prompt text to send to Gemini
 * @param timeoutMs Timeout limit in milliseconds (default 15000ms)
 */
export async function generateText(prompt: string, timeoutMs: number = 15000): Promise<string> {
  // Validate API key (getGeminiModel already checks, but generateText is also called directly)
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }

  let timerId: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error(`Gemini request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const model = getGeminiModel();
    const generatePromise = (async () => {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    })();

    const responseText = await Promise.race([generatePromise, timeoutPromise]);
    return responseText;
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error ? error.message : String(error);
    // Log the real error (status + message). Never log the API key.
    console.error(`[gemini-client] generateText error using model "${GEMINI_MODEL}":`, errMsg);
    throw error;
  } finally {
    if (timerId) clearTimeout(timerId);
  }
}
