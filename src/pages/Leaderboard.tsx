import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  name: string;
  points: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => {
        if (!r.ok) throw new Error('Server error');
        return r.json();
      })
      .then((data) => { setEntries(data); setLoading(false); })
      .catch(() => { setError('Failed to load leaderboard. Is the server running?'); setLoading(false); });
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>Leaderboard</h1>
      <button onClick={() => navigate('/')} style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
        New Session
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && entries.length === 0 && <p>No scores yet. End a session to add scores.</p>}

      {!loading && !error && entries.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Rank</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Name</th>
              <th style={{ textAlign: 'right', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={entry.name}>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', color: '#666' }}>#{i + 1}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{entry.name}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 'bold', color: entry.points < 0 ? '#c00' : 'inherit' }}>
                  {entry.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
