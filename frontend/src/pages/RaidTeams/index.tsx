import React from "react";
import { Button, Typography, Box, Container } from "@material-ui/core";
import { DataGrid, GridColDef, GridCellParams } from "@material-ui/data-grid";
import { PageLoadingError, Link } from "../../components";
import * as Routes from "../routes";
import { serverRequest, usePromise } from "../../utility";
import { RaidTeamsApi, RaidTeam } from "../../server";
import { CreateTeamDialog } from "./CreateTeamDialog";

const RAIDERS_COLUMNS: GridColDef[] = [
    // We shouldn't have to specify renderCell and renderHeader normally,
    // but data-grid 4.0.0-alpha.34 doesn't use the correct text color
    // by default.
    {
        field: "region",
        width: 140,
        renderCell({ row }) {
            return (
                <Typography color={(t) => t.palette.text.primary}>
                    {(row as RaidTeam).region.toUpperCase()}
                </Typography>
            );
        },
        renderHeader() {
            return <Typography color={(t) => t.palette.text.primary}>Region</Typography>;
        },
    },
    {
        field: "name",
        width: 400,
        renderCell(param: GridCellParams) {
            const team: RaidTeam = param.row as RaidTeam;
            const url = Routes.raidTeam(team.id);
            return (
                <Link to={url}>
                    <Typography>{team.name}</Typography>
                </Link>
            );
        },
        renderHeader() {
            return <Typography color={(t) => t.palette.text.primary}>Name</Typography>;
        },
    },
    {
        field: "raidersCount",
        width: 180,
        renderCell(param: GridCellParams) {
            const team: RaidTeam = param.row as RaidTeam;
            return (
                <Typography color={(t) => t.palette.text.primary}>{team.raiders.length}</Typography>
            );
        },
        renderHeader() {
            return <Typography color={(t) => t.palette.text.primary}>No. of raiders</Typography>;
        },
    },
    {
        field: "createdAt",
        width: 200,
        renderCell({ row }) {
            return (
                <Typography color={(t) => t.palette.text.primary}>
                    {(row as RaidTeam).createdAt.toDateString()}
                </Typography>
            );
        },
        renderHeader() {
            return <Typography color={(t) => t.palette.text.primary}>Created</Typography>;
        },
    },
];

const GRID_ROW_COUNT = 10;

type DialogOpen = "none" | "create";

function useData() {
    return usePromise(
        "RaidTeams_get",
        () => {
            return serverRequest((cfg) => {
                const client = new RaidTeamsApi(cfg);
                return client.raidTeamsControllerGetAll();
            });
        },
        [],
    );
}

export function RaidTeamsPage() {
    const [dialogOpen, setDialogOpen] = React.useState<DialogOpen>("none");
    const openCreateDialog = React.useCallback(() => {
        setDialogOpen("create");
    }, [setDialogOpen]);
    const closeDialog = React.useCallback(() => {
        setDialogOpen("none");
    }, [setDialogOpen]);

    const { data, reload } = useData();
    if (!data.isOk) {
        return <PageLoadingError error={data} reload={reload} />;
    }
    const raidTeams: RaidTeam[] = data.body;

    return (
        <>
            <Container maxWidth="xl">
                <Typography variant="h6">Raid teams</Typography>
                <Box marginY={2} />
                <DataGrid
                    autoHeight={true}
                    columns={RAIDERS_COLUMNS}
                    rows={raidTeams}
                    pageSize={10}
                    isRowSelectable={() => false}
                />
                <Box marginY={2} />
                <Button variant="contained" color="primary" onClick={openCreateDialog}>
                    New team
                </Button>
            </Container>
            <CreateTeamDialog
                isOpen={dialogOpen === "create"}
                handleClose={closeDialog}
                reload={reload}
            />
        </>
    );
}
