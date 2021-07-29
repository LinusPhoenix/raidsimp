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

interface WithArmoryUrl {
    readonly region: string;
    readonly realm: string;
    readonly name: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function armoryUrl({ region, realm, name }: WithArmoryUrl) {
    return `https://worldofwarcraft.com/en-gb/character/${region}/${realm}/${name}`;
}
