import { Typography, Container, Breadcrumbs } from "@mui/material";
import { Link } from "../components";
import { Helmet } from "react-helmet";
import { UnderConstruction } from "../components/UnderConstruction";

export interface RaiderPageProps {
    readonly teamId: string;
    readonly raiderId: string;
}

export default function RaiderPage(props: RaiderPageProps) {
    // TODO: Get the data for this
    const teamName = "Team Name";
    const characterName = "Character Name";
    const realmName = "Realm";

    return (
        <>
            <Helmet>
                <title>TODO - RaidSIMP</title>
            </Helmet>
            <Container maxWidth="xl">
                <Breadcrumbs>
                    <Link to="/raid-teams" color="inherit">
                        <Typography variant="h5">Raid Teams</Typography>
                    </Link>
                    <Link to={`/raid-teams/${props.teamId}`} color="inherit">
                        <Typography variant="h5">{teamName}</Typography>
                    </Link>
                    <Typography variant="h5">
                        {characterName} ({realmName})
                    </Typography>
                </Breadcrumbs>
                <UnderConstruction />
            </Container>
        </>
    );
}
