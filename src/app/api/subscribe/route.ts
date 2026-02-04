import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateEmail, validateLength, escapeHtml } from '@/utils/security';

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

function corsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const headers = corsHeaders(origin);

  try {
    const body = await request.json();
    const { email, firstName } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers }
      );
    }

    const name = firstName && validateLength(firstName, 100) ? escapeHtml(firstName.trim()) : 'Subscriber';

    await prisma.subscriber.create({
      data: {
        email: email.toLowerCase().trim(),
        firstName: name,
      },
    });

    return NextResponse.json(
      { success: true },
      { status: 201, headers }
    );
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'You are already subscribed!' },
        { status: 409, headers }
      );
    }
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500, headers }
    );
  }
}
