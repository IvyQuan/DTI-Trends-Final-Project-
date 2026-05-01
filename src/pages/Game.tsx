import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Wavelength from '../components/games/Wavelength';
import TwoTruthsOneLie from '../components/games/TwoTruthsOneLie';
import Trivia from '../components/games/Trivia';
import Pictionary from '../components/games/Pictionary';

type MinigameKey = 'wavelength' | 'twotruthsonelie' | 'trivia' | 'pictionary';

const MINIGAMES: { key: MinigameKey; name: string; description: string; emoji: string }[] = [
  { key: 'wavelength', name: 'Wavelength', description: 'Give a clue on a hidden spectrum. +2 exact, +1 adjacent.', emoji: '🌊' },
  { key: 'twotruthsonelie', name: 'Two Truths One Lie', description: 'Fool others with your lie. Points for tricking people.', emoji: '🤥' },
  { key: 'trivia', name: 'Trivia', description: 'First to answer correctly gets +2 points.', emoji: '🧠' },
  { key: 'pictionary', name: 'Pictionary', description: 'Describe a word without saying it. Guesser +2, describer +1.', emoji: '🎨' },
];

const MINIGAME_COMPONENTS: Record<MinigameKey, JSX.Element> = {
  wavelength: <Wavelength />,
  twotruthsonelie: <TwoTruthsOneLie />,
  trivia: <Trivia />,
  pictionary: <Pictionary />,
};

export default function GamePage() {
  const { players, updatePoints, clearSession } = useSession();
  const [activeGame, setActiveGame] = useState<MinigameKey | null>(null);
  const navigate = useNavigate();

  if (players.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>No active session.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const handleEndGame = async () => {
    try {
      const [lbRes, gameRes] = await Promise.all([
        fetch('/api/leaderboard/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ players }),
        }),
        fetch('/api/games', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ players }),
        }),
      ]);
      if (!lbRes.ok || !gameRes.ok) throw new Error();
    } catch {
      alert('Failed to save session. Is the server running?');
      return;
    }
    clearSession();
    navigate('/leaderboard');
  };

  return (
    <div>
      {/* Scoreboard bar */}
      <div style={{
        background: '#f8f8f8',
        borderBottom: '2px solid #ddd',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        {players.map((p) => (
          <div key={p.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{p.name}</span>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: p.points < 0 ? '#c00' : '#222',
              minWidth: '2rem',
              textAlign: 'center',
            }}>
              {p.points}
            </span>
            <div style={{ display: 'flex', gap: '0.2rem' }}>
              <button onClick={() => updatePoints(p.name, -1)} style={{ padding: '0.1rem 0.6rem', cursor: 'pointer' }}>−</button>
              <button onClick={() => updatePoints(p.name, 1)} style={{ padding: '0.1rem 0.6rem', cursor: 'pointer' }}>+</button>
            </div>
          </div>
        ))}

        <button
          onClick={handleEndGame}
          style={{
            marginLeft: 'auto',
            padding: '0.6rem 1.25rem',
            background: '#c53030',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          End Game
        </button>
      </div>

      {/* Minigame area */}
      <div style={{ padding: '2rem' }}>
        {activeGame ? (
          <>
            <button
              onClick={() => setActiveGame(null)}
              style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem', cursor: 'pointer' }}
            >
              ← Back to games
            </button>
            {MINIGAME_COMPONENTS[activeGame]}
          </>
        ) : (
          <>
            <h2 style={{ marginTop: 0 }}>Choose a Minigame</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
              maxWidth: '700px',
            }}>
              {MINIGAMES.map((game) => (
                <button
                  key={game.key}
                  onClick={() => setActiveGame(game.key)}
                  style={{
                    padding: '1.25rem',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    background: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#888')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#ddd')}
                >
                  <div style={{ fontSize: '2rem' }}>{game.emoji}</div>
                  <div style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>{game.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>{game.description}</div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
