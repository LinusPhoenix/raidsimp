import React from "react";
import {
    Toolbar as MuiToolbar,
    AppBar,
    Typography,
    Stack,
    useTheme,
    useScrollTrigger,
} from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import { Link } from "./Link";
import { ErrorBoundary } from "./ErrorBoundary";

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

export const APP_HEADER_MAX_HEIGHT = 72;

export interface AppHeaderProps {
    readonly rightComponent: React.ReactNode;
    readonly links: React.ReactNode;
}

export function AppHeaderSpace() {
    return <Toolbar />;
}

export function AppHeader(props: AppHeaderProps) {
    const theme = useTheme();

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 25,
    });

    return (
        <AppBar
            position="sticky"
            elevation={trigger ? 12 : 0}
            sx={{ bgcolor: theme.palette.background.default, maxHeight: APP_HEADER_MAX_HEIGHT }}
        >
            <Toolbar>
                <Stack direction="row" alignItems="center" spacing={3}>
                    <ToolbarRootLink to="/">
                        <img
                            alt="RaidSIMP Icon"
                            src="/eye_logo.png"
                            style={{
                                objectFit: "contain",
                                height: 64,
                                width: 54,
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
                    <ErrorBoundary>{props.links}</ErrorBoundary>
                </Stack>

                <ErrorBoundary>{props.rightComponent}</ErrorBoundary>
            </Toolbar>
        </AppBar>
    );
}
