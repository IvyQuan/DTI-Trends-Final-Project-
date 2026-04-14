import { useEffect, useState } from 'react';

function HomePage() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/games')
      .then(res => res.json())
      .then(data => setSessions(data));
  }, []);

  return (
    <div>
      <h1>Welcome to Group Game Night Organizer!</h1>
      <h2>Previous Sessions</h2>
      {sessions.map((session: any) => (
        <div key={session.gameId} style={{ marginLeft: '25px' }}>
          <p style = {{fontSize: '20px'}}>{session.name} -- Winner: {session.winner}</p>
          <p>Players: {session.players.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default HomePage;



