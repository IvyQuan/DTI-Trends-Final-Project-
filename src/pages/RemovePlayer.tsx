import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

export default function RemovePlayerPage() {
  const { players, removePlayer } = useSession();
  const navigate = useNavigate();

  if (players.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>No players in session.</p>
        <button onClick={() => navigate('/')}>Go to Join Page</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>Remove Players</h1>

      <button
        onClick={() => navigate('/session')}
        style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}
      >
        Back to Session
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>
              Player
            </th>
            <th style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>
              Points
            </th>
            <th style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>
              Remove
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.name}>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{p.name}</td>
              <td
                style={{
                  padding: '0.5rem',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  borderBottom: '1px solid #eee',
                  color: p.points < 0 ? '#c00' : 'inherit',
                }}
              >
                {p.points}
              </td>
              <td style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                <button
                  onClick={() => {
                    if (confirm(`Remove ${p.name}?`)) removePlayer(p.name);
                  }}
                  style={{
                    padding: '0.25rem 0.75rem',
                    background: '#c53030',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}