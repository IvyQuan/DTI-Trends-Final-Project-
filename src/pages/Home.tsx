import { useEffect, useState } from 'react';
import React from 'react';

const Heading = () => <h1>Welcome to the Homepage!</h1>;

interface Session {
  id: string;
  name: string;
  winner?: string;
  players?: string[];
  gameId?: number;
}

function HomePage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/games')
      .then(res => res.json())
      .then(data => setSessions(data));
  }, []);

  const createSession = async () => {
    // POST: Call a public test API
    try {
      const response = await fetch('https://typicode.com', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Session' }),
        headers: { 'Content-type': 'application/json' },
      });
      const data = await response.json();
      console.log('API Success:', data);
    } catch (e) {
      console.error('API Failed:', e);
    }
    // makes new session
    const newSession = { 
      id: Date.now().toString(), 
      name: `Session ${sessions.length + 1}` 
    };
    setSessions([...sessions, newSession]);
  };

  return (
    <div>
      <h1>Welcome to Group Game Night Organizer!</h1>
      <button onClick={createSession}>Create New Session</button>
      <h2>Previous Sessions</h2>
      {sessions.map((session: any) => (
        <div key={session.gameId || session.id} style={{ marginLeft: '25px' }}>
          <p style={{ fontSize: '20px' }}>{session.name} -- Winner: {session.winner}</p>
          <p>Players: {session.players?.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default HomePage;