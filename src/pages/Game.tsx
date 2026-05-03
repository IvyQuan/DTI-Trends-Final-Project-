import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import Wavelength from '../components/games/Wavelength';
import TwoTruthsOneLie from '../components/games/TwoTruthsOneLie';
import Trivia from '../components/games/Trivia';
import Pictionary from '../components/games/Pictionary';

type MinigameKey = 'wavelength' | 'twotruthsonelie' | 'trivia' | 'pictionary';

const NEON = { cyan: "#00d4ff", pink: "#ff2d9b", purple: "#7b2fff", green: "#00ff88", orange: "#ffaa00" };
const PLAYER_COLORS = [NEON.cyan, NEON.pink, NEON.purple, NEON.green, NEON.orange];

const MINIGAMES = [
  { key: 'wavelength'      as MinigameKey, name: 'Wavelength',        description: '+2 exact, +1 adjacent.',    emoji: '🌊', color: NEON.cyan   },
  { key: 'twotruthsonelie' as MinigameKey, name: 'Two Truths One Lie', description: 'Fool others, earn pts.',   emoji: '🤥', color: NEON.orange },
  { key: 'trivia'          as MinigameKey, name: 'Trivia',             description: 'First correct = +2.',      emoji: '🧠', color: NEON.pink   },
  { key: 'pictionary'      as MinigameKey, name: 'Pictionary',         description: 'Guesser +2, describer +1.',emoji: '🎨', color: NEON.green  },
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
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1.5rem', textAlign: 'center', padding: '2rem',
    }}>
      <span style={{ fontSize: '4rem', filter: `drop-shadow(0 0 12px ${NEON.cyan})` }}>🎮</span>
      <h2 style={{
        fontFamily: "'Slackey', cursive", fontSize: '2rem',
        color: '#fff', textShadow: `0 0 18px ${NEON.cyan}`,
        margin: 0,
      }}>No Active Session</h2>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        color: 'rgba(255,255,255,0.4)', fontSize: '1rem', margin: 0,
      }}>Let's get some people in here!</p>
      <button
        onClick={() => navigate('/join')}
        style={{
          padding: '0.75rem 2rem', borderRadius: '2rem',
          border: `2px solid ${NEON.cyan}`, background: `${NEON.cyan}18`,
          color: NEON.cyan, fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
          boxShadow: `0 0 18px ${NEON.cyan}44`,
          textShadow: `0 0 8px ${NEON.cyan}`, transition: 'all 0.2s',
        }}
      >Go to Join →</button>
    </div>
  );
}

  const handleEndGame = async () => {
    try {
      const [lbRes, gameRes] = await Promise.all([
        fetch('/api/leaderboard/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ players }) }),
        fetch('/api/games',              { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ players }) }),
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
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>

      {/* Scoreboard bar */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${NEON.cyan}25`,
        padding: '0.85rem 1.5rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
      }}>
        {players.map((p, i) => {
          const c = PLAYER_COLORS[i % PLAYER_COLORS.length];
          return (
            <div key={p.name} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
              padding: '0.4rem 0.85rem', borderRadius: '1rem',
              background: `${c}0e`, border: `1.5px solid ${c}35`, minWidth: 80,
            }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: '0.8rem', color: c, textShadow: `0 0 6px ${c}`,
              }}>{p.name}</span>
              <span style={{
                fontFamily: "'Slackey', cursive", fontSize: '1.6rem',
                color: p.points < 0 ? NEON.pink : '#fff',
                textShadow: `0 0 10px ${p.points < 0 ? NEON.pink : c}66`,
              }}>{p.points}</span>
              <div style={{ display: 'flex', gap: '0.2rem' }}>
                {([-1, 1] as const).map(delta => (
                  <button
                    key={delta}
                    onClick={() => updatePoints(p.name, delta)}
                    style={{
                      width: 24, height: 24, borderRadius: '50%',
                      border: `1.5px solid ${c}60`, background: `${c}15`,
                      color: c, cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Space Grotesk', sans-serif", padding: 0,
                      boxShadow: 'none', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${c}35`; e.currentTarget.style.boxShadow = `0 0 8px ${c}`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = `${c}15`; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {delta === -1 ? '−' : '+'}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <button
          onClick={handleEndGame}
          style={{
            marginLeft: 'auto', padding: '0.55rem 1.25rem', borderRadius: '2rem',
            border: `2px solid ${NEON.pink}`, background: `${NEON.pink}18`,
            color: NEON.pink, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.05em',
            boxShadow: `0 0 14px ${NEON.pink}44`, textShadow: `0 0 6px ${NEON.pink}`,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${NEON.pink}30`; e.currentTarget.style.boxShadow = `0 0 24px ${NEON.pink}88`; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${NEON.pink}18`; e.currentTarget.style.boxShadow = `0 0 14px ${NEON.pink}44`; }}
        >End Game</button>
      </div>

      {/* Minigame area */}
      <div style={{ flex: 1, padding: '2rem 1.5rem' }}>
        {activeGame ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <button
              onClick={() => setActiveGame(null)}
              style={{
                alignSelf: 'flex-start', background: 'none',
                border: `1.5px solid rgba(255,255,255,0.2)`, borderRadius: '2rem',
                color: 'rgba(255,255,255,0.5)', fontFamily: "'Space Grotesk', sans-serif",
                padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.85rem',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
            >← Back to games</button>
            {MINIGAME_COMPONENTS[activeGame]}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{
              margin: 0, fontFamily: "'Slackey', cursive", fontSize: '1.5rem',
              color: '#fff', textShadow: `0 0 14px ${NEON.cyan}66`,
            }}>Choose a Minigame</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1rem', maxWidth: 760,
            }}>
              {MINIGAMES.map(game => (
                <button
                  key={game.key}
                  onClick={() => setActiveGame(game.key)}
                  style={{
                    padding: '1.5rem 1rem', border: `2px solid ${game.color}35`,
                    borderRadius: '1rem', background: `${game.color}08`,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                    boxShadow: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = `2px solid ${game.color}`;
                    e.currentTarget.style.background = `${game.color}18`;
                    e.currentTarget.style.boxShadow = `0 0 24px ${game.color}44`;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = `2px solid ${game.color}35`;
                    e.currentTarget.style.background = `${game.color}08`;
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '2.2rem', filter: `drop-shadow(0 0 6px ${game.color})` }}>{game.emoji}</div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                    marginTop: '0.6rem', color: game.color,
                    textShadow: `0 0 8px ${game.color}88`,
                  }}>{game.name}</div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.8rem',
                    color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem',
                  }}>{game.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
