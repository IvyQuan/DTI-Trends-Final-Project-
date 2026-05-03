const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/leaderboard.json');

function readLeaderboard() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLeaderboard(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  const entries = readLeaderboard();
  entries.sort((a, b) => b.points - a.points);
  res.json(entries);
});

router.post('/update', (req, res) => {
  const { players } = req.body;
  if (!Array.isArray(players)) {
    return res.status(400).json({ error: 'players must be an array' });
  }
  const entries = readLeaderboard();
  for (const player of players) {
    const existing = entries.find(
      (e) => e.name.toLowerCase() === player.name.toLowerCase()
    );
    if (existing) {
      existing.points += player.points;
    } else {
      entries.push({ name: player.name, points: player.points });
    }
  }
  writeLeaderboard(entries);
  res.json({ success: true });
});

module.exports = router;
