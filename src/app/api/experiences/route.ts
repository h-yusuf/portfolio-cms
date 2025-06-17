import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const exp = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
    });
    return NextResponse.json(exp);
  }
  
  export async function POST(req: Request) {
    const data = await req.json();
    const created = await prisma.experience.create({
      data,
    });
    return NextResponse.json(created, { status: 201 });
  }
  