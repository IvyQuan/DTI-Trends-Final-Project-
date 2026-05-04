import { useState } from "react";
import { useSession } from "../../context/SessionContext";

const MARIO = {
  red: "#e52521",
  yellow: "#fbd000",
  blue: "#049cd8",
  green: "#43b047",
  black: "#000000",
  cream: "#fff8e7",
  white: "#ffffff",
};

const LETTER_COLORS = [MARIO.red, MARIO.yellow, MARIO.blue, MARIO.green];

const surroundOutline = (color: string, size: number) => {
  const offsets: string[] = [];
  for (let x = -size; x <= size; x++) {
    for (let y = -size; y <= size; y++) {
      if (x === 0 && y === 0) continue;
      offsets.push(`${x}px ${y}px 0 ${color}`);
    }
  }
  return offsets.join(", ");
};

const RainbowText = ({ text, fontSize, outlineSize = 4 }: { text: string; fontSize: string; outlineSize?: number }) => {
  const fontSizeValue = parseFloat(fontSize);
  const fontSizeUnit = fontSize.replace(String(fontSizeValue), "");
  const spaceSize = `${fontSizeValue * 0.4}${fontSizeUnit}`;
  return (
    <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
      {text.split("").map((ch, i) => (
        <span key={i} style={{
          display: "inline-block",
          color: ch === " " ? "transparent" : LETTER_COLORS[i % LETTER_COLORS.length],
          textShadow: ch === " " ? "none" : surroundOutline(MARIO.black, outlineSize),
          fontSize: ch === " " ? spaceSize : fontSize,
          transform: ch === " " ? "none" : `translateY(${i % 2 === 0 ? -3 : 3}px)`,
          padding: "0 0.05em",
          fontFamily: "'Pixel Game', sans-serif",
        }}>{ch === " " ? "\u00A0" : ch}</span>
      ))}
    </span>
  );
};

const pixelBox = (bg: string): React.CSSProperties => ({
  background: bg,
  border: `5px solid ${MARIO.black}`,
  boxShadow: `0 6px 0 ${MARIO.black}`,
  padding: "1.25rem 1.75rem",
});

const pixelBtn = (bg: string, fg: string, disabled = false): React.CSSProperties => ({
  background: disabled ? "#999" : bg,
  color: disabled ? "#ccc" : fg,
  border: `5px solid ${MARIO.black}`,
  padding: "0.85rem 1.75rem",
  fontFamily: "'Pixel Game', sans-serif",
  fontSize: "1.3rem",
  letterSpacing: "0.05em",
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: disabled ? "none" : `0 6px 0 ${MARIO.black}`,
  textTransform: "uppercase" as const,
  textShadow: disabled ? "none" : `3px 3px 0 ${MARIO.black}`,
  transition: "transform 0.1s",
  opacity: disabled ? 0.55 : 1,
});

const pxLabel = (color: string): React.CSSProperties => ({
  fontFamily: "'Pixel Game', sans-serif",
  fontSize: "1.15rem",
  color,
  textShadow: `3px 3px 0 ${MARIO.black}`,
  margin: "0 0 0.5rem",
  display: "block",
  letterSpacing: "0.04em",
});

const wrap: React.CSSProperties = {
  maxWidth: 640,
  margin: "0 auto",
  padding: "2rem 1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.25rem",
  width: "100%",
};

const pxInput: React.CSSProperties = {
  width: "100%",
  padding: "0.8rem 1rem",
  border: `5px solid ${MARIO.black}`,
  fontFamily: "'PixelPurl', sans-serif",
  fontSize: "1.2rem",
  background: MARIO.cream,
  color: MARIO.black,
  outline: "none",
  boxShadow: "none",
  boxSizing: "border-box" as const,
};

type Phase = "setup" | "ai_input" | "manual_input" | "loading" | "cluegiver" | "guessing" | "reveal";
interface Spectrum { left: string; right: string; }

async function generateSpectrums(theme: string): Promise<Spectrum[]> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `Generate 5 fun spectrum pairs for a party game about the theme: "${theme}".
Each spectrum should be two opposite extremes that are specific and funny/interesting for that theme.
Respond ONLY with a JSON array, no markdown, no explanation. Example format:
[{"left":"Sharpshooter","right":"Brick"},{"left":"Ball Hog","right":"Facilitator"}]
Make them specific to the theme, clever, and fun for a party game.`,
      }],
    }),
  });
  const data = await response.json();
  const text = data.content[0].text.trim();
  return JSON.parse(text);
}

// Spectrum bar — controlled entirely by props
const SpectrumBar = ({
  spectrum,
  hiddenPosition,
  guessPosition,
  showHiddenMarker,
  showGuessMarker,
  showAnswerMarker,
}: {
  spectrum: Spectrum;
  hiddenPosition: number;
  guessPosition: number;
  showHiddenMarker: boolean;
  showGuessMarker: boolean;
  showAnswerMarker: boolean;
}) => (
  <div style={{ ...pixelBox(MARIO.cream), width: "100%" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
      <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.2rem", color: MARIO.red, textShadow: `3px 3px 0 ${MARIO.black}`, letterSpacing: "0.04em" }}>
        ◄ {spectrum.left.toUpperCase()}
      </span>
      <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.2rem", color: MARIO.blue, textShadow: `3px 3px 0 ${MARIO.black}`, letterSpacing: "0.04em" }}>
        {spectrum.right.toUpperCase()} ►
      </span>
    </div>

    <div style={{
      position: "relative",
      height: 36,
      background: `linear-gradient(90deg, ${MARIO.red}, ${MARIO.yellow}, ${MARIO.green}, ${MARIO.blue})`,
      border: `5px solid ${MARIO.black}`,
      marginBottom: showAnswerMarker ? "2.5rem" : "0.5rem",
    }}>
      {/* Hidden position marker — only shown to clue giver after they tap reveal */}
      {showHiddenMarker && !showAnswerMarker && (
        <div style={{
          position: "absolute", top: -6, left: `${hiddenPosition}%`,
          transform: "translateX(-50%)",
          width: 10, height: 44,
          background: MARIO.black, border: `3px solid ${MARIO.white}`,
        }} />
      )}

      {/* Answer marker (green) — only on reveal screen */}
      {showAnswerMarker && (
        <div style={{
          position: "absolute", top: -14, left: `${hiddenPosition}%`,
          transform: "translateX(-50%)",
          width: 12, height: 58,
          background: MARIO.green, border: `3px solid ${MARIO.black}`,
        }}>
          <div style={{
            position: "absolute", top: -26, left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Pixel Game', sans-serif", fontSize: "0.8rem",
            color: MARIO.white, whiteSpace: "nowrap",
            textShadow: `2px 2px 0 ${MARIO.black}`,
            background: MARIO.green, padding: "2px 6px",
            border: `3px solid ${MARIO.black}`,
          }}>ANSWER</div>
        </div>
      )}

      {/* Guess marker (red) — only on guessing + reveal screens */}
      {showGuessMarker && (
        <div style={{
          position: "absolute",
          top: showAnswerMarker ? -14 : -6,
          left: `${guessPosition}%`,
          transform: "translateX(-50%)",
          width: showAnswerMarker ? 12 : 10,
          height: showAnswerMarker ? 58 : 44,
          background: MARIO.red, border: `3px solid ${MARIO.black}`,
        }}>
          {showAnswerMarker && (
            <div style={{
              position: "absolute", bottom: -26, left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "'Pixel Game', sans-serif", fontSize: "0.8rem",
              color: MARIO.white, whiteSpace: "nowrap",
              textShadow: `2px 2px 0 ${MARIO.black}`,
              background: MARIO.red, padding: "2px 6px",
              border: `3px solid ${MARIO.black}`,
            }}>GUESS</div>
          )}
        </div>
      )}
    </div>
  </div>
);

export default function Wavelength() {
  const { players, updatePoints } = useSession();

  const [phase, setPhase] = useState<Phase>("setup");
  const [theme, setTheme] = useState("");
  const [spectrums, setSpectrums] = useState<Spectrum[]>([]);
  const [currentSpectrum, setCurrentSpectrum] = useState<Spectrum | null>(null);
  const [hiddenPosition, setHiddenPosition] = useState(50);
  const [guessPosition, setGuessPosition] = useState(50);
  const [clue, setClue] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [error, setError] = useState("");
  const [leftEnd, setLeftEnd] = useState("");
  const [rightEnd, setRightEnd] = useState("");
  const [clueGiver, setClueGiver] = useState<string | null>(null);
  const [guesser, setGuesser] = useState<string | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  const pickPlayers = () => {
    if (players.length >= 2) {
      const shuffled = [...players].sort(() => Math.random() - 0.5);
      setClueGiver(shuffled[0].name);
      setGuesser(shuffled[1].name);
    } else if (players.length === 1) {
      setClueGiver(players[0].name);
      setGuesser(null);
    } else {
      setClueGiver(null);
      setGuesser(null);
    }
  };

  const startRound = (spectrum: Spectrum) => {
    setCurrentSpectrum(spectrum);
    setHiddenPosition(Math.floor(Math.random() * 81) + 10);
    setShowHidden(false);
    setClue("");
    setGuessPosition(50);
    setPointsAwarded(false);
    pickPlayers();
    setPhase("cluegiver");
  };

  const handleAIGenerate = async () => {
    if (!theme.trim()) return;
    setPhase("loading");
    setError("");
    try {
      const generated = await generateSpectrums(theme.trim());
      setSpectrums(generated);
      startRound(generated[Math.floor(Math.random() * generated.length)]);
    } catch {
      setError("FAILED TO GENERATE. CHECK CONNECTION!");
      setPhase("ai_input");
    }
  };

  const handleManualStart = () => {
    if (!leftEnd.trim() || !rightEnd.trim()) return;
    const spectrum = { left: leftEnd.trim(), right: rightEnd.trim() };
    setSpectrums([spectrum]);
    startRound(spectrum);
  };

  const handleNextRound = () => {
    startRound(spectrums[Math.floor(Math.random() * spectrums.length)]);
  };

  const handleReveal = () => {
    setPhase("reveal");
    // Auto-award points
    const diff = Math.abs(hiddenPosition - guessPosition);
    const pts = diff <= 5 ? 2 : diff <= 15 ? 1 : 0;
    if (pts > 0 && !pointsAwarded) {
      if (clueGiver) updatePoints(clueGiver, pts);
      if (guesser) updatePoints(guesser, pts);
      setPointsAwarded(true);
    }
  };

  const scoreDiff = Math.abs(hiddenPosition - guessPosition);
  const scoreResult = scoreDiff <= 5 ? "EXACT! +2 PTS 🎯" : scoreDiff <= 15 ? "CLOSE! +1 PT 🔥" : "MISS! 0 PTS 😬";
  const scoreColor = scoreDiff <= 5 ? MARIO.green : scoreDiff <= 15 ? MARIO.yellow : MARIO.red;

  // ── SETUP ──────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div style={wrap}>
        <RainbowText text="WAVELENGTH" fontSize="3rem" outlineSize={4} />
        <p style={{ fontFamily: "'Pixel Game', sans-serif", color: MARIO.yellow, fontSize: "1.3rem", textAlign: "center", textShadow: `3px 3px 0 ${MARIO.black}`, margin: 0, lineHeight: 1.5, letterSpacing: "0.04em" }}>
          ONE PLAYER GIVES A CLUE. EVERYONE GUESSES WHERE IT LANDS!
        </p>
        <div style={{ display: "flex", gap: "1rem", width: "100%", flexWrap: "wrap" }}>
          <button
            onClick={() => setPhase("ai_input")}
            style={{ ...pixelBtn(MARIO.blue, MARIO.white), flex: 1 }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >🤖 AI GENERATE</button>
          <button
            onClick={() => setPhase("manual_input")}
            style={{ ...pixelBtn(MARIO.green, MARIO.white), flex: 1 }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >✏️ MANUAL</button>
        </div>
      </div>
    );
  }

  // ── AI INPUT ───────────────────────────────────────────────────────────────
  if (phase === "ai_input") {
    return (
      <div style={wrap}>
        <RainbowText text="AI GENERATE" fontSize="2.5rem" outlineSize={4} />

        {error && (
          <div style={{ ...pixelBox(MARIO.red), width: "100%" }}>
            <span style={{ fontFamily: "'Pixel Game', sans-serif", color: MARIO.white, fontSize: "1.1rem", textShadow: `3px 3px 0 ${MARIO.black}` }}>{error}</span>
          </div>
        )}

        <div style={{ ...pixelBox(MARIO.blue), width: "100%" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "stretch" }}>
            <input
              value={theme}
              onChange={e => setTheme(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAIGenerate()}
              placeholder="Enter a theme..."
              style={{ ...pxInput, flex: 1 }}
            />
            <button
              onClick={handleAIGenerate}
              disabled={!theme.trim()}
              style={{ ...pixelBtn(MARIO.yellow, MARIO.white, !theme.trim()), whiteSpace: "nowrap" }}
              onMouseEnter={e => { if (theme.trim()) e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >GO!</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "center" }}>
          {["Basketball", "Movies", "Food", "Music", "History"].map(t => (
            <button key={t} onClick={() => setTheme(t)} style={{ ...pixelBtn(MARIO.green, MARIO.white), fontSize: "1rem", padding: "0.5rem 1rem" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >{t}</button>
          ))}
        </div>

        <button onClick={() => setPhase("setup")} style={{ ...pixelBtn(MARIO.yellow, MARIO.white), alignSelf: "flex-start" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        >◀ BACK</button>
      </div>
    );
  }

  // ── MANUAL INPUT ───────────────────────────────────────────────────────────
  if (phase === "manual_input") {
    return (
      <div style={wrap}>
        <RainbowText text="MANUAL INPUT" fontSize="2.5rem" outlineSize={4} />
        <p style={{ fontFamily: "'Pixel Game', sans-serif", color: MARIO.yellow, fontSize: "1.2rem", textAlign: "center", textShadow: `3px 3px 0 ${MARIO.black}`, margin: 0, letterSpacing: "0.04em" }}>
          DECIDE YOUR SPECTRUM TOGETHER!
        </p>

        <div style={{ ...pixelBox(MARIO.red), width: "100%" }}>
          <span style={pxLabel(MARIO.white)}>LEFT END:</span>
          <input value={leftEnd} onChange={e => setLeftEnd(e.target.value)} placeholder="E.g. Sharpshooter" style={pxInput} />
        </div>

        <div style={{ ...pixelBox(MARIO.blue), width: "100%" }}>
          <span style={pxLabel(MARIO.white)}>RIGHT END:</span>
          <input value={rightEnd} onChange={e => setRightEnd(e.target.value)} placeholder="E.g. Brick" style={pxInput} />
        </div>

        <button
          onClick={handleManualStart}
          disabled={!leftEnd.trim() || !rightEnd.trim()}
          style={{ ...pixelBtn(MARIO.green, MARIO.white, !leftEnd.trim() || !rightEnd.trim()), width: "100%" }}
          onMouseEnter={e => { if (leftEnd.trim() && rightEnd.trim()) e.currentTarget.style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        >▶ START!</button>

        <button onClick={() => setPhase("setup")} style={{ ...pixelBtn(MARIO.yellow, MARIO.white), alignSelf: "flex-start" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        >◀ BACK</button>
      </div>
    );
  }

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div style={{ ...wrap, justifyContent: "center", minHeight: 300 }}>
        <span style={{ fontSize: "5rem" }}>🌊</span>
        <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.6rem", color: MARIO.yellow, textShadow: `3px 3px 0 ${MARIO.black}`, textAlign: "center", margin: 0, letterSpacing: "0.05em" }}>
          GENERATING SPECTRUMS...
        </p>
      </div>
    );
  }

  // ── CLUE GIVER ─────────────────────────────────────────────────────────────
  if (phase === "cluegiver" && currentSpectrum) {
    return (
      <div style={wrap}>
        {/* Player assignment */}
        {(clueGiver || guesser) && (
          <div style={{ display: "flex", gap: "0.75rem", width: "100%", flexWrap: "wrap" }}>
            {clueGiver && (
              <div style={{ ...pixelBox(MARIO.red), flex: 1, textAlign: "center" }}>
                <span style={pxLabel(MARIO.white)}>CLUE GIVER</span>
                <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.4rem", color: MARIO.yellow, textShadow: `3px 3px 0 ${MARIO.black}` }}>{clueGiver.toUpperCase()}</span>
              </div>
            )}
            {guesser && (
              <div style={{ ...pixelBox(MARIO.blue), flex: 1, textAlign: "center" }}>
                <span style={pxLabel(MARIO.white)}>GUESSER</span>
                <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.4rem", color: MARIO.yellow, textShadow: `3px 3px 0 ${MARIO.black}` }}>{guesser.toUpperCase()}</span>
              </div>
            )}
          </div>
        )}

        <p style={{ fontFamily: "'Pixel Game', sans-serif", color: MARIO.yellow, fontSize: "1.2rem", margin: 0, textShadow: `3px 3px 0 ${MARIO.black}`, textAlign: "center", letterSpacing: "0.04em" }}>
          🔒 CLUE GIVER ONLY — OTHERS LOOK AWAY!
        </p>

        {/* Spectrum bar — no markers yet */}
        <SpectrumBar
          spectrum={currentSpectrum}
          hiddenPosition={hiddenPosition}
          guessPosition={guessPosition}
          showHiddenMarker={showHidden}
          showGuessMarker={false}
          showAnswerMarker={false}
        />

        {!showHidden ? (
          <button
            onClick={() => setShowHidden(true)}
            style={{ ...pixelBtn(MARIO.yellow, MARIO.white), width: "100%", textAlign: "center" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >👁 REVEAL MY POSITION</button>
        ) : (
          <div style={{ ...pixelBox(MARIO.green), width: "100%", textAlign: "center" }}>
            <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.3rem", color: MARIO.white, margin: 0, textShadow: `3px 3px 0 ${MARIO.black}`, letterSpacing: "0.04em" }}>
              YOUR SPOT: <span style={{ fontSize: "2rem", color: MARIO.yellow }}>{hiddenPosition}%</span> FROM LEFT
            </p>
          </div>
        )}

        <div style={{ ...pixelBox(MARIO.blue), width: "100%" }}>
          <span style={pxLabel(MARIO.white)}>NAME SOMETHING THAT REPRESENTS YOUR SPOT:</span>
          <input
            value={clue}
            onChange={e => setClue(e.target.value)}
            placeholder="E.g. a player, movie, food..."
            style={pxInput}
          />
        </div>

        <button
          onClick={() => { if (clue.trim()) setPhase("guessing"); }}
          disabled={!clue.trim()}
          style={{ ...pixelBtn(MARIO.red, MARIO.white, !clue.trim()), width: "100%" }}
          onMouseEnter={e => { if (clue.trim()) e.currentTarget.style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        >▶ PASS TO GUESSERS</button>
      </div>
    );
  }

  // ── GUESSING ───────────────────────────────────────────────────────────────
  if (phase === "guessing" && currentSpectrum) {
    return (
      <div style={wrap}>
        <div style={{ ...pixelBox(MARIO.yellow), width: "100%", textAlign: "center" }}>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", color: MARIO.black, fontSize: "1.1rem", display: "block", marginBottom: "0.4rem", letterSpacing: "0.04em" }}>THE CLUE IS:</span>
          <span style={{ fontFamily: "'PixelPurl', sans-serif", fontSize: "3rem", color: MARIO.black }}>{clue}</span>
        </div>

        {/* Spectrum bar — show guess marker, no answer */}
        <SpectrumBar
          spectrum={currentSpectrum}
          hiddenPosition={hiddenPosition}
          guessPosition={guessPosition}
          showHiddenMarker={false}
          showGuessMarker={true}
          showAnswerMarker={false}
        />

        <input
          type="range" min={0} max={100}
          value={guessPosition}
          onChange={e => setGuessPosition(Number(e.target.value))}
          style={{ width: "100%", accentColor: MARIO.blue, cursor: "pointer", height: 14 }}
        />

        <div style={{ ...pixelBox(MARIO.blue), width: "100%", textAlign: "center" }}>
          <span style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.5rem", color: MARIO.white, textShadow: `3px 3px 0 ${MARIO.black}`, letterSpacing: "0.04em" }}>
            YOUR GUESS: <span style={{ color: MARIO.yellow }}>{guessPosition}%</span>
          </span>
        </div>

        <button
          onClick={handleReveal}
          style={{ ...pixelBtn(MARIO.red, MARIO.white), width: "100%" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        >🎯 REVEAL!</button>
      </div>
    );
  }

  // ── REVEAL ─────────────────────────────────────────────────────────────────
  if (phase === "reveal" && currentSpectrum) {
    const pts = scoreDiff <= 5 ? 2 : scoreDiff <= 15 ? 1 : 0;
    return (
      <div style={wrap}>
        <RainbowText text="RESULT!" fontSize="3rem" outlineSize={4} />

        <div style={{ ...pixelBox(scoreColor), width: "100%", textAlign: "center" }}>
          <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.7rem", color: MARIO.white, margin: 0, textShadow: `4px 4px 0 ${MARIO.black}`, letterSpacing: "0.04em" }}>
            {scoreResult}
          </p>
          <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1.1rem", color: MARIO.white, margin: "0.5rem 0 0", textShadow: `3px 3px 0 ${MARIO.black}`, letterSpacing: "0.04em" }}>
            DIFFERENCE: {scoreDiff}%
          </p>
          {pts > 0 && (clueGiver || guesser) && (
            <p style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: MARIO.yellow, margin: "0.4rem 0 0", textShadow: `2px 2px 0 ${MARIO.black}`, letterSpacing: "0.04em" }}>
              +{pts} PTS ADDED TO {[clueGiver, guesser].filter(Boolean).join(" & ").toUpperCase()}
            </p>
          )}
        </div>

        {/* Spectrum bar — show both markers */}
        <SpectrumBar
          spectrum={currentSpectrum}
          hiddenPosition={hiddenPosition}
          guessPosition={guessPosition}
          showHiddenMarker={false}
          showGuessMarker={true}
          showAnswerMarker={true}
        />

        <div style={{ display: "flex", justifyContent: "space-around", width: "100%", gap: "1rem" }}>
          <div style={{ ...pixelBox(MARIO.green), flex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: MARIO.white, textShadow: `3px 3px 0 ${MARIO.black}`, letterSpacing: "0.04em" }}>ANSWER</div>
            <div style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "2rem", color: MARIO.yellow, textShadow: `3px 3px 0 ${MARIO.black}` }}>{hiddenPosition}%</div>
            <div style={{ fontFamily: "'PixelPurl', sans-serif", fontSize: "1rem", color: MARIO.white }}>"{clue}"</div>
          </div>
          <div style={{ ...pixelBox(MARIO.red), flex: 1, textAlign: "center" }}>
            <div style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "1rem", color: MARIO.white, textShadow: `3px 3px 0 ${MARIO.black}`, letterSpacing: "0.04em" }}>GUESS</div>
            <div style={{ fontFamily: "'Pixel Game', sans-serif", fontSize: "2rem", color: MARIO.yellow, textShadow: `3px 3px 0 ${MARIO.black}` }}>{guessPosition}%</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
          <button
            onClick={handleNextRound}
            style={{ ...pixelBtn(MARIO.green, MARIO.white), flex: 1 }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >▶ NEXT ROUND</button>
          <button
            onClick={() => { setPhase("setup"); setTheme(""); setSpectrums([]); setLeftEnd(""); setRightEnd(""); }}
            style={{ ...pixelBtn(MARIO.yellow, MARIO.white), flex: 1 }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          >↺ NEW GAME</button>
        </div>
      </div>
    );
  }

  return null;
}
