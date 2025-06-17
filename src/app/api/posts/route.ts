import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET /api/posts → ambil semua post
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/posts → tambah post baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, content, category } = body;

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        category,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
