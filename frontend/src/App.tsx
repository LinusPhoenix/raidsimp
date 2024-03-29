import React from "react";
import { CssBaseline, Box, IconButton, CircularProgress, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import { useThemeToggle } from "./Theming";
import { UserInfo } from "./components/UserInfo";
import { Footer, FOOTER_HEIGHT_PX } from "./components/Footer";
import { AppHeader, APP_HEADER_MAX_HEIGHT } from "./components/AppHeader";
import { AppHeaderLinks } from "./components/AppHeaderLinks";
import { MainRouting } from "./Routing";

const Main = styled("main")(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(0),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    minHeight: `calc(100vh - ${FOOTER_HEIGHT_PX + APP_HEADER_MAX_HEIGHT}px)`,
    maxHeight: "100%",
    overflow: "auto",
}));

export function App() {
    const showThemeToggle = process.env.NODE_ENV === "development";
    const toggleTheme = useThemeToggle();

    return (
        <BrowserRouter>
            <CssBaseline />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <AppHeader
                    rightComponent={
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
                    }
                    links={<AppHeaderLinks />}
                />
                <Main>
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

const PageLoading = React.memo(function PageLoading() {
    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 4 }}>
            <CircularProgress size="24rem" />
        </Box>
    );
});
