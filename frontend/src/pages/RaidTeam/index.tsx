import React from "react";
import { Typography, Box, Button, Container, Divider, Link as MuiLink } from "@material-ui/core";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { Link, DataGridContainer, PageLoadingError } from "../../components";
import * as Routes from "../routes";
import { RaidTeamsApi, RaidTeam, Raider } from "../../server";
import { usePromise, serverRequest } from "../../utility";
import { AddRaiderDialog } from "./AddRaiderDialog";
import { RemoveRaiderDialog } from "./RemoveRaiderDialog";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { RenameTeamInput } from "./RenameTeamInput";

function createRaidersColumns(team: RaidTeam, removeRaider: (r: Raider) => void): GridColDef[] {
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
        {
            field: "_",
            width: 110,
            sortable: false,
            renderCell({ row }) {
                return (
                    <Button onClick={() => removeRaider(row as Raider)} variant="outlined">
                        Remove
                    </Button>
                );
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Actions</Typography>;
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

type DialogStatus =
    | { variant: "none" }
    | { variant: "addRaider" }
    | { variant: "removeRaider"; readonly raider: Raider }
    | { variant: "deleteTeam" };

const DEFAULT_DIALOG_STATUS: DialogStatus = { variant: "none" };

interface RaidTeamPageLoadedProps {
    readonly team: RaidTeam;
    readonly reload: () => void;
}

function RaidTeamPageLoaded({ team, reload }: RaidTeamPageLoadedProps) {
    const [dialogStatus, setDialogStatus] = React.useState<DialogStatus>(DEFAULT_DIALOG_STATUS);
    const openCreateDialog = React.useCallback(() => {
        setDialogStatus({ variant: "addRaider" });
    }, [setDialogStatus]);
    const openDeleteTeamDialog = React.useCallback(() => {
        setDialogStatus({ variant: "deleteTeam" });
    }, [setDialogStatus]);
    const closeDialog = React.useCallback(() => {
        setDialogStatus(DEFAULT_DIALOG_STATUS);
    }, [setDialogStatus]);
    const removeRaiderDialog = React.useCallback(
        (raider: Raider) => {
            setDialogStatus({ variant: "removeRaider", raider });
        },
        [setDialogStatus],
    );
    const columns = React.useMemo(
        () => createRaidersColumns(team, removeRaiderDialog),
        [team, removeRaiderDialog],
    );

    return (
        <>
            <Container maxWidth="lg">
                <RenameTeamInput reload={reload} team={team} />
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
                <Divider sx={{ my: 2 }} />
                <Button variant="contained" color="danger" onClick={openDeleteTeamDialog}>
                    Delete team
                </Button>
            </Container>
            <AddRaiderDialog
                isOpen={dialogStatus.variant === "addRaider"}
                handleClose={closeDialog}
                reload={reload}
                team={team}
            />
            <RemoveRaiderDialog
                handleClose={closeDialog}
                reload={reload}
                team={team}
                raider={dialogStatus.variant === "removeRaider" ? dialogStatus.raider : null}
            />
            <DeleteTeamDialog
                handleClose={closeDialog}
                team={team}
                isOpen={dialogStatus.variant === "deleteTeam"}
            />
        </>
    );
}
