const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { matchSchemes } = require('./services/matchingEngine');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Data helpers ---
const DATA_DIR = path.join(__dirname, 'data');

function readJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8'));
}

function writeJSON(filename, data) {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
}

// --- Scheme endpoints ---
app.get('/api/schemes', (req, res) => {
  try {
    const schemes = readJSON('schemes.json');
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load schemes' });
  }
});

app.get('/api/schemes/:id', (req, res) => {
  try {
    const schemes = readJSON('schemes.json');
    const scheme = schemes.find(s => s.id === req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load scheme' });
  }
});

app.post('/api/schemes', (req, res) => {
  try {
    const schemes = readJSON('schemes.json');
    const newScheme = {
      ...req.body,
      id: req.body.id || `scheme-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    schemes.push(newScheme);
    writeJSON('schemes.json', schemes);
    res.status(201).json(newScheme);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add scheme' });
  }
});

app.put('/api/schemes/:id', (req, res) => {
  try {
    const schemes = readJSON('schemes.json');
    const index = schemes.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Scheme not found' });
    schemes[index] = {
      ...schemes[index],
      ...req.body,
      id: req.params.id,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    writeJSON('schemes.json', schemes);
    res.json(schemes[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update scheme' });
  }
});

app.delete('/api/schemes/:id', (req, res) => {
  try {
    let schemes = readJSON('schemes.json');
    const index = schemes.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Scheme not found' });
    schemes.splice(index, 1);
    writeJSON('schemes.json', schemes);
    res.json({ message: 'Scheme deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete scheme' });
  }
});

// --- Matching endpoint ---
app.post('/api/match', (req, res) => {
  try {
    const schemes = readJSON('schemes.json');
    const profile = req.body;
    const results = matchSchemes(schemes, profile);
    res.json(results);
  } catch (err) {
    console.error('Match error:', err);
    res.status(500).json({ error: 'Matching engine failed' });
  }
});

// --- Partners endpoint ---
app.get('/api/partners', (req, res) => {
  try {
    let partners = readJSON('partners.json');
    const { state, district, scheme } = req.query;

    if (state) {
      partners = partners.filter(p => p.state.toLowerCase() === state.toLowerCase());
    }
    if (district) {
      partners = partners.filter(p => p.district.toLowerCase() === district.toLowerCase());
    }
    if (scheme) {
      partners = partners.filter(p => p.supportedSchemes.includes(scheme));
    }

    // If lat/lng provided, calculate distances
    const { lat, lng } = req.query;
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      partners = partners.map(p => ({
        ...p,
        distance: calculateDistance(userLat, userLng, p.lat, p.lng)
      }));
      partners.sort((a, b) => a.distance - b.distance);
    }

    res.json(partners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load partners' });
  }
});

// Haversine distance formula
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(deg) {
  return deg * Math.PI / 180;
}

app.listen(PORT, () => {
  console.log(`SchemeSathi API server running on http://localhost:${PORT}`);
});
