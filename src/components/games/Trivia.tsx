import { useState } from 'react';

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
  const [revealed, setRevealed] = useState(false);

  const q = QUESTIONS[qIndex];

  const nextQuestion = () => {
    setQIndex(Math.floor(Math.random() * QUESTIONS.length));
    setRevealed(false);
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <h2>🧠 Trivia</h2>
      <p>Read the question aloud. First player to buzz in and answer correctly gets <strong>+2 pts</strong>.</p>

      <div style={{ background: '#f0f4ff', border: '1px solid #c0c8f0', borderRadius: '8px', padding: '1.5rem', margin: '1rem 0' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.15rem', marginBottom: '1rem' }}>{q.question}</div>
        <ol type="A" style={{ margin: 0, paddingLeft: '1.5rem' }}>
          {q.options.map((opt, i) => (
            <li
              key={i}
              style={{
                padding: '0.3rem 0',
                fontWeight: revealed && i === q.answer ? 'bold' : 'normal',
                color: revealed && i === q.answer ? '#1a7a1a' : 'inherit',
              }}
            >
              {opt} {revealed && i === q.answer && '✓'}
            </li>
          ))}
        </ol>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {!revealed && (
          <button onClick={() => setRevealed(true)} style={{ padding: '0.5rem 1.25rem' }}>
            Reveal Answer
          </button>
        )}
        <button onClick={nextQuestion} style={{ padding: '0.5rem 1.25rem' }}>
          Next Question
        </button>
      </div>
    </div>
  );
}
