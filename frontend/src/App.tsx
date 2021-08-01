import React from "react";
import { CssBaseline, Box, Toolbar, AppBar, IconButton, CircularProgress } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { NotFoundPage } from "./pages/NotFound";
import { RaidTeamPage } from "./pages/RaidTeam";
import { RaidTeamsPage } from "./pages/RaidTeams";
import { RaiderPage } from "./pages/Raider";
import { Link } from "./components/Link";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import { useThemeToggle } from "./Theming";

const Main = styled("main")(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
}));

export function App() {
    const toggleTheme = useThemeToggle();
    return (
        <Router>
            <CssBaseline />
            <Box sx={{ display: "flex" }}>
                <AppBar position="fixed">
                    <Toolbar>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <Link to="/" variant="h6" color="inherit">
                                Wow Raid Manager
                            </Link>
                            <IconButton onClick={toggleTheme} color="inherit">
                                <InvertColorsIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                <Main>
                    <Toolbar />
                    <React.Suspense fallback={<PageLoading />}>
                        <Switch>
                            <Route exact path="/">
                                <HomePage />
                            </Route>
                            <Route
                                path="/raid-teams/:teamId/raiders/:raiderId"
                                render={({ match }) => (
                                    <RaiderPage
                                        teamId={match.params.teamId}
                                        raiderId={match.params.raiderId}
                                    />
                                )}
                            />
                            <Route
                                path="/raid-teams/:teamId"
                                render={({ match }) => (
                                    <RaidTeamPage teamId={match.params.teamId} />
                                )}
                            />
                            <Route path="/raid-teams">
                                <RaidTeamsPage />
                            </Route>
                            <Route path="*">
                                <NotFoundPage />
                            </Route>
                        </Switch>
                    </React.Suspense>
                </Main>
            </Box>
        </Router>
    );
}

function PageLoading() {
    return <CircularProgress />;
}
