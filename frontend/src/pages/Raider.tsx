import React from "react";
import { Typography, Container, Breadcrumbs } from "@material-ui/core";
import { Link } from "../components";

export interface RaiderPageProps {
    readonly teamId: string;
    readonly raiderId: string;
}

export function RaiderPage(props: RaiderPageProps) {
    const teamName = "TODO";
    const characterName = "TODO";
    const realmName = "TODO";
    return (
        <Container maxWidth="xl">
            <Breadcrumbs>
                <Link to="/raid-teams" color="inherit">
                    <Typography variant="h5">Raid Teams</Typography>
                </Link>
                <Link to={`raid-teams/${props.teamId}`} color="inherit">
                    <Typography variant="h5">{teamName}</Typography>
                </Link>
                <Typography variant="h5">
                    {characterName} ({realmName})
                </Typography>
            </Breadcrumbs>
        </Container>
    );
}
