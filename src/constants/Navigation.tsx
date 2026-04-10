import GamesPage from "../pages/Games";
import ScorePage from "../pages/Score";
import HomePage from "../pages/Home";

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
        link: "/games",
        label: "Games",
        element: <GamesPage />,
    },
    {
        link: "/score",
        label: "Score",
        element: <ScorePage />,
    },
];
