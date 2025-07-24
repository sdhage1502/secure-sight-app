import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved');
    const cameraId = searchParams.get('cameraId');
    
    const whereClause: any = {};
    
    if (resolved !== null) {
      whereClause.resolved = resolved === 'true';
    }
    
    if (cameraId) {
      whereClause.cameraId = parseInt(cameraId);
    }

    const incidents = await prisma.incident.findMany({
      where: whereClause,
      include: { camera: true },
      orderBy: { tsStart: 'desc' },
    });
    
    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { cameraId, type, tsStart, tsEnd, thumbnailUrl } = await request.json();
    
    if (!cameraId || !type || !tsStart || !tsEnd) {
      return NextResponse.json({ 
        error: 'CameraId, type, tsStart, and tsEnd are required' 
      }, { status: 400 });
    }

    const incident = await prisma.incident.create({
      data: {
        cameraId: parseInt(cameraId),
        type,
        tsStart: new Date(tsStart),
        tsEnd: new Date(tsEnd),
        thumbnailUrl: thumbnailUrl || '/api/placeholder/200/120',
        resolved: false
      },
      include: { camera: true }
    });
    
    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    console.error('Error creating incident:', error);
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
  }
}