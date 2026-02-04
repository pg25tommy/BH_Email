import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;

    const [emails, total] = await Promise.all([
      prisma.emailLog.findMany({
        orderBy: { sentAt: 'desc' },
        skip,
        take: limit,
        include: {
          recipients: {
            include: {
              subscriber: {
                select: { email: true, firstName: true, lastName: true },
              },
            },
          },
        },
      }),
      prisma.emailLog.count(),
    ]);

    return NextResponse.json({
      emails,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch email history' },
      { status: 500 }
    );
  }
}
