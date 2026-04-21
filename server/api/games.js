const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/games.json');

function readGames() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeGames(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/games — all past sessions, newest first
router.get('/', (req, res) => {
  const games = readGames();
  res.json([...games].reverse());
});

// POST /api/games — save a completed session
// Body: { players: [{ name, points }] }
router.post('/', (req, res) => {
  const { players } = req.body;
  if (!Array.isArray(players) || players.length === 0) {
    return res.status(400).json({ error: 'players must be a non-empty array' });
  }

  const games = readGames();
  const nextId = games.length > 0 ? Math.max(...games.map((g) => g.gameId)) + 1 : 1;

  const topScore = Math.max(...players.map((p) => p.points));
  const winners = players.filter((p) => p.points === topScore).map((p) => p.name);
  const winner = winners.join(' & ');

  const today = new Date();
  const date = today.toISOString().split('T')[0];
  const name = `Game Night – ${today.getMonth() + 1}/${today.getDate()}/${String(today.getFullYear()).slice(2)}`;

  const entry = {
    gameId: nextId,
    name,
    players: players.map((p) => p.name),
    scores: players.map((p) => ({ name: p.name, points: p.points })),
    winner,
    date,
  };

  games.push(entry);
  writeGames(games);
  res.json(entry);
});

module.exports = router;
