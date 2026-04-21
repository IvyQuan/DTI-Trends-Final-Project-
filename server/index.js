const express = require('express');
const cors = require('cors');
<<<<<<< Updated upstream
const leaderboardRouter = require('./api/leaderboard.js');
=======
const gamesRouter = require('./api/games');
const promptsRouter = require('./api/prompts');
const leaderboardRouter = require('./api/leaderboard');
>>>>>>> Stashed changes

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

<<<<<<< Updated upstream
=======
app.use('/api/games', gamesRouter);
app.use('/api/prompts', promptsRouter);
>>>>>>> Stashed changes
app.use('/api/leaderboard', leaderboardRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
