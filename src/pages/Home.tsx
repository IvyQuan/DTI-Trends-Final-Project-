import { Button, Container, Stack, Text, Title, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <Container
      size="lg"
      style={{
        minHeight: "calc(100vh - 100px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack align="center" spacing="xl" style={{ width: "100%" }}>
        <Stack align="center" spacing="xs">
          <Title
            order={1}
            align="center"
            style={{
              fontFamily: "'Slackey', cursive",
              fontSize: "4.5rem",
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
              color: "#1e3a8a",
            }}
          >
            Group Game Night Organizer
          </Title>
          <Text
            size="xl"
            color="dimmed"
            align="center"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            A Platform for Group Game Night Glory and Fun!
          </Text>
        </Stack>

        <Group spacing="lg" position="center" mt="xl">
          <Button
            size="xl"
            radius="xl"
            onClick={() => navigate("/join")}
            style={{
              minWidth: 220,
              backgroundColor: "#1e3a8a",
              border: "none",
              boxShadow: "0 4px 14px rgba(30, 58, 138, 0.4)",
              fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Create Game
          </Button>
          <Button
            size="xl"
            radius="xl"
            variant="outline"
            onClick={() => navigate("/leaderboard")}
            style={{
              minWidth: 220,
              borderColor: "#1e3a8a",
              borderWidth: 2,
              color: "#1e3a8a",
              fontWeight: 600,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            View Past Sessions
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}

export default HomePage;
