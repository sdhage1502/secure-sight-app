// src/app/api/incidents/route.ts or similar API route
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromRequest } from '../../lib/auth';
import { incidentSchema, querySchema, sanitizeObject } from '../../lib/validation';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Lazy initialize Prisma Client
let prisma: PrismaClient | null = null;
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

const demoIncidents = [
  {
    id: 1,
    cameraId: 1,
    type: 'Unauthorised Access',
    tsStart: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    tsEnd: new Date().toISOString(),
    thumbnailUrl: '/image.png',
    resolved: false,
  },
  {
    id: 2,
    cameraId: 2,
    type: 'Face Recognised',
    tsStart: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    tsEnd: new Date().toISOString(),
    thumbnailUrl: '/image.png',
    resolved: false,
  },
  {
    id: 3,
    cameraId: 1,
    type: 'Gun Threat',
    tsStart: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    tsEnd: new Date().toISOString(),
    thumbnailUrl: '/image.png',
    resolved: false,
  }
];

export async function GET(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return new NextResponse('Unauthorized', { status: 401 });
  
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate query parameters
    const queryParams = {
      resolved: searchParams.get('resolved') ? searchParams.get('resolved') === 'true' : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    };
    
    const { error, value } = querySchema.validate(queryParams);
    if (error) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters', 
          details: error.details.map(detail => detail.message)
        },
        { status: 400 }
      );
    }
    
    let incidents = [...demoIncidents];
    
    if (value.resolved !== undefined) {
      incidents = incidents.filter(i => 
        i.resolved === value.resolved
      );
    }

    // Apply pagination
    const startIndex = (value.page - 1) * value.limit;
    const paginatedIncidents = incidents.slice(startIndex, startIndex + value.limit);

    return NextResponse.json({
      incidents: paginatedIncidents,
      pagination: {
        page: value.page,
        limit: value.limit,
        total: incidents.length,
        totalPages: Math.ceil(incidents.length / value.limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user) return new NextResponse('Unauthorized', { status: 401 });
  
  try {
    const body = await request.json();
    
    // Validate request body
    const { error, value } = incidentSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.details.map(detail => detail.message)
        },
        { status: 400 }
      );
    }
    
    // Sanitize the validated data
    const sanitizedData = sanitizeObject(value);

    const incident = await getPrisma().incident.create({
      data: sanitizedData,
      include: { camera: true },
    });
    
    return NextResponse.json(incident, { status: 201 });
  } catch (error) {
    console.error('Error creating incident:', error);
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
  }
}
