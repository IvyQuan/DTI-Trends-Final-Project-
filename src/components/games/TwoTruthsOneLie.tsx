import { useState } from "react";
import { useSession } from "../../context/SessionContext";

// ── Theme ──────────────────────────────────────────────────────────────────
const C = {
  red: "#e52521", yellow: "#fbd000", blue: "#049cd8",
  green: "#43b047", black: "#000", cream: "#fff8e7", white: "#fff",
};

// ── Style helpers (same as Wavelength) ────────────────────────────────────
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

const COLORS = [C.red, C.yellow, C.blue, C.green];
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
type Phase = "setup" | "ai_input" | "loading" | "input" | "guess" | "reveal";

async function fetchTheme(topic: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5", max_tokens: 100,
      messages: [{ role: "user", content: `Give a single short topic prompt (5-8 words) for a Two Truths One Lie party game, related to: "${topic}". Examples: "Your childhood experiences", "Things you have eaten abroad", "Sports you have tried". Respond with ONLY the prompt, no quotes, no explanation.` }],
    }),
  });
  const data = await res.json();
  return data.content[0].text.trim();
}

// ── Component ──────────────────────────────────────────────────────────────
export default function TwoTruthsOneLie() {
  const { players, updatePoints } = useSession();

  const [phase, setPhase] = useState<Phase>("setup");
  const [topic, setTopic] = useState("");
  const [theme, setTheme] = useState("");
  const [error, setError] = useState("");
  const [liar, setLiar] = useState("");
  const [guesser, setGuesser] = useState("");
  const [truth1, setTruth1] = useState("");
  const [truth2, setTruth2] = useState("");
  const [lie, setLie] = useState("");
  const [shuffled, setShuffled] = useState<{ text: string; isLie: boolean }[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const pickPlayers = () => {
    const s = [...players].sort(() => Math.random() - 0.5);
    setLiar(s[0]?.name ?? "");
    setGuesser(s[1]?.name ?? "");
  };

  const handleAI = async () => {
    if (!topic.trim()) return;
    setPhase("loading"); setError("");
    try {
      const generated = await fetchTheme(topic.trim());
      setTheme(generated);
      pickPlayers();
      setPhase("input");
    } catch {
      setError("FAILED TO GENERATE. CHECK CONNECTION!");
      setPhase("ai_input");
    }
  };

  const handleManual = () => {
    setTheme("ANYTHING YOU WANT");
    pickPlayers();
    setPhase("input");
  };

  const handleSubmit = () => {
    if (!truth1.trim() || !truth2.trim() || !lie.trim()) return;
    setShuffled([
      { text: truth1.trim(), isLie: false },
      { text: truth2.trim(), isLie: false },
      { text: lie.trim(), isLie: true },
    ].sort(() => Math.random() - 0.5));
    setSelected(null);
    setPhase("guess");
  };

  const handleConfirm = () => {
    if (selected === null) return;
    const correct = shuffled[selected].isLie;
    if (correct) { if (guesser) updatePoints(guesser, 2); }
    else { if (liar) updatePoints(liar, 2); }
    setPhase("reveal");
  };

  const handleNextRound = () => {
    setTruth1(""); setTruth2(""); setLie(""); setSelected(null);
    pickPlayers(); setPhase("input");
  };

  const handleNewGame = () => {
    setTopic(""); setTheme(""); setError("");
    setTruth1(""); setTruth2(""); setLie(""); setSelected(null);
    setPhase("setup");
  };

  const allFilled = truth1.trim() && truth2.trim() && lie.trim();

  // SETUP
  if (phase === "setup") return (
    <div style={page}>
      <Title text="2 TRUTHS 1 LIE" />
      <p style={{ fontFamily: "'Pixel Game', sans-serif", color: C.yellow, fontSize: "1.2rem", textAlign: "center", textShadow: `3px 3px 0 ${C.black}`, margin: 0, letterSpacing: "0.04em" }}>
        STATE 2 TRUTHS AND 1 LIE. OTHERS VOTE ON THE LIE!
      </p>
      <div style={{ display: "flex", gap: "1rem", width: "100%", flexWrap: "wrap" }}>
        <button style={{ ...btn(C.blue, C.white), flex: 1 }} onClick={() => setPhase("ai_input")} onMouseEnter={hover.on} onMouseLeave={hover.off}>GENERATE THEME</button>
        <button style={{ ...btn(C.green, C.white), flex: 1 }} onClick={handleManual} onMouseEnter={hover.on} onMouseLeave={hover.off}>✏️ FREE CHOICE</button>
      </div>
    </div>
  );

  // AI INPUT
  if (phase === "ai_input") return (
    <div style={page}>
      <Title text="AI THEME" size="2.5rem" />
      {error && <div style={{ ...box(C.red), width: "100%" }}><span style={{ fontFamily: "'Pixel Game', sans-serif", color: C.white, fontSize: "1.1rem", textShadow: `2px 2px 0 ${C.black}` }}>{error}</span></div>}
      <div style={{ ...box(C.blue), width: "100%" }}>
        <span style={lbl(C.white)}>WHAT TOPIC SHOULD THE LIES BE ABOUT?</span>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "stretch" }}>
          <input value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAI()} placeholder="E.g. travel, food, sports..." style={{ ...inp, flex: 1 }} />
          <button style={{ ...btn(C.yellow, C.white, !topic.trim()), whiteSpace: "nowrap" }} disabled={!topic.trim()} onClick={handleAI} onMouseEnter={hover.on} onMouseLeave={hover.off}>GO!</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
        {["Travel", "Food", "Sports", "School", "Hobbies"].map(t => (
          <button key={t} style={{ ...btn(C.green, C.white), fontSize: "1rem", padding: "0.5rem 1rem" }} onClick={() => setTopic(t)} onMouseEnter={hover.on} onMouseLeave={hover.off}>{t}</button>
        ))}
      </div>
      <button style={{ ...btn(C.yellow, C.white), alignSelf: "flex-start" }} onClick={() => setPhase("setup")} onMouseEnter={hover.on} onMouseLeave={hover.off}>◀ BACK</button>
    </div>
  );

  // LOADING
  if (phase === "loading") return (
    <div style={{ ...page, justifyContent: "center", minHeight: 300 }}>
      <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "2rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}`, textAlign: "center", margin: 0, letterSpacing: "0.06em" }}>LOADING...</p>
    </div>
  );

  // INPUT
  if (phase === "input") return (
    <div style={page}>
      <Title text="LIAR'S TURN" size="2.5rem" />
      <div style={{ display: "flex", gap: "0.75rem", width: "100%", flexWrap: "wrap" }}>
        <div style={{ ...box(C.red), flex: 1, textAlign: "center" }}>
          <span style={lbl(C.white)}>LIAR</span>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.4rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}` }}>{liar.toUpperCase()}</span>
        </div>
        {guesser && (
          <div style={{ ...box(C.blue), flex: 1, textAlign: "center" }}>
            <span style={lbl(C.white)}>GUESSER</span>
            <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.4rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}` }}>{guesser.toUpperCase()}</span>
          </div>
        )}
      </div>
      <div style={{ ...box(C.yellow), width: "100%", textAlign: "center" }}>
        <span style={{ fontFamily: "'Pixel Game', sans-serif", color: C.black, fontSize: "1rem", display: "block", marginBottom: "0.3rem", letterSpacing: "0.04em" }}>THEME:</span>
        <span style={{ fontFamily: "'PixelPurl', sans-serif", fontSize: "1.6rem", color: C.black, fontWeight: "bold" }}>{theme}</span>
      </div>
      <p style={{ fontFamily: "'Pixel Game', sans-serif", color: C.red, fontSize: "1.5rem", margin: 0, textShadow: `3px 3px 0 ${C.black}`, textAlign: "center", letterSpacing: "0.04em" }}>
        🔒 LIAR ONLY — OTHERS LOOK AWAY!
      </p>
      <div style={{ ...box(C.green), width: "100%" }}>
        <span style={lbl(C.white)}>TRUTH 1:</span>
        <input value={truth1} onChange={e => setTruth1(e.target.value)} placeholder="A true statement..." style={inp} />
      </div>
      <div style={{ ...box(C.blue), width: "100%" }}>
        <span style={lbl(C.white)}>TRUTH 2:</span>
        <input value={truth2} onChange={e => setTruth2(e.target.value)} placeholder="Another true statement..." style={inp} />
      </div>
      <div style={{ ...box(C.red), width: "100%" }}>
        <span style={lbl(C.white)}>THE LIE:</span>
        <input value={lie} onChange={e => setLie(e.target.value)} placeholder="The sneaky lie..." style={inp} />
      </div>
      <button style={{ ...btn(C.yellow, C.black, !allFilled), width: "100%" }} disabled={!allFilled} onClick={handleSubmit} onMouseEnter={hover.on} onMouseLeave={hover.off}>▶ PASS TO GUESSER</button>
    </div>
  );

  // GUESS
  if (phase === "guess") return (
    <div style={page}>
      <Title text="GUESS THE LIE" size="2.5rem" />
      <div style={{ display: "flex", gap: "0.75rem", width: "100%", flexWrap: "wrap" }}>
        <div style={{ ...box(C.blue), flex: 1, textAlign: "center" }}>
          <span style={lbl(C.white)}>GUESSER</span>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.4rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}` }}>{guesser.toUpperCase()}</span>
        </div>
        <div style={{ ...box(C.red), flex: 1, textAlign: "center" }}>
          <span style={lbl(C.white)}>LIAR</span>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.4rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}` }}>{liar.toUpperCase()}</span>
        </div>
      </div>
      <p style={{ fontFamily: "'Pixel Game', sans-serif", color: C.yellow, fontSize: "1.1rem", margin: 0, textShadow: `3px 3px 0 ${C.black}`, textAlign: "center", letterSpacing: "0.04em" }}>
        WHICH ONE IS THE LIE?
      </p>
      {shuffled.map((s, i) => {
        const isSelected = selected === i;
        return (
          <button key={i} onClick={() => setSelected(i)} style={{
            ...box(isSelected ? C.yellow : C.cream),
            width: "100%", textAlign: "left", cursor: "pointer",
            transform: isSelected ? "translateY(-3px)" : "translateY(0)",
            transition: "transform 0.1s",
          }}>
            <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: C.black, textShadow: `1px 1px 0 ${C.yellow}`, display: "block", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
              STATEMENT {String.fromCharCode(65 + i)}
            </span>
            <span style={{ fontFamily: "'PixelPurl', sans-serif", fontSize: "1.3rem", color: C.black }}>{s.text}</span>
          </button>
        );
      })}
      <button style={{ ...btn(C.red, C.white, selected === null), width: "100%" }} disabled={selected === null} onClick={handleConfirm} onMouseEnter={hover.on} onMouseLeave={hover.off}>✓ CONFIRM GUESS</button>
    </div>
  );

  // REVEAL
  if (phase === "reveal") {
    const correct = selected !== null && shuffled[selected]?.isLie;
    return (
      <div style={page}>
        <Title text="RESULT!" />
        <div style={{ ...box(correct ? C.green : C.red), width: "100%", textAlign: "center" }}>
          <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.6rem", color: C.white, margin: 0, textShadow: `4px 4px 0 ${C.black}`, letterSpacing: "0.04em" }}>
            {correct ? `${guesser.toUpperCase()} GOT IT! 🎯` : `${liar.toUpperCase()} WINS! 🤥`}
          </p>
          <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.1rem", color: C.yellow, margin: "0.5rem 0 0", textShadow: `2px 2px 0 ${C.black}` }}>
            +2 PTS → {correct ? guesser.toUpperCase() : liar.toUpperCase()}
          </p>
        </div>
        <div style={{ ...box(C.cream), width: "100%" }}>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: C.black, display: "block", marginBottom: "0.75rem", letterSpacing: "0.04em", textShadow: `1px 1px 0 ${C.yellow}` }}>THE STATEMENTS WERE:</span>
          {shuffled.map((s, i) => (
            <div key={i} style={{ padding: "0.75rem 1rem", marginBottom: "0.5rem", background: s.isLie ? C.red : C.green, border: `4px solid ${C.black}`, boxShadow: `0 4px 0 ${C.black}` }}>
              <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "0.9rem", color: C.white, textShadow: `2px 2px 0 ${C.black}`, display: "block", marginBottom: "0.25rem", letterSpacing: "0.04em" }}>
                {s.isLie ? "❌ LIE" : "✅ TRUTH"} — STATEMENT {String.fromCharCode(65 + i)}{i === selected ? " ← GUESSED" : ""}
              </span>
              <span style={{ fontFamily: "'PixelPurl', sans-serif", fontSize: "1.2rem", color: C.white }}>{s.text}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
          <button style={{ ...btn(C.green, C.white), flex: 1 }} onClick={handleNextRound} onMouseEnter={hover.on} onMouseLeave={hover.off}>▶ NEXT ROUND</button>
          <button style={{ ...btn(C.yellow, C.white), flex: 1 }} onClick={handleNewGame} onMouseEnter={hover.on} onMouseLeave={hover.off}>↺ NEW GAME</button>
        </div>
      </div>
    );
  }

  return null;
}
