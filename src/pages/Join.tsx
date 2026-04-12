import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

export default function JoinPage() {
  const { players, addPlayer } = useSession();
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdd = () => {
    const success = addPlayer(nameInput);
    if (!success) {
      setError(nameInput.trim() ? 'Name already in session.' : 'Enter a name.');
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
      <h1>Join Session</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <input
          type="text"
          value={nameInput}
          onChange={(e) => { setNameInput(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          placeholder="Player name"
          style={{ flex: 1, padding: '0.5rem', fontSize: '1rem' }}
        />
        <button onClick={handleAdd} style={{ padding: '0.5rem 1rem' }}>
          Add Player
        </button>
      </div>

      {error && <p style={{ color: 'red', margin: '0 0 0.75rem' }}>{error}</p>}

      {players.length > 0 && (
        <>
          <h3>Players in this session ({players.length})</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem' }}>
            {players.map((p) => (
              <li key={p.name} style={{ padding: '0.25rem 0' }}>
                {p.name}
              </li>
            ))}
          </ul>
        </>
      )}

      <button
        onClick={() => navigate('/session')}
        disabled={players.length === 0}
        style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
      >
        Enter Session
      </button>
    </div>
  );
}
