import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

export default function PointManagerPage() {
  const { players, updatePoints, clearSession } = useSession();
  const navigate = useNavigate();

  if (players.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>No players in session.</p>
        <button onClick={() => navigate('/')}>Go to Join Page</button>
      </div>
    );
  }

  const handleEndSession = async () => {
    try {
      const res = await fetch('/api/leaderboard/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ players }),
      });
      if (!res.ok) throw new Error('Server error');
    } catch {
      alert('Failed to save to leaderboard. Is the server running?');
      return;
    }

    clearSession();
    navigate('/leaderboard');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Point Manager</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>
              Player
            </th>
            <th style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>
              Points
            </th>
            <th style={{ textAlign: 'center', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>
              Adjust
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
                  onClick={() => updatePoints(p.name, -1)}
                  style={{ marginRight: '0.5rem', padding: '0.25rem 0.75rem' }}
                >
                  −1
                </button>
                <button
                  onClick={() => updatePoints(p.name, 1)}
                  style={{ padding: '0.25rem 0.75rem' }}
                >
                  +1
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleEndSession}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          background: '#c53030',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        End Session
      </button>
    </div>
  );
}
