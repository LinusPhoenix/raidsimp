import React from "react";
import { CssBaseline, Box, Toolbar, AppBar, IconButton, CircularProgress } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { NotFoundPage } from "./pages/NotFound";
import { RaidTeamPage } from "./pages/RaidTeam";
import { RaidTeamsPage } from "./pages/RaidTeams";
import { RaiderPage } from "./pages/Raider";
import { Link } from "./components";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import { useThemeToggle } from "./Theming";
import { LogInPage } from "./pages/LogIn";
import { SignUpPage } from "./pages/SignUp";

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
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    gap: 20,
                                }}
                            >
                                <Link to="/">
                                    <img
                                        alt="WoW Raid Manager Icon"
                                        src="/eye_logo.png"
                                        style={{
                                            objectFit: "contain",
                                            maxHeight: 64,
                                        }}
                                    />
                                </Link>
                                <Link to="/" variant="h6" color="inherit">
                                    WoW Raid Manager
                                </Link>
                            </div>

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
                            <Route path="/login">
                                <LogInPage />
                            </Route>
                            <Route path="/sign-up">
                                <SignUpPage />
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

const PageLoading = React.memo(function PageLoading() {
    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 4 }}>
            <CircularProgress size="24rem" />
        </Box>
    );
});
