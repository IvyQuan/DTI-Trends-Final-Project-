import JoinPage from "../pages/Join";
import PointManagerPage from "../pages/PointManager";
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
        link: "/session",
        label: "Session",
        element: <PointManagerPage />,
    },
    {
        link: "/leaderboard",
        label: "Leaderboard",
        element: <LeaderboardPage />,
    },
];
