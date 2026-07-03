import { NextResponse } from 'next/server';
import { mockProperties } from '@/lib/mock-data/properties';
import PropertyBrochure from '@/lib/pdf/property-brochure';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  try {
    // Generate React-PDF document to binary buffer
    const buffer = await renderToBuffer(
      React.createElement(PropertyBrochure, { property }) as unknown as React.ReactElement<{ title?: string }>
    );

    // Respond with PDF content headers for direct download
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="brochure-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate brochure PDF' },
      { status: 500 }
    );
  }
}
