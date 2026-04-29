const express = require('express');
const cors = require('cors');
const gamesRouter = require('./api/games');
const promptsRouter = require('./api/prompts');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/games', gamesRouter);
app.use('/api/prompts', promptsRouter);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

