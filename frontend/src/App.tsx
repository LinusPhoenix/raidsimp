import React from "react";
import {
    CssBaseline,
    Box,
    Toolbar as MuiToolbar,
    AppBar,
    IconButton,
    CircularProgress,
    Stack,
    Typography,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NotFoundPage } from "./pages/NotFound";
import { Link } from "./components";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import { useThemeToggle } from "./Theming";
import { LogInPage } from "./pages/LogIn";
import { UserInfo } from "./components/UserInfo";
import { Footer } from "./components/Footer";
import { PrivacyPage } from "./pages/Privacy";

const HomePage = React.lazy(() => import("./pages/Home"));
const RaiderPage = React.lazy(() => import("./pages/Raider"));
const RaidTeamsPage = React.lazy(() => import("./pages/RaidTeams"));
const RaidTeamPage = React.lazy(() => import("./pages/RaidTeam"));

const Main = styled("main")(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    minHeight: "100vh",
    maxHeight: "100%",
    overflow: "auto",
}));

const Toolbar = styled(MuiToolbar)(() => ({
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
}));

const ToolbarRootLink = styled(Link)(() => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 20,
}));

const ToolbarTitle = styled(Typography)(() => ({
    padding: "1.25rem 0",
}));

export function App() {
    const showThemeToggle = process.env.NODE_ENV === "development";
    const toggleTheme = useThemeToggle();

    return (
        <Router>
            <CssBaseline />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <AppBar position="fixed">
                    <Toolbar>
                        <ToolbarRootLink to="/">
                            <img
                                alt="RaidSIMP Icon"
                                src="/eye_logo.png"
                                style={{
                                    objectFit: "contain",
                                    maxHeight: 64,
                                }}
                            />
                            <ToolbarTitle variant="h5" color="textPrimary" gutterBottom={false}>
                                RaidSIMP
                            </ToolbarTitle>
                        </ToolbarRootLink>

                        <Stack direction={"row"} alignItems={"center"} spacing={3}>
                            {showThemeToggle && (
                                <IconButton
                                    onClick={toggleTheme}
                                    color="inherit"
                                    title="Toggle theme"
                                >
                                    <InvertColorsIcon />
                                </IconButton>
                            )}

                            <React.Suspense fallback={<></>}>
                                <UserInfo />
                            </React.Suspense>
                        </Stack>
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
                            <Route path="/privacy">
                                <PrivacyPage />
                            </Route>
                            <Route path="*">
                                <NotFoundPage />
                            </Route>
                        </Switch>
                    </React.Suspense>
                </Main>
                <Footer />
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
