import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Utility untuk ambil ID dari path
function getIdFromUrl(url: string): string | null {
  const match = url.match(/\/categories\/([^/]+)/);
  return match?.[1] ?? null;
}

export async function GET(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    const body = await req.json();
    const updated = await prisma.category.update({
      where: { id },
      data: { name: body.name, slug: body.slug },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: 'Category deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
