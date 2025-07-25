import { NextResponse } from 'next/server';

// Define the params type for the catch-all route [...dimensions]
type Params = {
  params: Promise<{
    dimensions: string[];
  }>;
};

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const resolvedParams = await params;
    const [width = '400', height = '300'] = resolvedParams.dimensions;

    const w = parseInt(width);
    const h = parseInt(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0 || w > 2000 || h > 2000) {
      return NextResponse.json({ error: 'Invalid dimensions' }, { status: 400 });
    }

    // Generate a simple placeholder image using SVG
    const canvas = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#374151"/>
        <rect x="10%" y="10%" width="80%" height="80%" fill="#4B5563" stroke="#6B7280" stroke-width="2"/>
        <circle cx="30%" cy="30%" r="8%" fill="#9CA3AF"/>
        <rect x="20%" y="50%" width="60%" height="5%" fill="#6B7280"/>
        <rect x="20%" y="60%" width="40%" height="5%" fill="#6B7280"/>
        <text x="50%" y="85%" font-family="Arial, sans-serif" font-size="12" fill="#9CA3AF" text-anchor="middle">
          ${w} × ${h}
        </text>
      </svg>
    `;

    return new Response(canvas, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error generating placeholder:', error);
    return NextResponse.json({ error: 'Failed to generate placeholder' }, { status: 500 });
  }
}