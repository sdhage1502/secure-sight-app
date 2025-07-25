// src/app/api/incidents/route.ts or similar API route
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      include: { camera: true },
    });
    return NextResponse.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incident = await prisma.incident.create({
      data: body,
      include: { camera: true },
    });
    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    console.error('Error creating incident:', error);
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
  }
}
