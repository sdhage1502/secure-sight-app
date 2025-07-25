export async function fetchCameras() {
  const res = await fetch('/api/cameras');
  if (!res.ok) {
    throw new Error('Failed to fetch cameras');
  }
  return res.json();
}

export async function fetchIncidents(resolved = false) {
  const res = await fetch(`/api/incidents?resolved=${resolved}`);
  if (!res.ok) {
    throw new Error('Failed to fetch incidents');
  }
  return res.json();
}

export async function resolveIncident(incidentId: number) {
  const res = await fetch(`/api/incidents/${incidentId}/resolve`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error('Failed to resolve incident');
  }
  return res.json();
}
