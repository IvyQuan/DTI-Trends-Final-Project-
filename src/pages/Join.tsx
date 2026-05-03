import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { Stack, Text, Title, Group } from "@mantine/core";

const NEON = { cyan: "#00d4ff", pink: "#ff2d9b", purple: "#7b2fff", green: "#00ff88", orange: "#ffaa00" };
const PLAYER_COLORS = [NEON.cyan, NEON.pink, NEON.purple, NEON.green, NEON.orange];

export default function JoinPage() {
  const { players, addPlayer, removePlayer } = useSession();
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdd = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) { setError("Enter a name."); return; }
    const success = addPlayer(trimmed);
    if (!success) { setError("Player already added."); }
    else { setNameInput(""); setError(""); }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem 1rem", position: "relative", overflow: "hidden",
    }}>
      {/* bg orbs */}
      <div style={{ position:"absolute", top:"-60px", left:"-60px", width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle, ${NEON.cyan}14 0%, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-60px", right:"-60px", width:260, height:260, borderRadius:"50%", background:`radial-gradient(circle, ${NEON.pink}14 0%, transparent 70%)`, pointerEvents:"none" }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        <Stack align="center" spacing="xl">

          <Stack align="center" spacing="xs">
            <span style={{ fontSize: "3rem", filter: `drop-shadow(0 0 10px ${NEON.cyan})` }}>🎲</span>
            <Title order={1} align="center" style={{
              fontFamily: "'Slackey', cursive",
              fontSize: "clamp(2rem, 5vw, 2.8rem)",
              color: "#fff",
              textShadow: `0 0 18px ${NEON.cyan}, 0 0 40px ${NEON.cyan}44`,
              lineHeight: 1.05,
            }}>
              Create A Session
            </Title>
            <Text align="center" style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "rgba(255,255,255,0.4)", fontSize: "0.95rem",
            }}>
              Add players, then let the games begin!
            </Text>
          </Stack>

          {/* Card */}
          <div style={{
            width: "100%",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(12px)",
            borderRadius: "1.25rem",
            padding: "1.75rem",
            border: `1px solid ${NEON.cyan}30`,
            boxShadow: `0 0 32px ${NEON.cyan}18`,
          }}>
            <Stack spacing="md">
              <Group spacing="sm" align="center" noWrap>
                <input
                  value={nameInput}
                  onChange={e => { setNameInput(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleAdd()}
                  placeholder="Player name"
                  style={{
                    flex: 1, padding: "0.65rem 1rem", borderRadius: "2rem",
                    border: `2px solid ${NEON.cyan}40`,
                    background: "rgba(0,212,255,0.06)",
                    color: "#fff", fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "1rem", outline: "none", boxShadow: "none",
                  }}
                />
                <button
                  onClick={handleAdd}
                  style={{
                    padding: "0.6rem 1.4rem", borderRadius: "2rem",
                    border: `2px solid ${NEON.cyan}`,
                    background: `${NEON.cyan}18`, color: NEON.cyan,
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                    fontSize: "0.9rem", letterSpacing: "0.05em", cursor: "pointer",
                    boxShadow: `0 0 14px ${NEON.cyan}44`,
                    textShadow: `0 0 6px ${NEON.cyan}`, transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${NEON.cyan}28`; e.currentTarget.style.boxShadow = `0 0 24px ${NEON.cyan}88`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${NEON.cyan}18`; e.currentTarget.style.boxShadow = `0 0 14px ${NEON.cyan}44`; }}
                >
                  Add
                </button>
              </Group>

              {error && (
                <Text size="sm" style={{ color: NEON.pink, fontFamily: "'Space Grotesk', sans-serif", textShadow: `0 0 6px ${NEON.pink}` }}>
                  ⚠️ {error}
                </Text>
              )}

              {players.length > 0 && (
                <Stack spacing="sm">
                  <Text style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "rgba(255,255,255,0.3)", fontSize: "0.75rem",
                    textTransform: "uppercase", letterSpacing: "0.1em",
                  }}>
                    Players — {players.length}
                  </Text>
                  <Stack spacing="xs">
                    {players.map((p, i) => {
                      const c = PLAYER_COLORS[i % PLAYER_COLORS.length];
                      return (
                        <div key={p.name} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "0.55rem 0.9rem", borderRadius: "0.75rem",
                          background: `${c}0e`, border: `1.5px solid ${c}35`,
                        }}>
                          <Group spacing="sm">
                            <div style={{
                              width: 28, height: 28, borderRadius: "50%",
                              background: `${c}28`, border: `2px solid ${c}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: c, fontWeight: 700, fontSize: "0.75rem",
                              fontFamily: "'Space Grotesk', sans-serif",
                              boxShadow: `0 0 8px ${c}66`,
                            }}>
                              {p.name[0].toUpperCase()}
                            </div>
                            <Text weight={600} style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#fff" }}>
                              {p.name}
                            </Text>
                          </Group>
                          <button
                            onClick={() => removePlayer(p.name)}
                            style={{
                              background: "none", border: "none", color: "rgba(255,255,255,0.3)",
                              cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 700, fontSize: "1rem", padding: "0 0.4rem",
                              transition: "color 0.15s", boxShadow: "none",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = NEON.pink; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                          >✕</button>
                        </div>
                      );
                    })}
                  </Stack>
                </Stack>
              )}
            </Stack>
          </div>

          <button
            onClick={() => navigate("/game")}
            disabled={players.length === 0}
            style={{
              width: "100%", padding: "1rem", borderRadius: "2rem",
              border: `2px solid ${players.length === 0 ? "#333" : NEON.green}`,
              background: players.length === 0 ? "rgba(255,255,255,0.03)" : `${NEON.green}18`,
              color: players.length === 0 ? "#444" : NEON.green,
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              fontSize: "1.05rem", letterSpacing: "0.06em", textTransform: "uppercase",
              cursor: players.length === 0 ? "not-allowed" : "pointer",
              boxShadow: players.length === 0 ? "none" : `0 0 24px ${NEON.green}44`,
              textShadow: players.length === 0 ? "none" : `0 0 8px ${NEON.green}`,
              transition: "all 0.2s",
            }}
          >
            Start Game Night 🚀
          </button>
        </Stack>
      </div>
    </div>
  );
}
