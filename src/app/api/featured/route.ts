import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

function corsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  const headers = corsHeaders(origin);

  try {
    const featured = await prisma.weeklyFeatured.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!featured) {
      return NextResponse.json(
        { burger: null, sandwich: null, weekOf: null },
        { headers }
      );
    }

    return NextResponse.json(
      {
        burger: {
          name: featured.burgerName,
          description: featured.burgerDescription,
          price: parseFloat(featured.burgerPrice.toString()),
          image: featured.burgerImage,
        },
        sandwich: {
          name: featured.sandwichName,
          description: featured.sandwichDescription,
          price: parseFloat(featured.sandwichPrice.toString()),
          image: featured.sandwichImage,
        },
        weekOf: featured.weekOf,
      },
      { headers }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch featured items' },
      { status: 500, headers }
    );
  }
}
