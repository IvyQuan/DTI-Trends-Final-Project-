const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

router.post('/update', async (req, res) => {
  const { players } = req.body;
  for (const player of players) {
    const ref = db.collection('leaderboard').doc(player.name);
    const doc = await ref.get();
    if (doc.exists) {
      await ref.update({ totalPoints: doc.data().totalPoints + player.points, gamesPlayed: doc.data().gamesPlayed + 1 });
    } else {
      await ref.set({ name: player.name, totalPoints: player.points, gamesPlayed: 1 });
    }
  }
  res.json({ success: true });
});

router.get('/', async (req, res) => {
  const snapshot = await db.collection('leaderboard').orderBy('totalPoints', 'desc').get();
  res.json(snapshot.docs.map(doc => doc.data()));
});

// DELETE a player
router.delete('/:name', async (req, res) => {
  await db.collection('leaderboard').doc(req.params.name).delete();
  res.json({ success: true });
});

// PUT update a player's points
router.put('/:name', async (req, res) => {
  const { totalPoints } = req.body;
  await db.collection('leaderboard').doc(req.params.name).update({ totalPoints });
  res.json({ success: true });
});

module.exports = router;