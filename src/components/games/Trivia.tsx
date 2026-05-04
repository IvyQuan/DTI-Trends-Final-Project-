import { useState } from "react";
import { useSession } from "../../context/SessionContext";

const C = {
  red: "#e52521", yellow: "#fbd000", blue: "#049cd8",
  green: "#43b047", black: "#000", cream: "#fff8e7", white: "#fff",
};

const COLORS = [C.red, C.yellow, C.blue, C.green];

const box = (bg: string): React.CSSProperties => ({
  background: bg, border: `5px solid ${C.black}`,
  boxShadow: `0 6px 0 ${C.black}`, padding: "1.25rem 1.75rem",
});

const btn = (bg: string, fg: string, off = false): React.CSSProperties => ({
  background: off ? "#999" : bg, color: off ? "#ccc" : fg,
  border: `5px solid ${C.black}`, padding: "0.85rem 1.75rem",
  fontFamily: "'Pixel Game', sans-serif", fontSize: "1.3rem",
  letterSpacing: "0.05em", textTransform: "uppercase" as const,
  textShadow: off ? "none" : `3px 3px 0 ${C.black}`,
  boxShadow: off ? "none" : `0 6px 0 ${C.black}`,
  cursor: off ? "not-allowed" : "pointer",
  transition: "transform 0.1s", opacity: off ? 0.55 : 1,
});

const lbl = (color: string): React.CSSProperties => ({
  fontFamily: "'Pixel Game', sans-serif", fontSize: "1.1rem",
  color, textShadow: `2px 2px 0 ${C.black}`,
  margin: "0 0 0.5rem", display: "block", letterSpacing: "0.04em",
});

const inp: React.CSSProperties = {
  width: "100%", padding: "0.8rem 1rem", border: `5px solid ${C.black}`,
  fontFamily: "'PixelPurl', sans-serif", fontSize: "1.2rem",
  background: C.cream, color: C.black, outline: "none",
  boxShadow: "none", boxSizing: "border-box" as const,
};

const page: React.CSSProperties = {
  maxWidth: 640, margin: "0 auto", padding: "2rem 1rem",
  display: "flex", flexDirection: "column",
  alignItems: "center", gap: "1.25rem", width: "100%",
};

const hover = {
  on: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = "translateY(-3px)"; },
  off: (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = "translateY(0)"; },
};

const outline = (size: number) => {
  const o: string[] = [];
  for (let x = -size; x <= size; x++)
    for (let y = -size; y <= size; y++)
      if (x || y) o.push(`${x}px ${y}px 0 ${C.black}`);
  return o.join(", ");
};

const Title = ({ text, size = "3rem" }: { text: string; size?: string }) => (
  <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
    {text.split("").map((ch, i) => (
      <span key={i} style={{
        display: "inline-block",
        color: ch === " " ? "transparent" : COLORS[i % 4],
        textShadow: ch === " " ? "none" : outline(4),
        fontSize: size, fontFamily: "'Pixel Game', sans-serif",
        transform: ch === " " ? "none" : `translateY(${i % 2 === 0 ? -3 : 3}px)`,
        padding: "0 0.05em",
      }}>{ch === " " ? "\u00A0" : ch}</span>
    ))}
  </span>
);

// ── Types ──────────────────────────────────────────────────────────────────
type Phase = "setup" | "config_ai" | "config_free" | "create_question" | "loading" | "question" | "reveal" | "final";
type Difficulty = "baby" | "ball" | "sheldon";

interface Question {
  question: string;
  options: [string, string, string, string];
  answer: number; // 0-3
}

async function fetchQuestions(subject: string, difficulty: Difficulty, count: number): Promise<Question[]> {
  const diffLabel = difficulty === "baby" ? "very easy, suitable for children"
    : difficulty === "ball" ? "medium difficulty, general knowledge"
    : "very hard, expert level";

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250929", max_tokens: 2000,
      messages: [{ role: "user", content: `Generate ${count} trivia questions about "${subject}". Difficulty: ${diffLabel}.
Respond ONLY with a JSON array. Each item must have: "question" (string), "options" (array of exactly 4 strings), "answer" (index 0-3 of the correct option).
Example: [{"question":"What is 2+2?","options":["3","4","5","6"],"answer":1}]
Make questions specific, fun, and varied. Do not repeat similar questions.` }],
    }),
  });
  const data = await res.json();
  const raw = data.content[0].text.trim();
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── Component ──────────────────────────────────────────────────────────────
export default function Trivia() {
  const { players, updatePoints } = useSession();

  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState<"ai" | "free">("ai");

  // Config
  const [rounds, setRounds] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>("ball");
  const [subject, setSubject] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [error, setError] = useState("");

  // Questions
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);

  // Current question creation (free mode)
  const [freeQ, setFreeQ] = useState("");
  const [freeOpts, setFreeOpts] = useState(["", "", "", ""]);
  const [freeAnswer, setFreeAnswer] = useState<number | null>(null);
  const [freeBuilt, setFreeBuilt] = useState<Question[]>([]);

  // Play
  const [selected, setSelected] = useState<number | null>(null);
  const [playerQueue, setPlayerQueue] = useState<string[]>([]);
  const [usedPlayers, setUsedPlayers] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [playedThisRound, setPlayedThisRound] = useState<string[]>([]);

  const getActivePlayers = () =>
    mode === "free" ? players.filter(p => p.name !== creatorName) : players;

  const buildQueue = (pool: { name: string }[]) =>
    [...pool].sort(() => Math.random() - 0.5).map(p => p.name);

  const nextPlayer = (queue: string[], used: string[]) => {
    if (queue.length === 0) {
      const fresh = buildQueue(getActivePlayers());
      setPlayerQueue(fresh.slice(1));
      setUsedPlayers([fresh[0]]);
      return fresh[0];
    }
    const [next, ...rest] = queue;
    setPlayerQueue(rest);
    setUsedPlayers([...used, next]);
    return next;
  };

  const startPlay = (qs: Question[]) => {
    setQuestions(qs);
    setCurrentQ(0);
    setSelected(null);
    const active = mode === "free" ? players.filter(p => p.name !== creatorName) : players;
    const queue = buildQueue(active);
    const first = queue[0];
    setCurrentPlayer(first);
    setPlayerQueue(queue.slice(1));
    setUsedPlayers([first]);
    setPlayedThisRound([]);
    setPhase("question");
  };

  const handleAIGenerate = async () => {
    if (!subject.trim()) return;
    setPhase("loading"); setError("");
    try {
      const qs = await fetchQuestions(subject.trim(), difficulty, rounds);
      startPlay(qs);
    } catch {
      setError("FAILED TO GENERATE. CHECK CONNECTION!");
      setPhase("config_ai");
    }
  };

  const handleFreeStart = () => {
    setFreeBuilt([]);
    setFreeQ(""); setFreeOpts(["", "", "", ""]); setFreeAnswer(null);
    setPhase("create_question");
  };

  const handleAddFreeQuestion = () => {
    if (!freeQ.trim() || freeOpts.some(o => !o.trim()) || freeAnswer === null) return;
    const newQ: Question = {
      question: freeQ.trim(),
      options: freeOpts.map(o => o.trim()) as [string, string, string, string],
      answer: freeAnswer,
    };
    const updated = [...freeBuilt, newQ];
    setFreeBuilt(updated);
    if (updated.length < rounds) {
      setFreeQ(""); setFreeOpts(["", "", "", ""]); setFreeAnswer(null);
    } else {
      startPlay(updated);
    }
  };

  const handleAnswer = (i: number) => {
  if (selected !== null) return;
  setSelected(i);
  setPlayedThisRound(prev =>
    prev.includes(currentPlayer) ? prev : [...prev, currentPlayer]
  );
  const correct = i === questions[currentQ].answer;
  updatePoints(currentPlayer, correct ? 1 : -1);
  setPhase("reveal");
};

  const handleNext = () => {
    const nextIndex = currentQ + 1;
    if (nextIndex >= questions.length) {
      setPhase("final");
      return;
    }
    setCurrentQ(nextIndex);
    setSelected(null);
    const next = nextPlayer(playerQueue, usedPlayers);
    setCurrentPlayer(next);
    setPhase("question");
  };

  const handleReset = () => {
    setPhase("setup"); setSubject(""); setError("");
    setQuestions([]); setFreeBuilt([]);
    setFreeQ(""); setFreeOpts(["", "", "", ""]); setFreeAnswer(null);
    setCreatorName(""); setRounds(5); setDifficulty("ball");
    setPlayedThisRound([]);
  };

  // SETUP
  if (phase === "setup") return (
    <div style={page}>
      <Title text="TRIVIA" />
      <p style={{ fontFamily: "'Pixel Game', sans-serif", color: C.yellow, fontSize: "1.2rem", textAlign: "center", textShadow: `3px 3px 0 ${C.black}`, margin: 0, letterSpacing: "0.04em" }}>
        FIRST TO ANSWER CORRECTLY WINS THE ROUND!
      </p>
      <div style={{ display: "flex", gap: "1rem", width: "100%", flexWrap: "wrap" }}>
        <button style={{ ...btn(C.blue, C.white), flex: 1 }} onClick={() => { setMode("ai"); setPhase("config_ai"); }} onMouseEnter={hover.on} onMouseLeave={hover.off}>GENERATE</button>
        <button style={{ ...btn(C.green, C.white), flex: 1 }} onClick={() => { setMode("free"); setPhase("config_free"); }} onMouseEnter={hover.on} onMouseLeave={hover.off}>✏️ FREE CHOICE</button>
      </div>
    </div>
  );

  // CONFIG AI
  if (phase === "config_ai") return (
    <div style={page}>
      <Title text="AI TRIVIA" size="2.5rem" />

      {error && <div style={{ ...box(C.red), width: "100%" }}><span style={{ fontFamily: "'Pixel Game', sans-serif", color: C.white, fontSize: "1.1rem", textShadow: `2px 2px 0 ${C.black}` }}>{error}</span></div>}

      {/* Rounds */}
      <div style={{ ...box(C.blue), width: "100%" }}>
        <span style={lbl(C.white)}>HOW MANY ROUNDS? <span style={{ color: C.yellow }}>{rounds}</span></span>
        <input type="range" min={1} max={10} value={rounds} onChange={e => setRounds(Number(e.target.value))}
          style={{ width: "100%", accentColor: C.yellow, cursor: "pointer", height: 12 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Pixel Game', sans-serif", fontSize: "0.9rem", color: C.white, marginTop: "0.4rem" }}>
          <span>1</span><span>10</span>
        </div>
      </div>

      {/* Difficulty */}
      <div style={{ ...box(C.cream), width: "100%" }}>
        <span style={{ ...lbl(C.black), textShadow: `2px 2px 0 ${C.yellow}` }}>DIFFICULTY:</span>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {([
            { key: "baby", label: "JUST A BABY", color: C.green },
            { key: "ball", label: "BALL KNOWLEDGE", color: C.yellow },
            { key: "sheldon", label: "SHELDON COOPER", color: C.red },
          ] as { key: Difficulty; label: string; color: string }[]).map(d => (
            <button key={d.key} onClick={() => setDifficulty(d.key)} style={{
              ...btn(d.color, d.key === "ball" ? C.white : C.white),
              flex: 1, fontSize: "1rem", padding: "0.7rem 0.5rem",
              outline: difficulty === d.key ? `4px solid ${C.black}` : "none",
              transform: difficulty === d.key ? "translateY(-3px)" : "translateY(0)",
            }} onMouseEnter={hover.on} onMouseLeave={hover.off}>{d.label}</button>
          ))}
        </div>
      </div>

      {/* Subject */}
      <div style={{ ...box(C.blue), width: "100%" }}>
        <span style={lbl(C.white)}>WHAT SUBJECT?</span>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "stretch" }}>
          <input value={subject} onChange={e => setSubject(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAIGenerate()} placeholder="E.g. NBA, World War 2, Movies..." style={{ ...inp, flex: 1 }} />
          <button style={{ ...btn(C.yellow, C.white, !subject.trim()), whiteSpace: "nowrap" }} disabled={!subject.trim()} onClick={handleAIGenerate} onMouseEnter={hover.on} onMouseLeave={hover.off}>GO!</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
        {["NBA", "Movies", "History", "Science", "Music"].map(t => (
          <button key={t} style={{ ...btn(C.green, C.white), fontSize: "1rem", padding: "0.5rem 1rem" }} onClick={() => setSubject(t)} onMouseEnter={hover.on} onMouseLeave={hover.off}>{t}</button>
        ))}
      </div>

      <button style={{ ...btn(C.yellow, C.white), alignSelf: "flex-start" }} onClick={() => setPhase("setup")} onMouseEnter={hover.on} onMouseLeave={hover.off}>◀ BACK</button>
    </div>
  );

  // CONFIG FREE
  if (phase === "config_free") return (
    <div style={page}>
      <Title text="FREE CHOICE" size="2.5rem" />

      {/* Rounds */}
      <div style={{ ...box(C.blue), width: "100%" }}>
        <span style={lbl(C.white)}>HOW MANY QUESTIONS? <span style={{ color: C.yellow }}>{rounds}</span></span>
        <input type="range" min={1} max={10} value={rounds} onChange={e => setRounds(Number(e.target.value))}
          style={{ width: "100%", accentColor: C.yellow, cursor: "pointer", height: 12 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Pixel Game', sans-serif", fontSize: "0.9rem", color: C.white, marginTop: "0.4rem" }}>
          <span>1</span><span>10</span>
        </div>
      </div>

      {/* Creator */}
      <div style={{ ...box(C.red), width: "100%" }}>
        <span style={lbl(C.white)}>WHO CREATES THE QUESTIONS?</span>
        <select value={creatorName} onChange={e => setCreatorName(e.target.value)} style={{
          ...inp, fontFamily: "'Pixel Game', sans-serif", fontSize: "1.1rem",
          appearance: "none", cursor: "pointer",
        }}>
          <option value="">-- SELECT A PLAYER --</option>
          <option value="__random__">RANDOM</option>
          {players.map(p => <option key={p.name} value={p.name}>{p.name.toUpperCase()}</option>)}
        </select>
      </div>

      <button
        style={{ ...btn(C.green, C.white, !creatorName), width: "100%" }}
        disabled={!creatorName}
        onClick={() => {
          const name = creatorName === "__random__"
            ? players[Math.floor(Math.random() * players.length)].name
            : creatorName;
          setCreatorName(name);
          handleFreeStart();
        }}
        onMouseEnter={hover.on} onMouseLeave={hover.off}
      >▶ START CREATING</button>

      <button style={{ ...btn(C.yellow, C.white), alignSelf: "flex-start" }} onClick={() => setPhase("setup")} onMouseEnter={hover.on} onMouseLeave={hover.off}>◀ BACK</button>
    </div>
  );

  // CREATE QUESTION (free mode)
  if (phase === "create_question") {
    const qNum = freeBuilt.length + 1;
    const allFilled = freeQ.trim() && freeOpts.every(o => o.trim()) && freeAnswer !== null;
    return (
      <div style={page}>
        <Title text={`QUESTION ${qNum}`} size="2.5rem" />

        <div style={{ ...box(C.yellow), width: "100%", textAlign: "center" }}>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", color: C.black, fontSize: "1rem", letterSpacing: "0.04em" }}>
            CREATOR: <span style={{ color: C.red, textShadow: `2px 2px 0 ${C.black}` }}>{creatorName.toUpperCase()}</span>
          </span>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", color: C.black, fontSize: "0.9rem", display: "block", marginTop: "0.25rem" }}>
            {qNum} OF {rounds}
          </span>
        </div>

        <p style={{ fontFamily: "'Pixel Game', sans-serif", color: C.yellow, fontSize: "1.1rem", margin: 0, textShadow: `3px 3px 0 ${C.black}`, textAlign: "center", letterSpacing: "0.04em" }}>
          🔒 CREATOR ONLY — OTHERS LOOK AWAY!
        </p>

        <div style={{ ...box(C.blue), width: "100%" }}>
          <span style={lbl(C.white)}>THE QUESTION:</span>
          <input value={freeQ} onChange={e => setFreeQ(e.target.value)} placeholder="Type your question..." style={inp} />
        </div>

        {(["A", "B", "C", "D"] as const).map((letter, i) => (
          <div key={i} style={{ ...box(freeAnswer === i ? C.green : C.cream), width: "100%", cursor: "pointer" }} onClick={() => setFreeAnswer(i)}>
            <span style={lbl(freeAnswer === i ? C.white : C.red)}>
              OPTION {letter} {freeAnswer === i ? "✓ CORRECT" : "(CLICK TO SET AS CORRECT)"}
            </span>
            <input
              value={freeOpts[i]}
              onChange={e => { const o = [...freeOpts]; o[i] = e.target.value; setFreeOpts(o); }}
              placeholder={`Option ${letter}...`}
              style={{ ...inp, background: freeAnswer === i ? C.cream : C.cream }}
              onClick={e => e.stopPropagation()}
            />
          </div>
        ))}

        <button style={{ ...btn(C.red, C.white, !allFilled), width: "100%" }} disabled={!allFilled} onClick={handleAddFreeQuestion} onMouseEnter={hover.on} onMouseLeave={hover.off}>
          {freeBuilt.length + 1 < rounds ? "▶ NEXT QUESTION" : "▶ START GAME"}
        </button>
      </div>
    );
  }

  // LOADING
  if (phase === "loading") return (
    <div style={{ ...page, justifyContent: "center", minHeight: 300 }}>
      <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "2rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}`, textAlign: "center", margin: 0, letterSpacing: "0.06em" }}>
        LOADING...
      </p>
    </div>
  );

  // QUESTION
  if (phase === "question" && questions[currentQ]) {
    const q = questions[currentQ];
    return (
      <div style={page}>
        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: C.yellow, textShadow: `2px 2px 0 ${C.black}` }}>
            QUESTION {currentQ + 1} / {questions.length}
          </span>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: C.white, textShadow: `2px 2px 0 ${C.black}` }}>
            +1 RIGHT · -1 WRONG
          </span>
        </div>

        {/* Current player */}
        <div style={{ ...box(C.red), width: "100%", textAlign: "center" }}>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: C.white, textShadow: `2px 2px 0 ${C.black}`, display: "block", marginBottom: "0.3rem" }}>NOW ANSWERING</span>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.8rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}` }}>{currentPlayer.toUpperCase()}</span>
        </div>

        {/* Question */}
        <div style={{ ...box(C.cream), width: "100%" }}>
          <span style={{ fontFamily: "'PixelPurl', sans-serif", fontSize: "1.4rem", color: C.black, lineHeight: 1.4 }}>{q.question}</span>
        </div>

        {/* Options */}
        {q.options.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(i)} style={{
            ...btn(COLORS[i], C.white), width: "100%", textAlign: "left",
            fontSize: "1.1rem", padding: "1rem 1.5rem",
          }} onMouseEnter={hover.on} onMouseLeave={hover.off}>
            <span style={{ opacity: 0.7 }}>{String.fromCharCode(65 + i)}. </span>{opt}
          </button>
        ))}
      </div>
    );
  }

  // REVEAL
  if (phase === "reveal" && questions[currentQ]) {
    const q = questions[currentQ];
    const correct = selected === q.answer;
    return (
      <div style={page}>
        <div style={{ ...box(correct ? C.green : C.red), width: "100%", textAlign: "center" }}>
          <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.6rem", color: C.white, margin: 0, textShadow: `4px 4px 0 ${C.black}`, letterSpacing: "0.04em" }}>
            {correct ? `${currentPlayer.toUpperCase()} GOT IT! 🎯` : `WRONG! 😬`}
          </p>
          <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: C.yellow, margin: "0.4rem 0 0", textShadow: `2px 2px 0 ${C.black}` }}>
            {correct ? "+1 PT" : "-1 PT"} → {currentPlayer.toUpperCase()}
          </p>
        </div>

        {/* Show all options with correct highlighted */}
        <div style={{ ...box(C.cream), width: "100%" }}>
          <span style={{ fontFamily: "'PixelPurl', sans-serif", fontSize: "1.3rem", color: C.black, display: "block", marginBottom: "0.75rem", lineHeight: 1.4 }}>{q.question}</span>
          {q.options.map((opt, i) => (
            <div key={i} style={{
              padding: "0.65rem 1rem", marginBottom: "0.5rem",
              background: i === q.answer ? C.green : i === selected && !correct ? C.red : "#e0e0d0",
              border: `4px solid ${C.black}`, boxShadow: `0 4px 0 ${C.black}`,
            }}>
              <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "0.9rem", color: i === q.answer || (i === selected && !correct) ? C.white : C.black, textShadow: i === q.answer || (i === selected && !correct) ? `2px 2px 0 ${C.black}` : "none", letterSpacing: "0.04em" }}>
                {String.fromCharCode(65 + i)}. {i === q.answer ? "✅ CORRECT — " : i === selected ? "❌ YOUR ANSWER — " : ""}{opt}
              </span>
            </div>
          ))}
        </div>

        <button style={{ ...btn(currentQ + 1 >= questions.length ? C.yellow : C.blue, C.white), width: "100%" }} onClick={handleNext} onMouseEnter={hover.on} onMouseLeave={hover.off}>
          {currentQ + 1 >= questions.length ? "🏆 SEE FINAL SCORES" : "▶ NEXT QUESTION"}
        </button>
      </div>
    );
  }

  // FINAL
  if (phase === "final") {
    const sorted = players
    .filter(p => playedThisRound.includes(p.name))
    .sort((a, b) => b.points - a.points);
    return (
      <div style={page}>
        <Title text="GAME OVER!" />
        <div style={{ ...box(C.blue), width: "100%" }}>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.1rem", color: C.white, textShadow: `2px 2px 0 ${C.black}`, display: "block", marginBottom: "0.75rem", letterSpacing: "0.04em" }}>LEADERBOARD</span>
          {sorted.filter(p => p.name).map((p, i) => (
            <div key={p.name} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "0.65rem 1rem", marginBottom: "0.5rem",
              background: i === 0 ? C.yellow : C.cream,
              border: `4px solid ${C.black}`, boxShadow: `0 4px 0 ${C.black}`,
            }}>
              <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.1rem", color: C.cream, textShadow: i === 0 ? `2px 2px 0 ${C.black}` : "none", letterSpacing: "0.04em" }}>
                {i === 0 ? "🏆 " : `${i + 1}. `}{p.name ? p.name.toUpperCase() : "???"}
              </span>
              <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.4rem", color: i === 0 ? C.red : C.blue, textShadow: `2px 2px 0 ${C.black}` }}>
                {p.points} PTS
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
          <button style={{ ...btn(C.blue, C.white), flex: 1 }} onClick={() => { setPhase("config_ai"); setSubject(""); }} onMouseEnter={hover.on} onMouseLeave={hover.off}>▶ PLAY AGAIN</button>
          <button style={{ ...btn(C.yellow, C.white), flex: 1 }} onClick={handleReset} onMouseEnter={hover.on} onMouseLeave={hover.off}>↺ NEW GAME</button>
        </div>
      </div>
    );
  }

  return null;
}
