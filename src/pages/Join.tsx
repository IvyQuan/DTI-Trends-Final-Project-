import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import {
  Button,
  Container,
  Stack,
  Text,
  Title,
  Group,
  TextInput,
  Paper,
} from "@mantine/core";

export default function JoinPage() {
  const { players, addPlayer, removePlayer } = useSession();
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdd = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setError("Enter a name.");
      return;
    }
    const success = addPlayer(trimmed);
    if (!success) {
      setError("Player already added.");
    } else {
      setNameInput("");
      setError("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <Container
      size="sm"
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
              fontSize: "3.5rem",
              letterSpacing: "-0.01em",
              lineHeight: 1.05,
              color: "#1e3a8a",
            }}
          >
            Create A Session
          </Title>
          <Text
            size="lg"
            color="dimmed"
            align="center"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Add players, then confirm to start!
          </Text>
        </Stack>

        <Paper
          shadow="sm"
          radius="lg"
          p="xl"
          withBorder
          style={{ width: "100%" }}
        >
          <Stack spacing="md">
            <Group spacing="sm" align="flex-end" noWrap>
              <TextInput
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.currentTarget.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Player name"
                size="md"
                radius="xl"
                style={{ flex: 1 }}
              />
              <Button
                onClick={handleAdd}
                size="md"
                radius="xl"
                style={{
                  backgroundColor: "#1e3a8a",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                }}
              >
                Add
              </Button>
            </Group>

            {error && (
              <Text color="red" size="sm">
                {error}
              </Text>
            )}

            {players.length > 0 && (
              <Stack spacing="xs">
                <Text
                  weight={600}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "#1e3a8a",
                  }}
                >
                  Players ({players.length})
                </Text>
                <Stack spacing={4}>
                  {players.map((p) => (
                    <Text
                      key={p.name}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      • {p.name}
                        <Button
                      onClick={() => removePlayer(p.name)}
                      size="xs"
                      radius="xl"
                      variant="outline"
                      color="red"
                      ml="sm"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}
                    >
                      Remove
                    </Button>
                    </Text>
                  ))}
                </Stack>
              </Stack>
            )}
          </Stack>
        </Paper>

        <Button
          onClick={() => navigate("/game")}
          disabled={players.length === 0}
          size="xl"
          radius="xl"
          style={{
            minWidth: 260,
            backgroundColor: "#1e3a8a",
            border: "none",
            boxShadow: "0 4px 14px rgba(30, 58, 138, 0.4)",
            fontWeight: 600,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Start Game Night →
        </Button>
      </Stack>
    </Container>
  );
}