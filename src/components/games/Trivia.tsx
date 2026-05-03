import { useState } from 'react';

const NEON = { cyan: "#00d4ff", pink: "#ff2d9b", green: "#00ff88" };

const QUESTIONS = [
  { question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], answer: 2 },
  { question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], answer: 1 },
  { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Saturn', 'Mars'], answer: 3 },
  { question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'], answer: 2 },
  { question: 'What is the chemical symbol for gold?', options: ['Go', 'Gd', 'Au', 'Ag'], answer: 2 },
  { question: 'How many bones are in the adult human body?', options: ['186', '206', '216', '226'], answer: 1 },
  { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 3 },
  { question: 'In what year did World War II end?', options: ['1943', '1944', '1945', '1946'], answer: 2 },
  { question: 'What is the smallest prime number?', options: ['0', '1', '2', '3'], answer: 2 },
  { question: 'Which element has the atomic number 1?', options: ['Helium', 'Lithium', 'Hydrogen', 'Oxygen'], answer: 2 },
  { question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], answer: 1 },
  { question: 'How many strings does a standard guitar have?', options: ['4', '5', '6', '7'], answer: 2 },
  { question: 'What language has the most native speakers in the world?', options: ['English', 'Spanish', 'Hindi', 'Mandarin'], answer: 3 },
  { question: 'What is the hardest natural substance on Earth?', options: ['Quartz', 'Diamond', 'Titanium', 'Obsidian'], answer: 1 },
  { question: 'How many continents are there?', options: ['5', '6', '7', '8'], answer: 2 },
];

export default function Trivia() {
  const [qIndex, setQIndex] = useState(() => Math.floor(Math.random() * QUESTIONS.length));
  const [used, setUsed] = useState<Set<number>>(() => new Set());
  const [revealed, setRevealed] = useState(false);

  const q = QUESTIONS[qIndex];

  const nextQuestion = () => {
    const remaining = QUESTIONS.map((_, i) => i).filter(i => !used.has(i) && i !== qIndex);
    if (remaining.length === 0) {
      const fresh = QUESTIONS.map((_, i) => i).filter(i => i !== qIndex);
      const next = fresh[Math.floor(Math.random() * fresh.length)];
      setUsed(new Set([next])); setQIndex(next);
    } else {
      const next = remaining[Math.floor(Math.random() * remaining.length)];
      setUsed(prev => new Set(prev).add(next)); setQIndex(next);
    }
    setRevealed(false);
  };

  return (
    <div style={{ maxWidth: 520, fontFamily: "'Space Grotesk', sans-serif" }}>
      <h2 style={{ fontFamily: "'Slackey', cursive", color: "#fff", textShadow: `0 0 14px ${NEON.pink}88`, fontSize: "1.5rem", margin: "0 0 0.4rem" }}>
        🧠 Trivia
      </h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", margin: "0 0 1rem" }}>
        Read aloud. First to buzz in and answer correctly gets <strong style={{ color: NEON.cyan }}>+2 pts</strong>.
      </p>

      <div style={{ background: `${NEON.pink}08`, border: `1.5px solid ${NEON.pink}35`, borderRadius: "1rem", padding: "1.5rem", boxShadow: `0 0 24px ${NEON.pink}18` }}>
        <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: "0 0 1rem" }}>{q.question}</p>
        <ol type="A" style={{ margin: 0, paddingLeft: "1.5rem" }}>
          {q.options.map((opt, i) => (
            <li key={i} style={{
              padding: "0.35rem 0",
              color: revealed && i === q.answer ? NEON.green : "rgba(255,255,255,0.7)",
              fontWeight: revealed && i === q.answer ? 700 : 400,
              textShadow: revealed && i === q.answer ? `0 0 8px ${NEON.green}` : "none",
              fontSize: "0.95rem",
            }}>
              {opt} {revealed && i === q.answer && <span style={{ color: NEON.green }}>✓</span>}
            </li>
          ))}
        </ol>
      </div>

      <div style={{ background: `${NEON.cyan}0e`, border: `1px solid ${NEON.cyan}30`, borderRadius: "0.75rem", padding: "0.75rem 1rem", color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", margin: "0.75rem 0" }}>
        <strong style={{ color: NEON.cyan }}>Scoring:</strong> Correct buzz-in → +2 pts
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {!revealed && (
          <button onClick={() => setRevealed(true)} style={{
            background: `${NEON.cyan}15`, border: `1.5px solid ${NEON.cyan}50`,
            borderRadius: "2rem", padding: "0.5rem 1.25rem",
            color: NEON.cyan, fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
            boxShadow: `0 0 12px ${NEON.cyan}40`, transition: "all 0.2s",
          }}>Reveal Answer</button>
        )}
        <button onClick={nextQuestion} style={{
          background: `${NEON.pink}15`, border: `1.5px solid ${NEON.pink}50`,
          borderRadius: "2rem", padding: "0.5rem 1.25rem",
          color: NEON.pink, fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
          boxShadow: `0 0 12px ${NEON.pink}40`, transition: "all 0.2s",
        }}>Next Question →</button>
      </div>
    </div>
  );
}
