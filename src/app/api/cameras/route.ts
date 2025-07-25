import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '../../lib/auth';

const demoData = [
  {
    id: 1,
    name: 'Main Entrance',
    location: 'Building A, Front',
    status: 'active',
  },
  {
    id: 2,
    name: 'Parking Lot',
    location: 'Area B, Level 1',
    status: 'active',
  },
  {
    id: 3,
    name: 'Loading Bay',
    location: 'Warehouse C',
    status: 'active',
  }
];

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return new NextResponse('Unauthorized', { status: 401 });
  
  try {
    return NextResponse.json(demoData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cameras' },
      { status: 500 }
    );
  }
}
