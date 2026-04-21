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
<<<<<<< Updated upstream
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load leaderboard. Is the server running?');
        setLoading(false);
      });
=======
      .then((data) => { setEntries(data); setLoading(false); })
      .catch(() => { setError('Failed to load leaderboard. Is the server running?'); setLoading(false); });
>>>>>>> Stashed changes
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>Leaderboard</h1>
<<<<<<< Updated upstream

      <button
        onClick={() => navigate('/')}
        style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}
      >
=======
      <button onClick={() => navigate('/')} style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
>>>>>>> Stashed changes
        New Session
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
<<<<<<< Updated upstream

      {!loading && !error && entries.length === 0 && (
        <p>No scores yet. End a session to add scores.</p>
      )}
=======
      {!loading && !error && entries.length === 0 && <p>No scores yet. End a session to add scores.</p>}
>>>>>>> Stashed changes

      {!loading && !error && entries.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
<<<<<<< Updated upstream
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>
                Rank
              </th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>
                Name
              </th>
              <th style={{ textAlign: 'right', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>
                Points
              </th>
=======
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Rank</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Name</th>
              <th style={{ textAlign: 'right', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Points</th>
>>>>>>> Stashed changes
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={entry.name}>
<<<<<<< Updated upstream
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', color: '#666' }}>
                  #{i + 1}
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{entry.name}</td>
                <td
                  style={{
                    padding: '0.5rem',
                    borderBottom: '1px solid #eee',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: entry.points < 0 ? '#c00' : 'inherit',
                  }}
                >
=======
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', color: '#666' }}>#{i + 1}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{entry.name}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 'bold', color: entry.points < 0 ? '#c00' : 'inherit' }}>
>>>>>>> Stashed changes
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
