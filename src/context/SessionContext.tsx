import { createContext, useContext, useState, ReactNode } from 'react';

export interface Player {
  name: string;
  points: number;
}

interface SessionContextType {
  players: Player[];
  addPlayer: (name: string) => boolean;
  updatePoints: (name: string, delta: number) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Player[]>([]);

  const addPlayer = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) return false;
<<<<<<< Updated upstream
=======
    if (players.length >= 5) return false;
>>>>>>> Stashed changes
    const isDuplicate = players.some(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) return false;
    setPlayers((prev) => [...prev, { name: trimmed, points: 0 }]);
    return true;
  };

  const updatePoints = (name: string, delta: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.name === name ? { ...p, points: p.points + delta } : p))
    );
  };

  const clearSession = () => setPlayers([]);

  return (
    <SessionContext.Provider value={{ players, addPlayer, updatePoints, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
