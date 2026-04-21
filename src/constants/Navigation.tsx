<<<<<<< Updated upstream
import JoinPage from "../pages/Join";
import PointManagerPage from "../pages/PointManager";
=======
import HomePage from "../pages/Home";
import JoinPage from "../pages/Join";
import GamePage from "../pages/Game";
>>>>>>> Stashed changes
import LeaderboardPage from "../pages/Leaderboard";

export const PATHS: {
    link: string;
    label: string;
    element?: JSX.Element;
}[] = [
    {
        link: "/",
        label: "Join",
        element: <JoinPage />,
    },
    {
<<<<<<< Updated upstream
        link: "/session",
        label: "Session",
        element: <PointManagerPage />,
    },
    {
=======
        link: "/join",
        label: "Join",
        element: <JoinPage />,
    },
    {
        link: "/game",
        label: "Game",
        element: <GamePage />,
    },
    {
>>>>>>> Stashed changes
        link: "/leaderboard",
        label: "Leaderboard",
        element: <LeaderboardPage />,
    },
];
