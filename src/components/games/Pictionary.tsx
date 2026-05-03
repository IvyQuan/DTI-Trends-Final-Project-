import { useState } from 'react';
import { useSession } from '../../context/SessionContext';

const NEON = { cyan: "#00d4ff", pink: "#ff2d9b", green: "#00ff88", orange: "#ffaa00" };

const WORDS = [
  'Volcano', 'Rainbow', 'Submarine', 'Tornado', 'Penguin',
  'Skyscraper', 'Astronaut', 'Jellyfish', 'Rollercoaster', 'Lighthouse',
  'Treasure chest', 'Hot air balloon', 'Snowstorm', 'Waterfall', 'Dragon',
  'Traffic jam', 'Sandcastle', 'Bumblebee', 'Quicksand', 'Solar eclipse',
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export default function Pictionary() {
  const { players } = useSession();
  const [word, setWord] = useState(() => pick(WORDS));
  const [shown, setShown] = useState(false);
  const [describerIndex, setDescriberIndex] = useState(0);

  const newWord = () => { setWord(pick(WORDS)); setShown(false); };
  const nextPlayer = () => { setDescriberIndex(i => i + 1); setShown(false); setWord(pick(WORDS)); };

  const describer = players[describerIndex % players.length];

  return (
    <div style={{ maxWidth: 520, fontFamily: "'Space Grotesk', sans-serif" }}>
      <h2 style={{ fontFamily: "'Slackey', cursive", color: "#fff", textShadow: `0 0 14px ${NEON.green}88`, fontSize: "1.5rem", margin: "0 0 0.4rem" }}>
        🎨 Pictionary
      </h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", margin: "0 0 1rem" }}>
        Describer explains <strong style={{ color: NEON.green }}>without saying the word</strong>. Everyone else guesses.
      </p>

      <div style={{ background: `${NEON.green}08`, border: `1.5px solid ${NEON.green}35`, borderRadius: "1rem", padding: "1.75rem", textAlign: "center", boxShadow: `0 0 24px ${NEON.green}18` }}>
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>Describer</div>
        <div style={{ fontSize: "1.8rem", fontFamily: "'Slackey', cursive", color: NEON.green, textShadow: `0 0 14px ${NEON.green}`, marginBottom: "1.25rem" }}>
          {describer?.name ?? '—'}
        </div>
        {shown ? (
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", textShadow: `0 0 20px ${NEON.cyan}`, letterSpacing: "0.03em" }}>
            {word}
          </div>
        ) : (
          <button onClick={() => setShown(true)} style={{
            background: `${NEON.orange}15`, border: `1.5px solid ${NEON.orange}60`,
            borderRadius: "2rem", padding: "0.6rem 1.5rem",
            color: NEON.orange, fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, cursor: "pointer",
            boxShadow: `0 0 14px ${NEON.orange}44`,
            textShadow: `0 0 6px ${NEON.orange}`,
            transition: "all 0.2s",
          }}>Show Word 👀</button>
        )}
      </div>

      <div style={{ background: `${NEON.cyan}0e`, border: `1px solid ${NEON.cyan}30`, borderRadius: "0.75rem", padding: "0.75rem 1rem", color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", margin: "0.75rem 0" }}>
        <strong style={{ color: NEON.cyan }}>Scoring:</strong> First to guess → <strong style={{ color: NEON.green }}>+2 pts</strong> · Describer (if guessed) → <strong style={{ color: NEON.pink }}>+1 pt</strong>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button onClick={newWord} style={{
          background: `${NEON.cyan}15`, border: `1.5px solid ${NEON.cyan}50`,
          borderRadius: "2rem", padding: "0.5rem 1.25rem",
          color: NEON.cyan, fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
          boxShadow: `0 0 12px ${NEON.cyan}40`, transition: "all 0.2s",
        }}>New Word</button>
        <button onClick={nextPlayer} style={{
          background: `${NEON.green}15`, border: `1.5px solid ${NEON.green}50`,
          borderRadius: "2rem", padding: "0.5rem 1.25rem",
          color: NEON.green, fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
          boxShadow: `0 0 12px ${NEON.green}40`, transition: "all 0.2s",
        }}>Next Player →</button>
      </div>
    </div>
  );
}
