import { useState } from 'react';
import { useSession } from '../../context/SessionContext';

const NEON = { cyan: "#00d4ff", pink: "#ff2d9b", orange: "#ffaa00", green: "#00ff88" };

export default function TwoTruthsOneLie() {
  const { players } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPlayer = players[currentIndex % players.length];

  return (
    <div style={{ maxWidth: 520, fontFamily: "'Space Grotesk', sans-serif" }}>
      <h2 style={{ fontFamily: "'Slackey', cursive", color: "#fff", textShadow: `0 0 14px ${NEON.orange}88`, fontSize: "1.5rem", margin: "0 0 0.4rem" }}>
        🤥 Two Truths One Lie
      </h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", margin: "0 0 1rem" }}>
        State <strong style={{ color: NEON.cyan }}>2 truths and 1 lie</strong>. Everyone else votes on which is the lie.
      </p>

      <div style={{ background: `${NEON.orange}08`, border: `1.5px solid ${NEON.orange}35`, borderRadius: "1rem", padding: "2rem", textAlign: "center", boxShadow: `0 0 24px ${NEON.orange}18` }}>
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
          It's this player's turn
        </div>
        <div style={{ fontSize: "2.5rem", fontFamily: "'Slackey', cursive", color: NEON.orange, textShadow: `0 0 20px ${NEON.orange}` }}>
          {currentPlayer?.name ?? '—'}
        </div>
      </div>

      <div style={{ background: `${NEON.cyan}0e`, border: `1px solid ${NEON.cyan}30`, borderRadius: "0.75rem", padding: "0.75rem 1rem", color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", margin: "0.75rem 0" }}>
        <strong style={{ color: NEON.cyan }}>Scoring:</strong> Liar fools someone → <strong style={{ color: NEON.orange }}>+1 pt each</strong> · Correct guess → <strong style={{ color: NEON.green }}>+1 pt</strong>
      </div>

      <button onClick={() => setCurrentIndex(i => i + 1)} style={{
        background: `${NEON.orange}15`, border: `1.5px solid ${NEON.orange}50`,
        borderRadius: "2rem", padding: "0.5rem 1.25rem",
        color: NEON.orange, fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
        boxShadow: `0 0 12px ${NEON.orange}40`,
        textShadow: `0 0 6px ${NEON.orange}`,
        transition: "all 0.2s",
      }}>Next Player →</button>
    </div>
  );
}
