import { baseUrl } from '@src/const/const';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, originalUrl } = await req.json();

    const externalResponse = await fetch(originalUrl || baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ name }),
    });

    if (!externalResponse.ok) {
      throw new Error(`External API error: ${externalResponse.statusText}`);
    }

    const data = await externalResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
