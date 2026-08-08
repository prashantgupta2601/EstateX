import { NextRequest, NextResponse } from 'next/server';
import { geminiFlash, generateText } from '@/lib/ai/gemini-client';

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
      // Use our geminiFlash instance / generateText helper with timeout & error handling
      descriptionText = await generateText(prompt, 15000);
    } catch (genError) {
      // Fallback direct call to geminiFlash.generateContent if generateText fails on env check
      const result = await geminiFlash.generateContent(prompt);
      const response = await result.response;
      descriptionText = response.text();
    }

    return NextResponse.json({ description: descriptionText.trim() });
  } catch (error: any) {
    console.error('Error generating AI description:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate property description' },
      { status: 500 }
    );
  }
}
