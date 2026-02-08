import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateLength } from '@/utils/security';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      active,
      sortOrder,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (name !== undefined) {
      if (!validateLength(name, 200)) {
        return NextResponse.json(
          { error: 'Name must be between 1 and 200 characters' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (description !== undefined) {
      if (description && !validateLength(description, 1000)) {
        return NextResponse.json(
          { error: 'Description must be under 1000 characters' },
          { status: 400 }
        );
      }
      updateData.description = description ? description.trim() : null;
    }

    if (price !== undefined) {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0 || parsedPrice > 999999.99) {
        return NextResponse.json(
          { error: 'Price must be between 0 and 999999.99' },
          { status: 400 }
        );
      }
      updateData.price = parsedPrice;
    }

    if (image !== undefined) {
      if (image && !validateLength(image, 500)) {
        return NextResponse.json(
          { error: 'Image URL must be under 500 characters' },
          { status: 400 }
        );
      }
      updateData.image = image ? image.trim() : null;
    }

    if (categoryId !== undefined) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 400 }
        );
      }
      updateData.categoryId = categoryId;
    }

    if (typeof featured === 'boolean') {
      updateData.featured = featured;
    }

    if (typeof bestSeller === 'boolean') {
      updateData.bestSeller = bestSeller;
    }

    if (typeof soldOut === 'boolean') {
      updateData.soldOut = soldOut;
    }

    if (typeof active === 'boolean') {
      updateData.active = active;
    }

    if (typeof sortOrder === 'number') {
      updateData.sortOrder = sortOrder;
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
