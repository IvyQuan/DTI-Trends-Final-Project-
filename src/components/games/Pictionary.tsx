import { useState } from 'react';
import { useSession } from '../../context/SessionContext';

const WORDS = [
  'Volcano', 'Rainbow', 'Submarine', 'Tornado', 'Penguin',
  'Skyscraper', 'Astronaut', 'Jellyfish', 'Rollercoaster', 'Lighthouse',
  'Treasure chest', 'Hot air balloon', 'Snowstorm', 'Waterfall', 'Dragon',
  'Traffic jam', 'Sandcastle', 'Bumblebee', 'Quicksand', 'Solar eclipse',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Pictionary() {
  const { players } = useSession();
  const [word, setWord] = useState(() => pick(WORDS));
  const [shown, setShown] = useState(false);
  const [describerIndex, setDescriberIndex] = useState(0);

  const newWord = () => { setWord(pick(WORDS)); setShown(false); };
  const nextPlayer = () => { setDescriberIndex((i) => i + 1); setShown(false); setWord(pick(WORDS)); };

  const describer = players[describerIndex % players.length];

  return (
    <div style={{ maxWidth: '500px' }}>
      <h2>🎨 Pictionary</h2>
      <p>The describer explains the word <strong>without saying it</strong>. Everyone else tries to guess.</p>

      <div style={{ background: '#f0f4ff', border: '1px solid #c0c8f0', borderRadius: '8px', padding: '1.5rem', margin: '1rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Describer:</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.25rem' }}>{describer?.name ?? '—'}</div>
        {shown ? (
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3045a0' }}>{word}</div>
        ) : (
          <button onClick={() => setShown(true)} style={{ padding: '0.6rem 1.25rem' }}>
            Show Word (others look away!)
          </button>
        )}
      </div>

      <div style={{ background: '#fffbe6', border: '1px solid #ffe066', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem' }}>
        <strong>Scoring:</strong> First to guess correctly: <strong>+2 pts</strong> · Describer: <strong>+1 pt</strong> if anyone guesses
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={newWord} style={{ padding: '0.5rem 1.25rem' }}>New Word</button>
        <button onClick={nextPlayer} style={{ padding: '0.5rem 1.25rem' }}>Next Player →</button>
      </div>
    </div>
  );
}
