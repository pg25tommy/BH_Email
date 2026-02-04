import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { escapeHtml, validateEmail, validateLength } from '@/utils/security';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search } },
            { firstName: { contains: search } },
            { lastName: { contains: search } },
          ],
        }
      : {};

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.subscriber.count({ where }),
    ]);

    return NextResponse.json({
      subscribers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName } = body;

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and first name are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!validateLength(firstName, 100)) {
      return NextResponse.json(
        { error: 'First name must be between 1 and 100 characters' },
        { status: 400 }
      );
    }

    if (lastName && !validateLength(lastName, 100)) {
      return NextResponse.json(
        { error: 'Last name must be under 100 characters' },
        { status: 400 }
      );
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        email: email.toLowerCase().trim(),
        firstName: escapeHtml(firstName.trim()),
        lastName: lastName ? escapeHtml(lastName.trim()) : null,
      },
    });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A subscriber with this email already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to add subscriber' },
      { status: 500 }
    );
  }
}
