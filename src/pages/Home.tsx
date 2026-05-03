import { Container, Stack, Text, Title, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const NEON = {
  cyan: "#00d4ff",
  pink: "#ff2d9b",
  purple: "#7b2fff",
};

function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      background: "linear-gradient(135deg, #08080f 0%, #12082a 50%, #08080f 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem 1rem", position: "relative", overflow: "hidden",
    }}>
      {[
        { color: NEON.cyan,   top: "10%",  left: "5%",   size: 340 },
        { color: NEON.pink,   top: "60%",  right: "5%",  size: 280 },
        { color: NEON.purple, top: "35%",  left: "50%",  size: 200 },
      ].map((orb, i) => (
        <div key={i} style={{
          position: "absolute", top: orb.top, left: (orb as any).left, right: (orb as any).right,
          width: orb.size, height: orb.size, borderRadius: "50%",
          background: `radial-gradient(circle, ${orb.color}18 0%, transparent 70%)`,
          pointerEvents: "none", filter: "blur(2px)",
        }} />
      ))}

      <Container size="md" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Stack align="center" spacing="xl">
          <Group spacing="lg" position="center">
            {["🎲", "🏆", "🎯", "🧠", "🎮"].map((e, i) => (
              <span key={i} style={{
                fontSize: "2.2rem", display: "inline-block",
                filter: "drop-shadow(0 0 8px rgba(0,212,255,0.6))",
                animation: `float ${1.6 + i * 0.25}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.15}s`,
              }}>{e}</span>
            ))}
          </Group>

          <Stack align="center" spacing={4}>
            <Title order={1} align="center" style={{
              fontFamily: "'Slackey', cursive",
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              lineHeight: 1.0, color: "#ffffff",
              textShadow: `0 0 20px ${NEON.cyan}, 0 0 60px ${NEON.cyan}55`,
              letterSpacing: "0.02em",
            }}>
              GAME NIGHT
            </Title>
            <Title order={2} align="center" style={{
              fontFamily: "'Slackey', cursive",
              fontSize: "clamp(1.2rem, 3vw, 2rem)",
              color: NEON.pink,
              textShadow: `0 0 14px ${NEON.pink}99`,
              letterSpacing: "0.12em", fontWeight: 400,
            }}>
              ORGANIZER
            </Title>
          </Stack>

          <Text align="center" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", maxWidth: 380,
          }}>
            Track scores, play minigames, crown the champion. 🏅
          </Text>

          <Group spacing="lg" position="center" mt="sm">
            {[
              { label: "🎮 Create Game", color: NEON.cyan, path: "/join" },
              { label: "🏆 Leaderboard", color: NEON.pink, path: "/leaderboard" },
            ].map(({ label, color, path }) => (
              <button key={path} onClick={() => navigate(path)} style={{
                minWidth: 200, padding: "0.9rem 2rem", borderRadius: "2rem",
                border: `2px solid ${color}`, background: `${color}18`,
                color, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: "1rem", letterSpacing: "0.06em", textTransform: "uppercase",
                cursor: "pointer", boxShadow: `0 0 18px ${color}44`,
                textShadow: `0 0 8px ${color}`, transition: "all 0.2s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${color}28`;
                  e.currentTarget.style.boxShadow = `0 0 32px ${color}88`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = `${color}18`;
                  e.currentTarget.style.boxShadow = `0 0 18px ${color}44`;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >{label}</button>
            ))}
          </Group>
        </Stack>
      </Container>
      <style>{`@keyframes float { from { transform:translateY(0) rotate(-4deg); } to { transform:translateY(-12px) rotate(4deg); } }`}</style>
    </div>
  );
}
export default HomePage;
