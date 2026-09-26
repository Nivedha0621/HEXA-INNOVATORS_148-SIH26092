const API_BASE = '/api';

export async function fetchSchemes() {
  const res = await fetch(`${API_BASE}/schemes`);
  if (!res.ok) throw new Error('Failed to fetch schemes');
  return res.json();
}

export async function fetchScheme(id) {
  const res = await fetch(`${API_BASE}/schemes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch scheme');
  return res.json();
}

export async function addScheme(scheme) {
  const res = await fetch(`${API_BASE}/schemes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scheme),
  });
  if (!res.ok) throw new Error('Failed to add scheme');
  return res.json();
}

export async function updateScheme(id, scheme) {
  const res = await fetch(`${API_BASE}/schemes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scheme),
  });
  if (!res.ok) throw new Error('Failed to update scheme');
  return res.json();
}

export async function deleteScheme(id) {
  const res = await fetch(`${API_BASE}/schemes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete scheme');
  return res.json();
}

export async function matchSchemes(profile) {
  const res = await fetch(`${API_BASE}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to match schemes');
  return res.json();
}

export async function fetchPartners({ state, district, scheme, lat, lng } = {}) {
  const params = new URLSearchParams();
  if (state) params.set('state', state);
  if (district) params.set('district', district);
  if (scheme) params.set('scheme', scheme);
  if (lat) params.set('lat', lat);
  if (lng) params.set('lng', lng);

  const res = await fetch(`${API_BASE}/partners?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch partners');
  return res.json();
}
