<<<<<<< Updated upstream
const HomePage = () => <h1>Welcome to the Homepage!</h1>;
=======
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Session {
  gameId?: number;
  id?: string;
  name: string;
  winner?: string;
  players?: string[];
}

function HomePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/games')
      .then((res) => res.json())
      .then((data) => setSessions(data))
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Group Game Night Organizer</h1>

      <button
        onClick={() => navigate('/join')}
        style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', marginBottom: '2rem' }}
      >
        Create New Session
      </button>

      <h2>Previous Sessions</h2>
      {sessions.length === 0 && <p style={{ color: '#888' }}>No previous sessions yet.</p>}
      {sessions.map((session) => (
        <div key={session.gameId ?? session.id} style={{ marginBottom: '1rem', padding: '0.75rem', border: '1px solid #eee', borderRadius: '6px' }}>
          <p style={{ margin: '0 0 0.25rem', fontWeight: 'bold', fontSize: '1.05rem' }}>
            {session.name} {session.winner && `— Winner: ${session.winner}`}
          </p>
          {session.players && (
            <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
              Players: {session.players.join(', ')}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
>>>>>>> Stashed changes

export default HomePage;
