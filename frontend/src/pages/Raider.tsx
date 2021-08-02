import React from "react";
import { Typography, Container } from "@material-ui/core";

export interface RaiderPageProps {
    readonly teamId: string;
    readonly raiderId: string;
}

export function RaiderPage(props: RaiderPageProps) {
    return (
        <Container maxWidth="lg">
            <Typography variant="h6">TODO ({props.raiderId})</Typography>
        </Container>
    );
}
