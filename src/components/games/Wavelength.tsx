import { useState } from "react";
import { useSession } from "../../context/SessionContext";

// ── Theme ──────────────────────────────────────────────────────────────────
const C = {
  red: "#e52521", yellow: "#fbd000", blue: "#049cd8",
  green: "#43b047", black: "#000", cream: "#fff8e7", white: "#fff",
};

// ── Reusable style helpers ─────────────────────────────────────────────────
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

const label = (color: string): React.CSSProperties => ({
  fontFamily: "'Pixel Game', sans-serif", fontSize: "1.1rem",
  color, textShadow: `2px 2px 0 ${C.black}`,
  margin: "0 0 0.5rem", display: "block", letterSpacing: "0.04em",
});

const input: React.CSSProperties = {
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

// ── Title ──────────────────────────────────────────────────────────────────
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

// ── Spectrum bar ───────────────────────────────────────────────────────────
const Bar = ({ left, right, hidden, guess, showHidden, showGuess, showAnswer }: {
  left: string; right: string;
  hidden: number; guess: number;
  showHidden: boolean; showGuess: boolean; showAnswer: boolean;
}) => (
  <div style={{ ...box(C.cream), width: "100%" }}>
    {/* Endpoint labels — plain bold text, easy to read */}
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
      <span style={{ fontFamily: "'PixelPurl', sans-serif", fontSize: "1.3rem", fontWeight: "bold", color: C.red }}>
        ◄ {left.toUpperCase()}
      </span>
      <span style={{ fontFamily: "'PixelPurl', sans-serif", fontSize: "1.3rem", fontWeight: "bold", color: C.blue }}>
        {right.toUpperCase()} ►
      </span>
    </div>

    {/* Gradient bar */}
    <div style={{
      position: "relative", height: 36,
      background: `linear-gradient(90deg, ${C.red}, ${C.yellow}, ${C.green}, ${C.blue})`,
      border: `5px solid ${C.black}`,
      marginBottom: showAnswer ? "2.5rem" : "0.5rem",
    }}>
      {/* Clue giver's hidden marker */}
      {showHidden && !showAnswer && (
        <div style={{ position: "absolute", top: -6, left: `${hidden}%`, transform: "translateX(-50%)", width: 10, height: 44, background: C.black, border: `3px solid ${C.white}` }} />
      )}
      {/* Answer marker (green) */}
      {showAnswer && (
        <div style={{ position: "absolute", top: -14, left: `${hidden}%`, transform: "translateX(-50%)", width: 12, height: 58, background: C.green, border: `3px solid ${C.black}` }}>
          <div style={{ position: "absolute", top: -26, left: "50%", transform: "translateX(-50%)", fontFamily: "'Pixel Game', sans-serif", fontSize: "0.8rem", color: C.white, whiteSpace: "nowrap", textShadow: `2px 2px 0 ${C.black}`, background: C.green, padding: "2px 6px", border: `3px solid ${C.black}` }}>ANSWER</div>
        </div>
      )}
      {/* Guess marker (red) */}
      {showGuess && (
        <div style={{ position: "absolute", top: showAnswer ? -14 : -6, left: `${guess}%`, transform: "translateX(-50%)", width: showAnswer ? 12 : 10, height: showAnswer ? 58 : 44, background: C.red, border: `3px solid ${C.black}` }}>
          {showAnswer && (
            <div style={{ position: "absolute", bottom: -26, left: "50%", transform: "translateX(-50%)", fontFamily: "'Pixel Game', sans-serif", fontSize: "0.8rem", color: C.white, whiteSpace: "nowrap", textShadow: `2px 2px 0 ${C.black}`, background: C.red, padding: "2px 6px", border: `3px solid ${C.black}` }}>GUESS</div>
          )}
        </div>
      )}
    </div>
  </div>
);

// ── Types ──────────────────────────────────────────────────────────────────
type Phase = "setup" | "ai_input" | "manual_input" | "loading" | "cluegiver" | "guessing" | "reveal";
interface Spectrum { left: string; right: string; }

async function fetchSpectrums(theme: string): Promise<Spectrum[]> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5", max_tokens: 1000,
      messages: [{ role: "user", content: `Generate 5 fun spectrum pairs for a party game about "${theme}". Respond ONLY with a JSON array. Example: [{"left":"Sharpshooter","right":"Brick"}]. Be specific, clever, and fun.` }],
    }),
  });
  const data = await res.json();
const clean = data.content[0].text.trim().replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── Component ──────────────────────────────────────────────────────────────
export default function Wavelength() {
  const { players, updatePoints } = useSession();

  const [phase, setPhase] = useState<Phase>("setup");
  const [theme, setTheme] = useState("");
  const [spectrums, setSpectrums] = useState<Spectrum[]>([]);
  const [spectrum, setSpectrum] = useState<Spectrum | null>(null);
  const [hidden, setHidden] = useState(50);
  const [guess, setGuess] = useState(50);
  const [clue, setClue] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [error, setError] = useState("");
  const [leftEnd, setLeftEnd] = useState("");
  const [rightEnd, setRightEnd] = useState("");
  const [clueGiver, setClueGiver] = useState<string | null>(null);
  const [guesser, setGuesser] = useState<string | null>(null);

  const startRound = (s: Spectrum) => {
    setSpectrum(s);
    setHidden(Math.floor(Math.random() * 81) + 10);
    setGuess(50);
    setClue("");
    setShowHidden(false);
    // Pick 2 random players
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    setClueGiver(shuffled[0]?.name ?? null);
    setGuesser(shuffled[1]?.name ?? null);
    setPhase("cluegiver");
  };

  const handleAI = async () => {
    if (!theme.trim()) return;
    setPhase("loading"); setError("");
    try {
      const list = await fetchSpectrums(theme.trim());
      setSpectrums(list);
      startRound(list[Math.floor(Math.random() * list.length)]);
    } catch {
      setError("FAILED TO GENERATE. CHECK CONNECTION!");
      setPhase("ai_input");
    }
  };

  const handleManual = () => {
    if (!leftEnd.trim() || !rightEnd.trim()) return;
    const s = { left: leftEnd.trim(), right: rightEnd.trim() };
    setSpectrums([s]);
    startRound(s);
  };

  const handleReveal = () => {
    setPhase("reveal");
    const diff = Math.abs(hidden - guess);
    const pts = diff <= 5 ? 2 : diff <= 15 ? 1 : 0;
    if (pts > 0) {
      if (clueGiver) updatePoints(clueGiver, pts);
      if (guesser) updatePoints(guesser, pts);
    }
  };

  const diff = Math.abs(hidden - guess);
  const result = diff <= 5 ? "EXACT! +2 PTS 🎯" : diff <= 15 ? "CLOSE! +1 PT 🔥" : "MISS! 0 PTS 😬";
  const resultColor = diff <= 5 ? C.green : diff <= 15 ? C.yellow : C.red;

  // SETUP
  if (phase === "setup") return (
    <div style={page}>
      <Title text="WAVELENGTH" />
      <p style={{ fontFamily: "'Pixel Game', sans-serif", color: C.yellow, fontSize: "1.2rem", textAlign: "center", textShadow: `3px 3px 0 ${C.black}`, margin: 0, letterSpacing: "0.04em" }}>
        ONE PLAYER GIVES A CLUE. EVERYONE GUESSES WHERE IT LANDS!
      </p>
      <div style={{ display: "flex", gap: "1rem", width: "100%", flexWrap: "wrap" }}>
        <button style={{ ...btn(C.blue, C.white), flex: 1 }} onClick={() => setPhase("ai_input")} onMouseEnter={hover.on} onMouseLeave={hover.off}>GENERATE</button>
        <button style={{ ...btn(C.green, C.white), flex: 1 }} onClick={() => setPhase("manual_input")} onMouseEnter={hover.on} onMouseLeave={hover.off}>✏️ Free choice</button>
      </div>
    </div>
  );

  // AI INPUT
  if (phase === "ai_input") return (
    <div style={page}>
      <Title text="AI GENERATE" size="2.5rem" />
      {error && <div style={{ ...box(C.red), width: "100%" }}><span style={{ fontFamily: "'Pixel Game', sans-serif", color: C.white, fontSize: "1.1rem", textShadow: `2px 2px 0 ${C.black}` }}>{error}</span></div>}
      <div style={{ ...box(C.blue), width: "100%" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "stretch" }}>
          <input value={theme} onChange={e => setTheme(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAI()} placeholder="Enter a theme..." style={{ ...input, flex: 1 }} />
          <button style={{ ...btn(C.yellow, C.white, !theme.trim()), whiteSpace: "nowrap" }} disabled={!theme.trim()} onClick={handleAI} onMouseEnter={hover.on} onMouseLeave={hover.off}>GO!</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
        {["Basketball", "Movies", "Food", "Music", "History"].map(t => (
          <button key={t} style={{ ...btn(C.green, C.white), fontSize: "1rem", padding: "0.5rem 1rem" }} onClick={() => setTheme(t)} onMouseEnter={hover.on} onMouseLeave={hover.off}>{t}</button>
        ))}
      </div>
      <button style={{ ...btn(C.yellow, C.white), alignSelf: "flex-start" }} onClick={() => setPhase("setup")} onMouseEnter={hover.on} onMouseLeave={hover.off}>◀ BACK</button>
    </div>
  );

  // MANUAL INPUT
  if (phase === "manual_input") return (
    <div style={page}>
      <Title text="MANUAL INPUT" size="2.5rem" />
      <div style={{ ...box(C.red), width: "100%" }}>
        <span style={label(C.white)}>LEFT END:</span>
        <input value={leftEnd} onChange={e => setLeftEnd(e.target.value)} placeholder="E.g. Sharpshooter" style={input} />
      </div>
      <div style={{ ...box(C.blue), width: "100%" }}>
        <span style={label(C.white)}>RIGHT END:</span>
        <input value={rightEnd} onChange={e => setRightEnd(e.target.value)} placeholder="E.g. Brick" style={input} />
      </div>
      <button style={{ ...btn(C.green, C.white, !leftEnd.trim() || !rightEnd.trim()), width: "100%" }} disabled={!leftEnd.trim() || !rightEnd.trim()} onClick={handleManual} onMouseEnter={hover.on} onMouseLeave={hover.off}>▶ START!</button>
      <button style={{ ...btn(C.yellow, C.white), alignSelf: "flex-start" }} onClick={() => setPhase("setup")} onMouseEnter={hover.on} onMouseLeave={hover.off}>◀ BACK</button>
    </div>
  );

  // LOADING
  if (phase === "loading") return (
    <div style={{ ...page, justifyContent: "center", minHeight: 300 }}>
      <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "2rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}`, textAlign: "center", margin: 0, letterSpacing: "0.06em" }}>
        LOADING...
      </p>
    </div>
  );

  // CLUE GIVER
  if (phase === "cluegiver" && spectrum) return (
    <div style={page}>
      {(clueGiver || guesser) && (
        <div style={{ display: "flex", gap: "0.75rem", width: "100%", flexWrap: "wrap" }}>
          {clueGiver && <div style={{ ...box(C.red), flex: 1, textAlign: "center" }}><span style={label(C.white)}>CLUE GIVER</span><span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.4rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}` }}>{clueGiver.toUpperCase()}</span></div>}
          {guesser && <div style={{ ...box(C.blue), flex: 1, textAlign: "center" }}><span style={label(C.white)}>GUESSER</span><span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.4rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}` }}>{guesser.toUpperCase()}</span></div>}
        </div>
      )}
      <p style={{ fontFamily: "'Pixel Game', sans-serif", color: C.yellow, fontSize: "1.2rem", margin: 0, textShadow: `3px 3px 0 ${C.black}`, textAlign: "center", letterSpacing: "0.04em" }}>
        🔒 CLUE GIVER ONLY — OTHERS LOOK AWAY!
      </p>
      <Bar left={spectrum.left} right={spectrum.right} hidden={hidden} guess={guess} showHidden={showHidden} showGuess={false} showAnswer={false} />
      {!showHidden
        ? <button style={{ ...btn(C.yellow, C.white), width: "100%" }} onClick={() => setShowHidden(true)} onMouseEnter={hover.on} onMouseLeave={hover.off}>👁 REVEAL MY POSITION</button>
        : <div style={{ ...box(C.green), width: "100%", textAlign: "center" }}><p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.3rem", color: C.white, margin: 0, textShadow: `3px 3px 0 ${C.black}` }}>YOUR SPOT: <span style={{ fontSize: "2rem", color: C.yellow }}>{hidden}%</span> FROM LEFT</p></div>
      }
      <div style={{ ...box(C.blue), width: "100%" }}>
        <span style={label(C.white)}>NAME SOMETHING THAT REPRESENTS YOUR SPOT:</span>
        <input value={clue} onChange={e => setClue(e.target.value)} placeholder="E.g. a player, movie, food..." style={input} />
      </div>
      <button style={{ ...btn(C.red, C.white, !clue.trim()), width: "100%" }} disabled={!clue.trim()} onClick={() => clue.trim() && setPhase("guessing")} onMouseEnter={hover.on} onMouseLeave={hover.off}>▶ PASS TO GUESSERS</button>
    </div>
  );

  // GUESSING
  if (phase === "guessing" && spectrum) return (
    <div style={page}>
      <div style={{ ...box(C.yellow), width: "100%", textAlign: "center" }}>
        <span style={{ fontFamily: "'Pixel Game', sans-serif", color: C.black, fontSize: "1.1rem", display: "block", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>THE CLUE IS:</span>
        <span style={{ fontFamily: "'PixelPurl', sans-serif", fontSize: "3rem", color: C.black }}>{clue}</span>
      </div>
      <Bar left={spectrum.left} right={spectrum.right} hidden={hidden} guess={guess} showHidden={false} showGuess={true} showAnswer={false} />
      <input type="range" min={0} max={100} value={guess} onChange={e => setGuess(Number(e.target.value))} style={{ width: "100%", accentColor: C.blue, cursor: "pointer", height: 14 }} />
      <div style={{ ...box(C.blue), width: "100%", textAlign: "center" }}>
        <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.5rem", color: C.white, textShadow: `3px 3px 0 ${C.black}`, letterSpacing: "0.04em" }}>
          YOUR GUESS: <span style={{ color: C.yellow }}>{guess}%</span>
        </span>
      </div>
      <button style={{ ...btn(C.red, C.white), width: "100%" }} onClick={handleReveal} onMouseEnter={hover.on} onMouseLeave={hover.off}>🎯 REVEAL!</button>
    </div>
  );

  // REVEAL
  if (phase === "reveal" && spectrum) {
    const pts = diff <= 5 ? 2 : diff <= 15 ? 1 : 0;
    return (
      <div style={page}>
        <Title text="RESULT!" />
        <div style={{ ...box(resultColor), width: "100%", textAlign: "center" }}>
          <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.7rem", color: C.white, margin: 0, textShadow: `4px 4px 0 ${C.black}`, letterSpacing: "0.04em" }}>{result}</p>
          <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.1rem", color: C.white, margin: "0.5rem 0 0", textShadow: `3px 3px 0 ${C.black}` }}>DIFFERENCE: {diff}%</p>
          {pts > 0 && (clueGiver || guesser) && (
            <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: C.blue, margin: "0.4rem 0 0", textShadow: `2px 2px 0 ${C.black}` }}>
              +{pts} PTS → {[clueGiver, guesser].filter(Boolean).join(" & ").toUpperCase()}
            </p>
          )}
        </div>
        <Bar left={spectrum.left} right={spectrum.right} hidden={hidden} guess={guess} showHidden={false} showGuess={true} showAnswer={true} />
        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
          <div style={{ ...box(C.green), flex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: C.white, textShadow: `2px 2px 0 ${C.black}` }}>ANSWER</div>
            <div style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "2rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}` }}>{hidden}%</div>
            <div style={{ fontFamily: "'PixelPurl', sans-serif", fontSize: "1rem", color: C.white }}>"{clue}"</div>
          </div>
          <div style={{ ...box(C.red), flex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: C.white, textShadow: `2px 2px 0 ${C.black}` }}>GUESS</div>
            <div style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "2rem", color: C.yellow, textShadow: `3px 3px 0 ${C.black}` }}>{guess}%</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
          <button style={{ ...btn(C.green, C.white), flex: 1 }} onClick={() => startRound(spectrums[Math.floor(Math.random() * spectrums.length)])} onMouseEnter={hover.on} onMouseLeave={hover.off}>▶ NEXT ROUND</button>
          <button style={{ ...btn(C.yellow, C.white), flex: 1 }} onClick={() => { setPhase("setup"); setTheme(""); setSpectrums([]); setLeftEnd(""); setRightEnd(""); }} onMouseEnter={hover.on} onMouseLeave={hover.off}>↺ NEW GAME</button>
        </div>
      </div>
    );
  }

  return null;
}
