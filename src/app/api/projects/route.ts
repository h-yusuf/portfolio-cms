import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const projects = await prisma.project.findMany();
    return NextResponse.json(projects);
  }
  
  export async function POST(req: Request) {
    const data = await req.json();
    const created = await prisma.project.create({
      data,
    });
    return NextResponse.json(created, { status: 201 });
  }