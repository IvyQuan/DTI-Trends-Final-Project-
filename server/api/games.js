const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.json([
    { gameId: 1, name: 'Session 22', players: ['Player 1', 'Player 2'], winner: 'Player 1', date: '2026-04-01' },
    { gameId: 2, name: '3/12/26', players: ['Player 5', 'Player e', 'Janice'], winner: 'Janice', date: '2026-03-12' },
    { gameId: 3, name: 'Fun Game', players: ['Esha', 'Ivy', 'Matias', 'Amanda', 'Brooke'], winner: 'Amanda', date: '2026-04-12' }
  ]);
});

module.exports = router;
