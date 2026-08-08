import { NextRequest } from 'next/server';
import { geminiFlash } from '@/lib/ai/gemini-client';

const SYSTEM_PROMPT = `You are EstateHub's friendly AI assistant helping users find their perfect property in India. You help with:
- Property search guidance
- Answering questions about listings, prices, localities
- Explaining real estate terms
- EMI calculations
- Comparing property types
- Neighborhood information

Keep responses concise (under 100 words).
For property searches, ask about: budget, location, BHK preference.
Always be helpful, accurate, and professional.
If asked about specific listings, note you can search available properties on EstateHub.
Do not make up specific property listings or prices.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], context } = body || {};

    let fullPrompt = `${SYSTEM_PROMPT}\n\n`;

    if (context?.currentPage) {
      fullPrompt += `Current page context: ${context.currentPage}\n`;
    }
    if (context?.currentPropertyId) {
      fullPrompt += `Current property ID context: ${context.currentPropertyId}\n`;
    }

    fullPrompt += `\nConversation History:\n`;

    messages.forEach((msg: { role: string; content: string }) => {
      const roleLabel = msg.role === 'user' ? 'User' : 'Assistant';
      fullPrompt += `${roleLabel}: ${msg.content}\n`;
    });

    fullPrompt += `Assistant:`;

    const streamResult = await geminiFlash.generateContentStream(fullPrompt);

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
          controller.close();
        } catch (err) {
          console.error('Error streaming Gemini response:', err);
          controller.error(err);
        }
      },
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('Error in chat API route:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
