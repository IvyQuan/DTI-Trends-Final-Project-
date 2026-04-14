import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

export default function RemovePlayerPage() {
  const { players, removePlayer } = useSession();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>Remove Players</h1>

      {players.length === 0 ? (
        <p>No players in session.</p>
      ) : (
        <>
          <h3>Players in this session ({players.length})</h3>
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
        onClick={() => navigate('/')}
        style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}
      >
        Back to Join
      </button>
      <button
        onClick={() => navigate('/session')}
        disabled={players.length === 0}
        style={{ padding: '0.5rem 1rem' }}
      >
        Go to Session
      </button>
    </div>
  );
}