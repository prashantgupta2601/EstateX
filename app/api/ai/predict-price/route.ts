import { NextRequest, NextResponse } from 'next/server';
import { geminiFlash, generateText } from '@/lib/ai/gemini-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      propertyType,
      bhk,
      area,
      city,
      locality,
      floor,
      furnishing,
      amenities,
      propertyAge,
      facing,
    } = body || {};

    const formattedAmenities = Array.isArray(amenities) && amenities.length > 0
      ? amenities.join(', ')
      : (typeof amenities === 'string' && amenities ? amenities : 'Standard amenities');

    const prompt = `You are a real estate pricing expert for Indian property markets. Based on the following property details, provide a realistic price estimate for ${city || 'Indian'} market in 2024-2025.

Property: ${bhk ? `${bhk} BHK ` : ''}${propertyType || 'Property'}
Area: ${area || 'N/A'} sqft
Location: ${locality || 'N/A'}, ${city || 'N/A'}
Floor: ${floor || 'N/A'}
Furnishing: ${furnishing || 'N/A'}
Age: ${propertyAge || 'N/A'}
Amenities: ${formattedAmenities}
Facing: ${facing || 'N/A'}

Respond ONLY in this exact JSON format:
{
  "estimatedPrice": number in INR,
  "priceRange": { 
    "min": number, 
    "max": number 
  },
  "pricePerSqft": number,
  "confidence": "high"|"medium"|"low",
  "reasoning": "brief 2-3 line explanation",
  "marketTrend": "rising"|"stable"|"falling"
}`;

    let responseText = '';
    try {
      responseText = await generateText(prompt, 20000);
    } catch (err) {
      const result = await geminiFlash.generateContent(prompt);
      const res = await result.response;
      responseText = res.text();
    }

    // Clean JSON response from potential Markdown code fences
    let cleanJsonStr = responseText.trim();
    if (cleanJsonStr.startsWith('```')) {
      cleanJsonStr = cleanJsonStr.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    const firstBrace = cleanJsonStr.indexOf('{');
    const lastBrace = cleanJsonStr.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanJsonStr = cleanJsonStr.substring(firstBrace, lastBrace + 1);
    }

    const parsedData = JSON.parse(cleanJsonStr);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error in predict-price API:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate property price prediction' },
      { status: 500 }
    );
  }
}
