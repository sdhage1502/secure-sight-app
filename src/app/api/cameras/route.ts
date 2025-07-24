import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cameras = await prisma.camera.findMany({
      include: { 
        incidents: {
          where: { resolved: false },
          orderBy: { tsStart: 'desc' }
        }
      },
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(cameras);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return NextResponse.json({ error: 'Failed to fetch cameras' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, location } = await request.json();
    
    if (!name || !location) {
      return NextResponse.json({ error: 'Name and location are required' }, { status: 400 });
    }

    const camera = await prisma.camera.create({
      data: { name, location },
    });
    
    return NextResponse.json(camera, { status: 201 });
  } catch (error) {
    console.error('Error creating camera:', error);
    return NextResponse.json({ error: 'Failed to create camera' }, { status: 500 });
  }
}