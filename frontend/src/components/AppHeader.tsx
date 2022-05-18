import React from "react";
import { Toolbar as MuiToolbar, AppBar, Typography, Stack } from "@material-ui/core";
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

export interface AppHeaderProps {
    readonly rightComponent: React.ReactNode;
}

export function AppHeaderSpace() {
    return <Toolbar />;
}

export function AppHeader(props: AppHeaderProps) {
    return (
        <AppBar position="fixed">
            <Toolbar>
                <Stack direction="row" alignItems="center" spacing={3}>
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
                    <Link to="/raid-teams">Teams</Link>
                </Stack>

                <ErrorBoundary>{props.rightComponent}</ErrorBoundary>
            </Toolbar>
        </AppBar>
    );
}
