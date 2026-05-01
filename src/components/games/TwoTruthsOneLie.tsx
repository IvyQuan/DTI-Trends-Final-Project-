import { useState } from 'react';
import { useSession } from '../../context/SessionContext';

export default function TwoTruthsOneLie() {
  const { players } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPlayer = players[currentIndex % players.length];

  return (
    <div style={{ maxWidth: '500px' }}>
      <h2>🤥 Two Truths One Lie</h2>
      <p>The current player states <strong>2 truths and 1 lie</strong> about themselves. Everyone else votes on which statement is the lie.</p>

      <div style={{ background: '#f0f4ff', border: '1px solid #c0c8f0', borderRadius: '8px', padding: '1.5rem', margin: '1rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>It's this player's turn:</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{currentPlayer?.name ?? '—'}</div>
      </div>

      <div style={{ background: '#fffbe6', border: '1px solid #ffe066', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem' }}>
        <strong>Scoring:</strong> Lie-teller gets <strong>+1</strong> for each person they fool ·
        Each guesser gets <strong>+1</strong> for correctly identifying the lie
      </div>

      <button
        onClick={() => setCurrentIndex((i) => i + 1)}
        style={{ padding: '0.5rem 1.25rem' }}
      >
        Next Player →
      </button>
    </div>
  );
}
