import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LeaderboardEntry {
  name: string;
  totalPoints: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editPoints, setEditPoints] = useState<number>(0);
  const navigate = useNavigate();

  const loadEntries = () => {
    fetch('/api/leaderboard')
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { setEntries(data); setLoading(false); })
      .catch(() => { setError('Failed to load leaderboard. Is the server running?'); setLoading(false); });
  };

  useEffect(() => { loadEntries(); }, []);

  const handleDelete = async (name: string) => {
    await fetch(`/api/leaderboard/${encodeURIComponent(name)}`, { method: 'DELETE' });
    loadEntries();
  };

  const handleEdit = (entry: LeaderboardEntry) => {
    setEditingName(entry.name);
    setEditPoints(entry.totalPoints);
  };

  const handleSave = async (name: string) => {
    await fetch(`/api/leaderboard/${encodeURIComponent(name)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalPoints: editPoints }),
    });
    setEditingName(null);
    loadEntries();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>Leaderboard</h1>
      <button onClick={() => navigate('/')} style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
        New Session
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && entries.length === 0 && <p>No scores yet.</p>}

      {!loading && !error && entries.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Rank</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Name</th>
              <th style={{ textAlign: 'right', padding: '0.5rem', borderBottom: '2px solid #ccc' }}>Points</th>
              <th style={{ padding: '0.5rem', borderBottom: '2px solid #ccc' }}></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={entry.name}>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', color: '#666' }}>#{i + 1}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>{entry.name}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 'bold' }}>
                  {editingName === entry.name ? (
                    <input
                      type="number"
                      value={editPoints}
                      onChange={(e) => setEditPoints(Number(e.target.value))}
                      style={{ width: 60, textAlign: 'right' }}
                    />
                  ) : (
                    <span style={{ color: entry.totalPoints < 0 ? '#c00' : 'inherit' }}>{entry.totalPoints}</span>
                  )}
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #eee', display: 'flex', gap: '0.5rem' }}>
                  {editingName === entry.name ? (
                    <button onClick={() => handleSave(entry.name)}>Save</button>
                  ) : (
                    <button onClick={() => handleEdit(entry)}>Edit</button>
                  )}
                  <button onClick={() => handleDelete(entry.name)} style={{ color: 'red' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}