import HomePage from "../pages/Home";
import JoinPage from "../pages/Join";
import GamePage from "../pages/Game";
import LeaderboardPage from "../pages/Leaderboard";

export const PATHS: {
    link: string;
    label: string;
    element?: JSX.Element;
}[] = [
    {
        link: "/",
        label: "Home",
        element: <HomePage />,
    },
    {
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
        link: "/leaderboard",
        label: "Leaderboard",
        element: <LeaderboardPage />,
    },
];
