import { lazy } from "react";
import { useParams, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LogInPage } from "./pages/LogIn";
import { NotFoundPage } from "./pages/NotFound";
import { PrivacyPage } from "./pages/Privacy";

export function MainRouting() {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/" element={<LazyHomePage />} />
                <Route path="/raid-teams/:teamId/raiders/:raiderId" element={<RaiderPage />} />
                <Route path="/raid-teams/:teamId" element={<RaidTeamPage />} />
                <Route path="/raid-teams" element={<LazyRaidTeamsPage />} />
                <Route path="/login" element={<LogInPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ErrorBoundary>
    );
}

const LazyHomePage = lazy(() => import("./pages/Home"));
const LazyRaiderPage = lazy(() => import("./pages/Raider"));
const LazyRaidTeamsPage = lazy(() => import("./pages/RaidTeams"));
const LazyRaidTeamPage = lazy(() => import("./pages/RaidTeam"));

// The param names from the below components `useParams` hook should correspond to their names in the Route paths.

function RaiderPage(): JSX.Element {
    const { teamId, raiderId } = useParams();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return <LazyRaiderPage teamId={teamId!} raiderId={raiderId!} />;
}

function RaidTeamPage(): JSX.Element {
    const { teamId } = useParams();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return <LazyRaidTeamPage teamId={teamId!} />;
}
