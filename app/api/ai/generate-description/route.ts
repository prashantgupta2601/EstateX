import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/ai/gemini-client';
import { getGeminiModel, GEMINI_MODEL } from '@/lib/gemini';

// Simple in-memory rate limiter: max 10 requests / minute
const requestTimestamps: number[] = [];
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_MINUTE = 10;

function isRateLimited(): boolean {
  const now = Date.now();
  // Remove timestamps outside the 1-minute window
  while (requestTimestamps.length > 0 && requestTimestamps[0] <= now - RATE_LIMIT_WINDOW_MS) {
    requestTimestamps.shift();
  }

  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    return true;
  }

  requestTimestamps.push(now);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Check rate limit
    if (isRateLimited()) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 10 AI generations per minute allowed.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      propertyType,
      bhk,
      area,
      city,
      locality,
      amenities,
      furnishing,
      price,
      facing,
    } = body || {};

    const formattedAmenities = Array.isArray(amenities) && amenities.length > 0
      ? amenities.join(', ')
      : 'None specified';

    const prompt = `You are a professional real estate copywriter. Write a compelling, accurate property listing description for the following property. Make it engaging, highlight key features, and keep it under 150 words. Do not make up features not listed.

Property Details:
Type: ${propertyType || 'N/A'}
BHK: ${bhk || 'N/A'}
Area: ${area || 'N/A'} sqft
Location: ${locality || 'N/A'}, ${city || 'N/A'}
Amenities: ${formattedAmenities}
Furnishing: ${furnishing || 'N/A'}
Price: ₹${price || 'N/A'}
Facing: ${facing || 'N/A'}

Write the description in English, professional tone:`;

    let descriptionText = '';

    try {
      descriptionText = await generateText(prompt, 15000);
    } catch (genError: unknown) {
      // Fallback direct call if generateText fails
      const model = getGeminiModel();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      descriptionText = response.text();
    }

    return NextResponse.json({ description: descriptionText.trim() });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    const status = (error as any)?.status ?? (error as any)?.statusCode ?? 500;
    // Log REAL error details — never the API key
    console.error(`[generate-description] Error | model="${GEMINI_MODEL}" | status=${status} | message=${errMsg}`);
    return NextResponse.json(
      { error: 'AI temporarily unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
