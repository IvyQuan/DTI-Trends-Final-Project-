import { useNavigate } from "react-router-dom";

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

const dropShadowTrail = (color: string, offset: number) =>
  `${offset}px ${offset}px 0 ${color}, ${offset * 2}px ${offset * 2}px 0 ${color}`;

const pixelButtonStyle = (bg: string, fg: string): React.CSSProperties => ({
  background: bg,
  color: fg,
  border: `4px solid ${MARIO.black}`,
  padding: "1.2rem 2.2rem",
  fontFamily: "'Pixel Game', sans-serif",
  fontSize: "1.6rem",
  letterSpacing: "0.08em",
  cursor: "pointer",
  boxShadow: `0 8px 0 ${MARIO.black}`,
  textTransform: "uppercase",
  minWidth: 240,
  transition: "transform 0.1s",
  textShadow: `2px 2px 0 ${MARIO.black}`,
});

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

function HomePage() {
  const navigate = useNavigate();

  const letters = [
    { ch: "A", color: MARIO.red, top: "12%", left: "8%", rotate: -8 },
    { ch: "B", color: MARIO.blue, top: "18%", right: "10%", rotate: 6 },
    { ch: "X", color: MARIO.yellow, top: "62%", left: "12%", rotate: 10 },
    { ch: "Y", color: MARIO.green, top: "70%", right: "14%", rotate: -6 },
    { ch: "★", color: MARIO.yellow, top: "40%", left: "5%", rotate: 0 },
    { ch: "♥", color: MARIO.red, top: "45%", right: "6%", rotate: 0 },
    { ch: "◆", color: MARIO.blue, top: "85%", left: "45%", rotate: 0 },
    { ch: "✦", color: MARIO.green, top: "8%", left: "48%", rotate: 0 },
  ];

  // triangle data url
  const trianglePattern = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><polygon points='40,15 60,55 20,55' fill='%23c9a878' opacity='0.5'/></svg>")`;

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        background: "#e8d5a8",
        backgroundImage: trianglePattern,
        backgroundRepeat: "repeat",
        backgroundSize: "80px 80px",
        animation: "drift 18s linear infinite",
        display: "flex",
        justifyContent: "center",
        padding: "4rem 1rem",
        fontFamily: "'VT323', monospace",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {letters.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: l.top,
            left: (l as any).left,
            right: (l as any).right,
            fontFamily: "'Pixel Game', sans-serif",
            fontSize: "3.2rem",
            color: l.color,
            transform: `rotate(${l.rotate}deg)`,
            textShadow: `${surroundOutline(MARIO.black, 3)}, ${dropShadowTrail(MARIO.black, 5)}`,
            pointerEvents: "none",
            userSelect: "none",
            animation: `floatDeco ${2 + (i % 3) * 0.4}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.2}s`,
            zIndex: 1,
          }}
        >
          {l.ch}
        </div>
      ))}

      <div
        style={{
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            fontFamily: "'Oxygene', sans-serif",
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "0.04em",
            animation: "floatTitle 2.4s ease-in-out infinite alternate",
            paddingTop: "3rem",
            paddingBottom: "3rem",
          }}
        >
          <RainbowText text="GAME NIGHT" fontSize="12rem" outlineSize={7} />
        </h1>

        <h2
          style={{
            fontFamily: "'Oxygene', sans-serif",
            margin: "1.5rem 0 2.5rem",
            letterSpacing: "0.12em",
            lineHeight: 1.0,
            animation: "floatTitle 2.8s ease-in-out infinite alternate",
            animationDelay: "0.3s",
            paddingTop: "1rem",
            paddingBottom: "1rem",
          }}
        >
          <RainbowText text="ORGANIZER" fontSize="3.5rem" outlineSize={4} />
        </h2>

        <p
          style={{
            fontFamily: "'PixelPurl', sans-serif",
            fontSize: "2.2rem",
            color: MARIO.black,
            margin: "0 0 2.5rem",
            lineHeight: 1.2,
            animation: "floatTitle 3.2s ease-in-out infinite alternate",
            animationDelay: "0.6s",
          }}
        >
          GATHER YOUR PARTY AND HAVE FUN!
        </p>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate("/join")}
            style={pixelButtonStyle(MARIO.red, MARIO.cream)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ▶ NEW GAME
          </button>
          <button
            onClick={() => navigate("/leaderboard")}
            style={pixelButtonStyle(MARIO.blue, MARIO.yellow)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ★ HIGH SCORES
          </button>
        </div>
      </div>

      <style>{`
        @keyframes floatTitle {
          from { transform: translateY(0); }
          to { transform: translateY(-12px); }
        }
        @keyframes floatDeco {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
        @keyframes drift {
          from { background-position: 0 0; }
          to { background-position: 90px 0; }
        }
      `}</style>
    </div>
  );
}

export default HomePage;
