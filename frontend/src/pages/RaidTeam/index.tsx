import React from "react";
import { Typography, Box, Button, Container, Link as MuiLink } from "@material-ui/core";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { Link } from "../../components/Link";
import * as Routes from "../routes";
import { DataGridContainer } from "../../components/DataGridContainer";
import { PageLoadingError } from "../../components/PageLoadingError";
import { RaidTeamsApi, RaidTeam, Raider } from "../../server";
import { usePromise, serverRequest } from "../../utility";
import { AddRaiderDialog } from "./AddRaiderDialog";

function createRaidersColumns(team: RaidTeam): GridColDef[] {
    return [
        // We shouldn't have to specify renderCell and renderHeader normally,
        // but data-grid 4.0.0-alpha.34 doesn't use the correct text color
        // by default.
        {
            field: "realm",
            width: 120,
            renderCell({ row }) {
                return (
                    <Typography color={(t) => t.palette.text.primary}>
                        {(row as Raider).realm}
                    </Typography>
                );
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Realm</Typography>;
            },
        },
        {
            field: "characterName",
            width: 200,
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                const url = Routes.raider(team.id, raider.id);
                return <Link to={url}>{raider.characterName}</Link>;
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Name</Typography>;
            },
        },
        {
            field: "role",
            width: 110,
            renderCell({ row }) {
                return (
                    <Typography color={(t) => t.palette.text.primary}>
                        {(row as Raider).role}
                    </Typography>
                );
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Role</Typography>;
            },
        },
        {
            field: "",
            width: 110,
            sortable: false,
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                const url = Routes.armoryUrl({
                    name: raider.characterName,
                    realm: raider.realm,
                    region: team.region,
                });
                return (
                    <MuiLink href={url} target="_blank">
                        Link
                    </MuiLink>
                );
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Armory</Typography>;
            },
        },
    ];
}

const GRID_ROW_COUNT = 12;

function useData(teamId: string) {
    return usePromise(
        "RaidTeam_get " + teamId,
        () => {
            return serverRequest((cfg) =>
                new RaidTeamsApi(cfg).raidTeamsControllerGetOne({
                    id: teamId,
                }),
            );
        },
        [teamId],
    );
}

export interface RaidTeamPageProps {
    readonly teamId: string;
}

export function RaidTeamPage({ teamId }: RaidTeamPageProps) {
    const { data, reload } = useData(teamId);

    if (!data.isOk) {
        return <PageLoadingError error={data} reload={reload} />;
    }

    const team: RaidTeam = data.body;

    return <RaidTeamPageLoaded team={team} reload={reload} />;
}

type Dialog = "none" | "create";

interface RaidTeamPageLoadedProps {
    readonly team: RaidTeam;
    readonly reload: () => void;
}

function RaidTeamPageLoaded({ team, reload }: RaidTeamPageLoadedProps) {
    const columns = React.useMemo(() => createRaidersColumns(team), [team]);
    const [dialogOpen, setDialogOpen] = React.useState<Dialog>("none");
    const openCreateDialog = React.useCallback(() => {
        setDialogOpen("create");
    }, [setDialogOpen]);
    const closeDialog = React.useCallback(() => {
        setDialogOpen("none");
    }, [setDialogOpen]);

    return (
        <>
            <Container maxWidth="lg">
                <Typography variant="h6">
                    {team.region} - {team.name}
                </Typography>
                <Box marginY={2} />
                <DataGridContainer rowCount={GRID_ROW_COUNT}>
                    <DataGrid
                        columns={columns}
                        rows={team.raiders}
                        pageSize={GRID_ROW_COUNT}
                        isRowSelectable={() => false}
                    />
                </DataGridContainer>
                <Box marginY={2} />
                <Button variant="contained" color="primary" onClick={openCreateDialog}>
                    Add raider
                </Button>
            </Container>
            <AddRaiderDialog
                isOpen={dialogOpen === "create"}
                handleClose={closeDialog}
                reload={reload}
                team={team}
            />
        </>
    );
}
