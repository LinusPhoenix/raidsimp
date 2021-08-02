import React from "react";
import { Button, Typography, Box, Container } from "@material-ui/core";
import { DataGrid, GridColDef, GridCellParams } from "@material-ui/data-grid";
import { Link } from "../../components/Link";
import * as Routes from "../routes";
import { DataGridContainer } from "../../components/DataGridContainer";
import { serverRequest, usePromise } from "../../utility";
import { RaidTeamsApi, RaidTeam } from "../../server";
import { PageLoadingError } from "../../components/PageLoadingError";
import { CreateTeamDialog } from "./CreateTeamDialog";

const RAIDERS_COLUMNS: GridColDef[] = [
    // We shouldn't have to specify renderCell and renderHeader normally,
    // but data-grid 4.0.0-alpha.34 doesn't use the correct text color
    // by default.
    {
        field: "region",
        width: 120,
        renderCell({ row }) {
            return (
                <Typography color={(t) => t.palette.text.primary}>
                    {(row as RaidTeam).region}
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
            return <Link to={url}>{team.name}</Link>;
        },
        renderHeader() {
            return <Typography color={(t) => t.palette.text.primary}>Name</Typography>;
        },
    },
    {
        field: "createdAt",
        width: 400,
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

type ModalOpen = "none" | "create";

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
    const [dialogOpen, setDialogOpen] = React.useState<ModalOpen>("none");
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
                <DataGridContainer rowCount={GRID_ROW_COUNT}>
                    <DataGrid
                        columns={RAIDERS_COLUMNS}
                        rows={raidTeams}
                        pageSize={GRID_ROW_COUNT}
                        isRowSelectable={() => false}
                    />
                </DataGridContainer>
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
