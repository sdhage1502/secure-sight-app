import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.incident.deleteMany({});
  await prisma.camera.deleteMany({});

  // Create cameras
  const cameras = await prisma.camera.createMany({
    data: [
      { name: 'Shop Floor A', location: 'Shop' },
      { name: 'Vault', location: 'Backroom' },
      { name: 'Entrance', location: 'Front' },
    ],
  });

  console.log(`✅ Created ${cameras.count} cameras`);

  // Generate incidents for the last 24 hours with more realistic timing
  const now = new Date();
  const incidents = [];

  // Helper function to create random incidents
  const createIncident = (cameraId: number, type: string, hoursAgo: number, durationMinutes: number) => {
    const startTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
    const endTime = new Date(startTime.getTime() + (durationMinutes * 60 * 1000));
    
    return {
      cameraId,
      type,
      tsStart: startTime,
      tsEnd: endTime,
      thumbnailUrl: `/api/placeholder/200/120`,
      resolved: Math.random() > 0.7 // 30% chance of being resolved
    };
  };

  // Shop Floor A incidents (Camera 1)
  incidents.push(
    createIncident(1, 'Unauthorised Access', 2.5, 2),
    createIncident(1, 'Gun Threat', 6, 5),
    createIncident(1, 'Face Recognised', 8.5, 1),
    createIncident(1, 'Unauthorised Access', 12, 3),
    createIncident(1, 'Face Recognised', 15.5, 2),
  );

  // Vault incidents (Camera 2)
  incidents.push(
    createIncident(2, 'Unauthorised Access', 1, 4),
    createIncident(2, 'Gun Threat', 4.5, 3),
    createIncident(2, 'Face Recognised', 9, 1),
    createIncident(2, 'Unauthorised Access', 14, 2),
    createIncident(2, 'Gun Threat', 18.5, 6),
  );

  // Entrance incidents (Camera 3)
  incidents.push(
    createIncident(3, 'Face Recognised', 0.5, 1),
    createIncident(3, 'Unauthorised Access', 3, 2),
    createIncident(3, 'Gun Threat', 7.5, 4),
    createIncident(3, 'Face Recognised', 11, 1),
    createIncident(3, 'Unauthorised Access', 16.5, 3),
    createIncident(3, 'Gun Threat', 20, 5),
  );

  // Add some older incidents for testing
  for (let i = 0; i < 10; i++) {
    const randomCamera = Math.floor(Math.random() * 3) + 1;
    const types = ['Unauthorised Access', 'Gun Threat', 'Face Recognised'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const hoursAgo = Math.random() * 48 + 24; // Random time between 24-72 hours ago
    
    incidents.push(createIncident(randomCamera, randomType, hoursAgo, Math.floor(Math.random() * 5) + 1));
  }

  // Insert all incidents
  const createdIncidents = await prisma.incident.createMany({
    data: incidents,
  });

  console.log(`✅ Created ${createdIncidents.count} incidents`);

  // Show summary
  const totalCameras = await prisma.camera.count();
  const totalIncidents = await prisma.incident.count();
  const unresolvedIncidents = await prisma.incident.count({ where: { resolved: false } });

  console.log('📊 Database Summary:');
  console.log(`   Cameras: ${totalCameras}`);
  console.log(`   Total Incidents: ${totalIncidents}`);
  console.log(`   Unresolved Incidents: ${unresolvedIncidents}`);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });