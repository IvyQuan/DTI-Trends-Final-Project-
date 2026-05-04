import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const MARIO = {
  red: "#e52521",
  yellow: "#fbd000",
  blue: "#049cd8",
  green: "#43b047",
  black: "#000000",
  cream: "#fff8e7",
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

const RainbowText = ({
  text,
  fontSize,
  outlineSize = 5,
}: {
  text: string;
  fontSize: string;
  outlineSize?: number;
}) => {
  const fontSizeValue = parseFloat(fontSize);
  const fontSizeUnit = fontSize.replace(String(fontSizeValue), "");
  const spaceSize = `${fontSizeValue * 0.4}${fontSizeUnit}`;

  return (
    <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            color: ch === " " ? "transparent" : LETTER_COLORS[i % LETTER_COLORS.length],
            textShadow: ch === " " ? "none" : surroundOutline(MARIO.black, outlineSize),
            fontSize: ch === " " ? spaceSize : fontSize,
            transform: ch === " " ? "none" : `translateY(${i % 2 === 0 ? -3 : 3}px)`,
            padding: "0 0.05em",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
};

const pixelButtonStyle = (
  bg: string,
  fg: string,
  disabled = false
): React.CSSProperties => ({
  background: disabled ? "#cccccc" : bg,
  color: disabled ? "#888888" : fg,
  border: `4px solid ${MARIO.black}`,
  padding: "1rem 1.8rem",
  fontFamily: "'Pixel Game', sans-serif",
  fontSize: "1.4rem",
  letterSpacing: "0.08em",
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: `0 6px 0 ${MARIO.black}`,
  textTransform: "uppercase",
  transition: "transform 0.1s",
  textShadow: disabled ? "none" : `2px 2px 0 ${MARIO.black}`,
  opacity: disabled ? 0.6 : 1,
});

export default function JoinPage() {
  const { players, addPlayer, removePlayer } = useSession();
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdd = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setError("ENTER A NAME!");
      return;
    }
    const success = addPlayer(trimmed);
    if (!success) {
      setError("ALREADY ADDED!");
    } else {
      setNameInput("");
      setError("");
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        background: MARIO.cream,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
        fontFamily: "'PixelPurl', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 640,
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontFamily: "'Oxygene', sans-serif",
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "0.04em",
            paddingTop: "2rem",
            paddingBottom: "2rem",
          }}
        >
          <RainbowText text="NEW GAME" fontSize="6rem" outlineSize={5} />
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "'PixelPurl', sans-serif",
            fontSize: "2rem",
            color: MARIO.black,
            margin: "1rem 0 2.5rem",
            lineHeight: 1.2,
          }}
        >
          ADD PLAYERS, THEN HIT START!
        </p>

        {/* Form Panel */}
        <div
          style={{
            background: MARIO.yellow,
            border: `5px solid ${MARIO.black}`,
            padding: "2rem 1.5rem",
            boxShadow: `0 8px 0 ${MARIO.black}`,
            marginBottom: "2.5rem",
          }}
        >
          {/* Input row */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <input
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="PLAYER NAME"
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                fontFamily: "'PixelPurl', sans-serif",
                fontSize: "1.6rem",
                background: MARIO.cream,
                color: MARIO.black,
                border: `4px solid ${MARIO.black}`,
                outline: "none",
                letterSpacing: "0.05em",
                borderRadius: 0,
              }}
            />
            <button
              onClick={handleAdd}
              style={pixelButtonStyle(MARIO.green, MARIO.cream)}
            >
              ADD
            </button>
          </div>

          {error && (
            <p
              style={{
                fontFamily: "'PixelPurl', sans-serif",
                fontSize: "1.4rem",
                color: MARIO.red,
                background: MARIO.cream,
                padding: "0.5rem 0.75rem",
                margin: "0.75rem 0 0",
                border: `3px solid ${MARIO.black}`,
                letterSpacing: "0.05em",
              }}
            >
              ! {error}
            </p>
          )}

          {/* Player list */}
          {players.length > 0 && (
            <div
              style={{
                background: MARIO.cream,
                border: `4px solid ${MARIO.black}`,
                padding: "1rem 1.25rem",
                marginTop: "1rem",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontFamily: "'Pixel Game', sans-serif",
                  fontSize: "1.2rem",
                  color: MARIO.black,
                  margin: "0 0 0.75rem",
                  letterSpacing: "0.1em",
                  textShadow: `2px 2px 0 ${MARIO.yellow}`,
                }}
              >
                PLAYERS [{players.length}]
              </p>
              {players.map((p, i) => (
                <div
  key={p.name}
  style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    fontFamily: "'PixelPurl', sans-serif",
    fontSize: "1.5rem",
    color: LETTER_COLORS[i % LETTER_COLORS.length],
    padding: "0.25rem 0",
    letterSpacing: "0.05em",
    textShadow: `2px 2px 0 ${MARIO.black}`,
  }}
>
  <span>P{i + 1} ► {p.name.toUpperCase()}</span>
  <button
    onClick={() => removePlayer(p.name)}
    style={{
      background: MARIO.red, color: MARIO.cream,
      border: `3px solid ${MARIO.black}`,
      fontFamily: "'Pixel Game', sans-serif",
      fontSize: "0.9rem", padding: "0.2rem 0.6rem",
      cursor: "pointer", boxShadow: `0 3px 0 ${MARIO.black}`,
      textShadow: `1px 1px 0 ${MARIO.black}`,
    }}
  >✕</button>
</div>
              ))}
            </div>
          )}
        </div>

        {/* Start button */}
        <button
          onClick={() => navigate("/game")}
          disabled={players.length === 0}
          style={{
            ...pixelButtonStyle(MARIO.red, MARIO.cream, players.length === 0),
            fontSize: "1.8rem",
            padding: "1.2rem 2.5rem",
          }}
          onMouseEnter={(e) => {
            if (players.length > 0) {
              e.currentTarget.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          ▶ START GAME
        </button>
      </div>
    </div>
  );
}
