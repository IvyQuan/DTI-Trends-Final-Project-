const express = require('express');
const cors = require('cors');
const leaderboardRouter = require('./api/leaderboard.js');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/leaderboard', leaderboardRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
