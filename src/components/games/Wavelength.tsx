import { useState } from 'react';

const SPECTRUMS = [
  ['Hot', 'Cold'],
  ['Fast', 'Slow'],
  ['Good', 'Evil'],
  ['Big', 'Small'],
  ['Loud', 'Quiet'],
  ['Happy', 'Sad'],
  ['Old', 'New'],
  ['Beautiful', 'Ugly'],
  ['Famous', 'Unknown'],
  ['Dangerous', 'Safe'],
  ['Expensive', 'Cheap'],
  ['Serious', 'Funny'],
];

const CONCEPTS = [
  'The Sun', 'Ice Cream', 'Lightning', 'A Library', 'A Funeral',
  'A Wedding', 'Taxes', 'A Roller Coaster', 'A Hospital', 'Jazz Music',
  'A Dentist', 'Pizza', 'Monday', 'A Puppy', 'Homework',
  'Social Media', 'A Volcano', 'Coffee', 'A Ghost', 'Winning the Lottery',
  'A Traffic Jam', 'Swimming in the Ocean', 'Getting a Haircut', 'Watching Paint Dry',
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Wavelength() {
  const [spectrum, setSpectrum] = useState(() => pick(SPECTRUMS));
  const [concept, setConcept] = useState(() => pick(CONCEPTS));

  const newRound = () => {
    setSpectrum(pick(SPECTRUMS));
    setConcept(pick(CONCEPTS));
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <h2>🌊 Wavelength</h2>
      <p>The clue giver sees the spectrum and concept. Give a one-word clue — the team guesses where on the spectrum it falls.</p>

      <div style={{ background: '#f0f4ff', border: '1px solid #c0c8f0', borderRadius: '8px', padding: '1.5rem', margin: '1rem 0', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1rem' }}>
          <span>◄ {spectrum[0]}</span>
          <span>{spectrum[1]} ►</span>
        </div>
        <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Concept:</div>
        <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#3045a0' }}>🎯 {concept}</div>
      </div>

      <div style={{ background: '#fffbe6', border: '1px solid #ffe066', borderRadius: '6px', padding: '0.75rem', marginBottom: '1rem' }}>
        <strong>Scoring:</strong> Exact hit → <strong>+2 pts</strong> · Adjacent → <strong>+1 pt</strong>
      </div>

      <button onClick={newRound} style={{ padding: '0.5rem 1.25rem' }}>New Round</button>
    </div>
  );
}
