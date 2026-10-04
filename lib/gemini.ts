import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

/**
 * The active Gemini model name.
 * Override at runtime via the optional GEMINI_MODEL environment variable.
 * Default: "gemini-flash-latest" (confirmed available 2026-10-04 via ListModels).
 */
export const GEMINI_MODEL: string =
  process.env.GEMINI_MODEL || "gemini-flash-latest";

let _genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured in environment variables."
    );
  }
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

/**
 * Returns a shared GenerativeModel instance using the resolved GEMINI_MODEL.
 * This is the single source of truth for all AI routes.
 */
export function getGeminiModel(): GenerativeModel {
  return getGenAI().getGenerativeModel({ model: GEMINI_MODEL });
}
