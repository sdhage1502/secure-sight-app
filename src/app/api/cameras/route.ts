import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cameras = await prisma.camera.findMany();
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return NextResponse.json({ error: 'Failed to fetch cameras' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const camera = await prisma.camera.create({
      data: body,
    });
    return NextResponse.json(camera, { status: 201 });
  } catch (error) {
    console.error('Error creating camera:', error);
    return NextResponse.json({ error: 'Failed to create camera' }, { status: 500 });
  }
}
