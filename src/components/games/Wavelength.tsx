import { useState } from 'react';

const NEON = { cyan: "#00d4ff", pink: "#ff2d9b", purple: "#7b2fff", green: "#00ff88" };

const SPECTRUMS = [
  ['Hot', 'Cold'], ['Fast', 'Slow'], ['Good', 'Evil'], ['Big', 'Small'],
  ['Loud', 'Quiet'], ['Happy', 'Sad'], ['Old', 'New'], ['Beautiful', 'Ugly'],
  ['Famous', 'Unknown'], ['Dangerous', 'Safe'], ['Expensive', 'Cheap'], ['Serious', 'Funny'],
];

const CONCEPTS = [
  'The Sun', 'Ice Cream', 'Lightning', 'A Library', 'A Funeral',
  'A Wedding', 'Taxes', 'A Roller Coaster', 'A Hospital', 'Jazz Music',
  'A Dentist', 'Pizza', 'Monday', 'A Puppy', 'Homework',
  'Social Media', 'A Volcano', 'Coffee', 'A Ghost', 'Winning the Lottery',
  'A Traffic Jam', 'Swimming in the Ocean', 'Getting a Haircut', 'Watching Paint Dry',
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export default function Wavelength() {
  const [spectrum, setSpectrum] = useState(() => pick(SPECTRUMS));
  const [concept, setConcept] = useState(() => pick(CONCEPTS));

  const newRound = () => { setSpectrum(pick(SPECTRUMS)); setConcept(pick(CONCEPTS)); };

  return (
    <div style={{ maxWidth: 520, fontFamily: "'Space Grotesk', sans-serif" }}>
      <h2 style={{ fontFamily: "'Slackey', cursive", color: "#fff", textShadow: `0 0 14px ${NEON.cyan}88`, fontSize: "1.5rem", margin: "0 0 0.4rem" }}>
        🌊 Wavelength
      </h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", margin: "0 0 1rem" }}>
        Give a one-word clue. The team guesses <strong style={{ color: NEON.cyan }}>where on the spectrum</strong> it falls.
      </p>

      <div style={{ background: `${NEON.cyan}08`, border: `1.5px solid ${NEON.cyan}35`, borderRadius: "1rem", padding: "1.75rem", boxShadow: `0 0 24px ${NEON.cyan}18` }}>
        {/* Spectrum bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <span style={{ fontFamily: "'Slackey', cursive", color: NEON.pink, fontSize: "1.1rem", textShadow: `0 0 10px ${NEON.pink}` }}>◄ {spectrum[0]}</span>
          <div style={{ flex: 1, height: 3, margin: "0 1rem", background: `linear-gradient(90deg, ${NEON.pink}, ${NEON.purple}, ${NEON.cyan})`, borderRadius: 999, boxShadow: `0 0 8px ${NEON.purple}` }} />
          <span style={{ fontFamily: "'Slackey', cursive", color: NEON.cyan, fontSize: "1.1rem", textShadow: `0 0 10px ${NEON.cyan}` }}>{spectrum[1]} ►</span>
        </div>

        {/* Concept */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Concept</div>
          <div style={{ fontSize: "2rem", fontFamily: "'Slackey', cursive", color: "#fff", textShadow: `0 0 20px ${NEON.cyan}66`, letterSpacing: "0.02em" }}>
            🎯 {concept}
          </div>
        </div>
      </div>

      <div style={{ background: `${NEON.green}0e`, border: `1px solid ${NEON.green}30`, borderRadius: "0.75rem", padding: "0.75rem 1rem", color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", margin: "0.75rem 0" }}>
        <strong style={{ color: NEON.green }}>Scoring:</strong> Exact hit → <strong style={{ color: NEON.cyan }}>+2 pts</strong> · Adjacent → <strong style={{ color: NEON.pink }}>+1 pt</strong>
      </div>

      <button onClick={newRound} style={{
        background: `${NEON.cyan}15`, border: `1.5px solid ${NEON.cyan}50`,
        borderRadius: "2rem", padding: "0.5rem 1.25rem",
        color: NEON.cyan, fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
        boxShadow: `0 0 12px ${NEON.cyan}40`,
        textShadow: `0 0 6px ${NEON.cyan}`,
        transition: "all 0.2s",
      }}>New Round</button>
    </div>
  );
}
