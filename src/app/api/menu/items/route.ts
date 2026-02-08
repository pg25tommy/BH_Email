import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateLength } from '@/utils/security';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const featured = searchParams.get('featured');
    const bestSeller = searchParams.get('bestSeller');
    const soldOut = searchParams.get('soldOut');
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50')));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (!includeInactive) {
      where.active = true;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured === 'true') {
      where.featured = true;
    } else if (featured === 'false') {
      where.featured = false;
    }

    if (bestSeller === 'true') {
      where.bestSeller = true;
    } else if (bestSeller === 'false') {
      where.bestSeller = false;
    }

    if (soldOut === 'true') {
      where.soldOut = true;
    } else if (soldOut === 'false') {
      where.soldOut = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.menuItem.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.menuItem.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      image,
      categoryId,
      featured,
      bestSeller,
      soldOut,
      sortOrder,
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }

    if (price === undefined || price === null || isNaN(parseFloat(price))) {
      return NextResponse.json(
        { error: 'Valid price is required' },
        { status: 400 }
      );
    }

    const parsedPrice = parseFloat(price);
    if (parsedPrice < 0 || parsedPrice > 999999.99) {
      return NextResponse.json(
        { error: 'Price must be between 0 and 999999.99' },
        { status: 400 }
      );
    }

    if (!validateLength(name, 200)) {
      return NextResponse.json(
        { error: 'Name must be between 1 and 200 characters' },
        { status: 400 }
      );
    }

    if (description && !validateLength(description, 1000)) {
      return NextResponse.json(
        { error: 'Description must be under 1000 characters' },
        { status: 400 }
      );
    }

    if (image && !validateLength(image, 500)) {
      return NextResponse.json(
        { error: 'Image URL must be under 500 characters' },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        price: parsedPrice,
        image: image ? image.trim() : null,
        categoryId,
        featured: featured === true,
        bestSeller: bestSeller === true,
        soldOut: soldOut === true,
        sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
