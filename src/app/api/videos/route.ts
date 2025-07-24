import { NextResponse } from 'next/server';

// Demo video URLs for CCTV simulation
const demoVideos = {
  1: {
    name: 'Shop Floor A',
    streams: {
      live: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      backup: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    }
  },
  2: {
    name: 'Vault',
    streams: {
      live: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      backup: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    }
  },
  3: {
    name: 'Entrance',
    streams: {
      live: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      backup: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
  }
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cameraId = searchParams.get('cameraId');
    const streamType = searchParams.get('stream') || 'live';
    
    if (cameraId) {
      const camera = demoVideos[parseInt(cameraId) as keyof typeof demoVideos];
      if (!camera) {
        return NextResponse.json({ error: 'Camera not found' }, { status: 404 });
      }
      
      return NextResponse.json({
        cameraId: parseInt(cameraId),
        name: camera.name,
        streamUrl: camera.streams[streamType as keyof typeof camera.streams] || camera.streams.live,
        streamType,
        status: 'online',
        quality: '1080p',
        fps: 30
      });
    }
    
    // Return all cameras with their video streams
    const allCameras = Object.entries(demoVideos).map(([id, camera]) => ({
      cameraId: parseInt(id),
      name: camera.name,
      streamUrl: camera.streams.live,
      streamType: 'live',
      status: 'online',
      quality: '1080p',
      fps: 30
    }));
    
    return NextResponse.json(allCameras);
  } catch (error) {
    console.error('Error fetching video streams:', error);
    return NextResponse.json({ error: 'Failed to fetch video streams' }, { status: 500 });
  }
}

// For future implementation: POST endpoint to add new video sources
export async function POST(request: Request) {
  try {
    const { cameraId, streamUrl, streamType = 'live' } = await request.json();
    
    if (!cameraId || !streamUrl) {
      return NextResponse.json({ 
        error: 'CameraId and streamUrl are required' 
      }, { status: 400 });
    }
    
    // In a real implementation, you would save this to a database
    // For now, just return the submitted data
    return NextResponse.json({
      cameraId: parseInt(cameraId),
      streamUrl,
      streamType,
      status: 'configured',
      message: 'Video stream configured successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error configuring video stream:', error);
    return NextResponse.json({ error: 'Failed to configure video stream' }, { status: 500 });
  }
}