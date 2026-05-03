const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// GET all past games
router.get('/', async (req, res) => {
  const snapshot = await db.collection('games').orderBy('date', 'desc').get();
  const games = snapshot.docs.map(doc => ({ gameId: doc.id, ...doc.data() }));
  res.json(games);
});

// POST save a new game when End Game is pressed
router.post('/', async (req, res) => {
  const { players } = req.body;
  const winner = [...players].sort((a, b) => b.points - a.points)[0].name;
  await db.collection('games').add({
    players,
    winner,
    date: new Date().toISOString(),
  });
  res.json({ success: true });
});

module.exports = router;