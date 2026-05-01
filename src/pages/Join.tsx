import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

export default function JoinPage() {
  const { players, addPlayer, removePlayer } = useSession();
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdd = () => {
        const trimmed = nameInput.trim();
    if (!trimmed) { setError('Enter a name.'); return; }
    if (players.length >= 5) { setError('Maximum 5 players.'); return; }
    const success = addPlayer(trimmed);
    if (!success) {
      setError('Name already in session.');
    } else {
      setNameInput('');
      setError('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>Create Game Night</h1>
      <p style={{ color: '#666' }}>Add 1–5 players, then confirm to start.</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => { setNameInput(e.target.value); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Player name"
          disabled={players.length >= 5}
          style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
        />
        <button
          onClick={handleAdd}
          disabled={players.length >= 5}
          style={{ padding: '0.5rem 1rem' }}
        >
          Add
        </button>
      </div>

      {error && <p style={{ color: 'red', margin: '0 0 0.5rem' }}>{error}</p>}

      {players.length > 0 && (
        <>
          <h3>Players ({players.length}/5)</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem' }}>
            {players.map((p) => (
              <li key={p.name} style={{ padding: '0.25rem 0' }}>
                {p.name}
                <button
                  onClick={() => removePlayer(p.name)}
                  style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <button
        onClick={() => navigate('/game')}
        disabled={players.length === 0}
        style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', marginTop: '0.5rem' }}
      >
        Confirm & Start Game Night →
      </button>
    </div>
  );
}