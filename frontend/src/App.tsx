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
    useScrollTrigger,
    useTheme,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { BrowserRouter } from "react-router-dom";
import { Link } from "./components";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import { useThemeToggle } from "./Theming";
import { UserInfo } from "./components/UserInfo";
import { Footer, FOOTER_HEIGHT } from "./components/Footer";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { MainRouting } from "./Routing";

const Main = styled("main")(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    minHeight: `calc(100vh - ${FOOTER_HEIGHT})`,
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

const ToolbarTitle = styled("div")(() => ({
    padding: "1.25rem 0",
    display: "flex",
    flexDirection: "row",
}));

export function App() {
    return (
        <BrowserRouter>
            <CssBaseline />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Header />
                <Main>
                    <Toolbar />
                    <React.Suspense fallback={<PageLoading />}>
                        <MainRouting />
                    </React.Suspense>
                </Main>
                <footer>
                    <Footer />
                </footer>
            </Box>
        </BrowserRouter>
    );
}

function Header() {
    const showThemeToggle = process.env.NODE_ENV === "development";
    const toggleTheme = useThemeToggle();
    const theme = useTheme();

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 25,
    });

    return (
        <AppBar
            position="fixed"
            elevation={trigger ? 12 : 0}
            sx={{ bgcolor: theme.palette.background.default }}
        >
            <Toolbar>
                <ErrorBoundary>
                    <ToolbarRootLink to="/">
                        <img
                            alt="RaidSIMP Icon"
                            src="/eye_logo.png"
                            style={{
                                objectFit: "contain",
                                maxHeight: 64,
                            }}
                        />
                        <ToolbarTitle>
                            <Typography variant="h5" color="textPrimary">
                                Raid
                            </Typography>
                            <Typography variant="h5" color="secondary">
                                SIMP
                            </Typography>
                        </ToolbarTitle>
                    </ToolbarRootLink>

                    <Stack direction={"row"} alignItems={"center"} spacing={3}>
                        {showThemeToggle && (
                            <IconButton onClick={toggleTheme} color="inherit" title="Toggle theme">
                                <InvertColorsIcon />
                            </IconButton>
                        )}
                        <React.Suspense fallback={<></>}>
                            <UserInfo />
                        </React.Suspense>
                    </Stack>
                </ErrorBoundary>
            </Toolbar>
        </AppBar>
    );
}

const PageLoading = React.memo(function PageLoading() {
    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 4 }}>
            <CircularProgress size="24rem" />
        </Box>
    );
});
