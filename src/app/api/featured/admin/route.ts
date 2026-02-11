import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const weekOf = body.weekOf?.trim();
    const burgerName = body.burgerName?.trim();
    const sandwichName = body.sandwichName?.trim();
    const burgerPrice = Number(body.burgerPrice);
    const sandwichPrice = Number(body.sandwichPrice);

    if (!weekOf || !burgerName || isNaN(burgerPrice) || !sandwichName || isNaN(sandwichPrice)) {
      return NextResponse.json(
        { error: 'weekOf, burger name/price, and sandwich name/price are required' },
        { status: 400 }
      );
    }

    const data = {
      burgerName,
      burgerDescription: body.burgerDescription?.trim() || null,
      burgerPrice,
      burgerImage: body.burgerImage?.trim() || null,
      sandwichName,
      sandwichDescription: body.sandwichDescription?.trim() || null,
      sandwichPrice,
      sandwichImage: body.sandwichImage?.trim() || null,
    };

    // Upsert: update existing record for this weekOf, or create new
    const existing = await prisma.weeklyFeatured.findFirst({
      where: { weekOf },
    });

    let featured;
    if (existing) {
      featured = await prisma.weeklyFeatured.update({
        where: { id: existing.id },
        data,
      });
    } else {
      featured = await prisma.weeklyFeatured.create({
        data: { weekOf, ...data },
      });
    }

    return NextResponse.json(featured);
  } catch (err) {
    console.error('Failed to update featured items:', err);
    return NextResponse.json(
      { error: 'Failed to update featured items' },
      { status: 500 }
    );
  }
}
