import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import Wavelength from "../components/games/Wavelength";
import TwoTruthsOneLie from "../components/games/TwoTruthsOneLie";
import Trivia from "../components/games/Trivia";
import Pictionary from "../components/games/Pictionary";

type MinigameKey = "wavelength" | "twotruthsonelie" | "trivia" | "pictionary";

const COLORS = {
  red: "#e52521",
  yellow: "#fbd000",
  blue: "#049cd8",
  green: "#43b047",
  black: "#000000",
  cream: "#fff8e7",
};

const LETTER_COLORS = [COLORS.red, COLORS.yellow, COLORS.blue, COLORS.green];

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
            textShadow: ch === " " ? "none" : surroundOutline(COLORS.black, outlineSize),
            fontSize: ch === " " ? spaceSize : fontSize,
            transform: ch === " " ? "none" : `translateY(${i % 2 === 0 ? -2 : 2}px)`,
            padding: "0 0.05em",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
};

const MINIGAMES: {
  key: MinigameKey;
  name: string;
  description: string;
  icon: string;
  color: string;
}[] = [
  {
    key: "wavelength",
    name: "WAVELENGTH",
    description: "+2 EXACT, +1 ADJACENT",
    icon: "≈",
    color: COLORS.blue,
  },
  {
    key: "twotruthsonelie",
    name: "2 TRUTHS 1 LIE",
    description: "FOOL OTHERS, EARN PTS",
    icon: "?",
    color: COLORS.yellow,
  },
  {
    key: "trivia",
    name: "TRIVIA",
    description: "CORRECT = +1, INCORRECT = -1",
    icon: "!",
    color: COLORS.red,
  },
];

const MINIGAME_COMPONENTS: Record<MinigameKey, JSX.Element> = {
  wavelength: <Wavelength />,
  twotruthsonelie: <TwoTruthsOneLie />,
  trivia: <Trivia />,
  pictionary: <Pictionary />,
};

const pixelButton = (bg: string, fg: string): React.CSSProperties => ({
  background: bg,
  color: fg,
  border: `4px solid ${COLORS.black}`,
  padding: "0.7rem 1.4rem",
  fontFamily: "'Pixel Game', sans-serif",
  fontSize: "1.1rem",
  letterSpacing: "0.05em",
  cursor: "pointer",
  boxShadow: `0 5px 0 ${COLORS.black}`,
  textTransform: "uppercase",
  textShadow: `2px 2px 0 ${COLORS.black}`,
  transition: "transform 0.1s",
});

export default function GamePage() {
  const { players, updatePoints, clearSession } = useSession();
  const [activeGame, setActiveGame] = useState<MinigameKey | null>(null);
  const navigate = useNavigate();

  if (players.length === 0) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          background: COLORS.cream,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          padding: "2rem",
          fontFamily: "'PixelPurl', sans-serif",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Oxygene', sans-serif",
            margin: 0,
            lineHeight: 1.2,
            paddingTop: "2rem",
            paddingBottom: "2rem",
          }}
        >
          <RainbowText text="NO PARTY!" fontSize="5rem" outlineSize={5} />
        </h2>
        <p
          style={{
            fontFamily: "'PixelPurl', sans-serif",
            fontSize: "2rem",
            color: COLORS.black,
            margin: 0,
          }}
        >
          ASSEMBLE YOUR PLAYERS FIRST
        </p>
        <button
          onClick={() => navigate("/join")}
          style={pixelButton(COLORS.red, COLORS.cream)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          ▶ NEW GAME
        </button>
      </div>
    );
  }

  const handleEndGame = async () => {
    try {
      const [lbRes, gameRes] = await Promise.all([
        fetch("/api/leaderboard/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ players }),
        }),
        fetch("/api/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ players }),
        }),
      ]);
      if (!lbRes.ok || !gameRes.ok) throw new Error();
    } catch {
      alert("FAILED TO SAVE. IS THE SERVER RUNNING?");
      return;
    }
    clearSession();
    navigate("/leaderboard");
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        background: COLORS.cream,
        fontFamily: "'PixelPurl', sans-serif",
      }}
    >
      {/* Scoreboard bar */}
      <div
        style={{
          background: COLORS.blue,
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
          borderBottom: `5px solid ${COLORS.black}`,
        }}
      >
        {players.map((p, i) => {
          const c = LETTER_COLORS[i % LETTER_COLORS.length];
          return (
            <div
              key={p.name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
                padding: "0.6rem 0.85rem",
                background: c,
                minWidth: 100,
                border: `4px solid ${COLORS.black}`,
                boxShadow: `0 4px 0 ${COLORS.black}`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Pixel Game', sans-serif",
                  fontSize: "0.95rem",
                  color: COLORS.cream,
                  letterSpacing: "0.05em",
                  textShadow: `2px 2px 0 ${COLORS.black}`,
                }}
              >
                {p.name.toUpperCase()}
              </span>
              <span
                style={{
                  fontFamily: "'Oxygene', sans-serif",
                  fontSize: "2rem",
                  color: p.points < 0 ? COLORS.black : COLORS.cream,
                  lineHeight: 1,
                  textShadow: p.points < 0 ? `3px 3px 0 ${COLORS.cream}` : `3px 3px 0 ${COLORS.black}`,
                }}
              >
                {p.points}
              </span>
              <div style={{ display: "flex", gap: "0.3rem" }}>
                <button
                  onClick={() => updatePoints(p.name, -1)}
                  style={{
                    width: 28,
                    height: 28,
                    background: COLORS.cream,
                    color: COLORS.black,
                    border: `3px solid ${COLORS.black}`,
                    fontFamily: "'Pixel Game', sans-serif",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    padding: 0,
                    fontWeight: "bold",
                  }}
                >
                  −
                </button>
                <button
                  onClick={() => updatePoints(p.name, 1)}
                  style={{
                    width: 28,
                    height: 28,
                    background: COLORS.cream,
                    color: COLORS.black,
                    border: `3px solid ${COLORS.black}`,
                    fontFamily: "'Pixel Game', sans-serif",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    padding: 0,
                    fontWeight: "bold",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}

        <button
          onClick={handleEndGame}
          style={{
            ...pixelButton(COLORS.red, COLORS.cream),
            marginLeft: "auto",
          }}
        >
          END GAME
        </button>
      </div>

      {/* Minigame area */}
      <div style={{ padding: "2rem 1.5rem" }}>
        {activeGame ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <button
              onClick={() => setActiveGame(null)}
              style={{
                ...pixelButton( COLORS.yellow, COLORS.cream),
                alignSelf: "flex-start",
              }}
            >
              ◀ BACK
            </button>
            {MINIGAME_COMPONENTS[activeGame]}
          </div>
        ) : (
          <div>
            <h2
              style={{
                fontFamily: "'Oxygene', sans-serif",
                margin: "0 0 2rem",
                lineHeight: 1.2,
                paddingTop: "1rem",
                paddingBottom: "1rem",
                textAlign: "center",
              }}
            >
              <RainbowText text="PICK A GAME" fontSize="3.5rem" outlineSize={4} />
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1.5rem",
                maxWidth: 900,
                margin: "0 auto",
              }}
            >
              {MINIGAMES.map((game) => (
                <button
                  key={game.key}
                  onClick={() => setActiveGame(game.key)}
                  style={{
                    padding: "1.5rem 1rem",
                    background: game.color,
                    border: `5px solid ${COLORS.black}`,
                    cursor: "pointer",
                    textAlign: "center",
                    fontFamily: "'PixelPurl', sans-serif",
                    boxShadow: `0 8px 0 ${COLORS.black}`,
                    transition: "transform 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Pixel Game', sans-serif",
                      fontSize: "3.5rem",
                      color: COLORS.cream,
                      lineHeight: 1,
                      marginBottom: "0.5rem",
                      textShadow: `3px 3px 0 ${COLORS.black}`,
                    }}
                  >
                    {game.icon}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Pixel Game', sans-serif",
                      fontSize: "1.1rem",
                      color: COLORS.cream,
                      letterSpacing: "0.05em",
                      marginBottom: "0.5rem",
                      textShadow: `2px 2px 0 ${COLORS.black}`,
                    }}
                  >
                    {game.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'PixelPurl', sans-serif",
                      fontSize: "1.1rem",
                      color: COLORS.cream,
                      letterSpacing: "0.03em",
                      textShadow: `1px 1px 0 ${COLORS.black}`,
                    }}
                  >
                    {game.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
