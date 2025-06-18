import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Util untuk ambil ID dari URL
function getIdFromUrl(url: string): string | null {
  const match = url.match(/\/posts\/([^\/\?]+)/);
  return match?.[1] ?? null;
}

export async function GET(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  if (!id) return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  if (!id) return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });

  try {
    const body = await req.json();
    const { title, slug, content, category } = body;

    const updated = await prisma.post.update({
      where: { id },
      data: { title, slug, content, category },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = getIdFromUrl(req.url);
  if (!id) return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });

  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: 'Post deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
