import React, { useState } from 'react';

const Heading = () => <h1>Welcome to the Homepage!</h1>;

interface Session {
  id: string;
  name: string;
}

const HomePage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

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
      <Heading />
      <button onClick={createSession}>Create New Session</button>

      <ul>
        {sessions.map(s => (
          <li key={s.id}>
            {s.name} (ID: {s.id})
          </li>
        ))}
      </ul>
    </div>
  );
};

const HomePage = () => <h1>Welcome to the Homepage!</h1>;

export default HomePage;
