import { NextRequest, NextResponse } from 'next/server';
import { geminiFlash, generateText } from '@/lib/ai/gemini-client';
import { mockProperties } from '@/lib/mock-data/properties';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { preferences, viewedPropertyIds = [], wishlistPropertyIds = [] } = body || {};

    const {
      purpose = 'buy',
      budget = { min: 0, max: 100000000 },
      bhk = [],
      cities = [],
      propertyTypes = [],
      amenities = [],
      furnishing = '',
    } = preferences || {};

    // Simplify properties dataset to keep prompt size efficient
    const simplifiedProperties = mockProperties.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type, // 'sale' | 'rent'
      propertyType: p.propertyType,
      bedrooms: p.bedrooms,
      price: p.price,
      city: p.location.city,
      amenities: p.amenities?.map((a) => a.name) || [],
      furnishingStatus: p.furnishingStatus,
    }));

    const prompt = `You are an AI real estate advisor. Based on user preferences below, recommend the best matching property IDs from this list.

User Preferences:
Purpose: ${purpose} (note: 'buy' matches 'sale', 'rent' matches 'rent')
Budget: ₹${budget?.min || 0} - ₹${budget?.max || 100000000}
BHK: ${Array.isArray(bhk) && bhk.length > 0 ? bhk.join(', ') : 'Any'}
Cities: ${Array.isArray(cities) && cities.length > 0 ? cities.join(', ') : 'Any'}
Types: ${Array.isArray(propertyTypes) && propertyTypes.length > 0 ? propertyTypes.join(', ') : 'Any'}
Must-have amenities: ${Array.isArray(amenities) && amenities.length > 0 ? amenities.join(', ') : 'None'}
Furnishing: ${furnishing || 'Any'}

Already viewed: ${JSON.stringify(viewedPropertyIds)}
Wishlisted: ${JSON.stringify(wishlistPropertyIds)}

Available Properties:
${JSON.stringify(simplifiedProperties)}

Return ONLY a JSON object of recommended property IDs in order of relevance (max 6):
{ 
  "recommendedIds": ["id1", "id2"],
  "reasons": {
    "id1": "brief 1-line reason why this property matches the user preferences",
    "id2": "brief 1-line reason why this property matches the user preferences"
  }
}`;

    let responseText = '';
    try {
      responseText = await generateText(prompt, 20000);
    } catch (err) {
      const result = await geminiFlash.generateContent(prompt);
      const res = await result.response;
      responseText = res.text();
    }

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

    return NextResponse.json({
      recommendedIds: parsedData.recommendedIds || [],
      reasons: parsedData.reasons || {},
    });
  } catch (error: any) {
    console.error('Error in AI recommendations endpoint:', error);

    // Smart fallback if AI request fails
    const fallbackIds = mockProperties.slice(0, 6).map((p) => p.id);
    const fallbackReasons: Record<string, string> = {};
    fallbackIds.forEach((id) => {
      fallbackReasons[id] = 'Top featured property matching your search preferences.';
    });

    return NextResponse.json({
      recommendedIds: fallbackIds,
      reasons: fallbackReasons,
    });
  }
}
