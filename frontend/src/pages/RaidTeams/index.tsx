import React from "react";
import { Button, Typography, Box, Container, Tooltip } from "@mui/material";
import { DataGrid, GridColDef, GridCellParams } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import { PageLoadingError, Link } from "../../components";
import * as Routes from "../routes";
import { regionData, serverRequest, usePromise, userRole } from "../../utility";
import { RaidTeamsApi, RaidTeam } from "../../server";
import { CreateTeamDialog } from "./CreateTeamDialog";
import { Helmet } from "react-helmet";

const RAIDERS_COLUMNS: GridColDef[] = [
    {
        field: "region",
        width: 140,
        renderCell({ row }) {
            const region = (row as RaidTeam).region;
            const { name } = regionData(region);
            return (
                <Tooltip title={name} placement="right">
                    <img
                        alt={`${region} Flag`}
                        src={`/regions/${region}.svg`}
                        style={{
                            objectFit: "contain",
                            maxHeight: 40,
                        }}
                    />
                </Tooltip>
            );
        },
        renderHeader() {
            return <Typography>Region</Typography>;
        },
    },
    {
        field: "name",
        minWidth: 200,
        flex: 1,
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
            return <Typography>Name</Typography>;
        },
    },
    {
        field: "team.owner.battletag",
        minWidth: 200,
        flex: 1,
        renderCell(param: GridCellParams) {
            const team: RaidTeam = param.row as RaidTeam;
            const [name, id] = team.owner.battletag.split("#");
            return (
                <Tooltip
                    placement="right"
                    title={
                        <Box display="flex">
                            <Typography>{name}</Typography>
                            <Typography color="secondary">#{id}</Typography>
                        </Box>
                    }
                >
                    <Typography>{name}</Typography>
                </Tooltip>
            );
        },
        renderHeader() {
            return <Typography>Owner</Typography>;
        },
    },
    {
        field: "userRole",
        minWidth: 180,
        flex: 1,
        renderCell(param: GridCellParams) {
            const team: RaidTeam = param.row as RaidTeam;
            return <Typography>{userRole(team.userRole)}</Typography>;
        },
        renderHeader() {
            return <Typography>My role</Typography>;
        },
    },
    {
        field: "raidersCount",
        minWidth: 180,
        flex: 1,
        renderCell(param: GridCellParams) {
            const team: RaidTeam = param.row as RaidTeam;
            return <Typography>{team.raiders.length}</Typography>;
        },
        renderHeader() {
            return <Typography>No. of raiders</Typography>;
        },
    },
    {
        field: "createdAt",
        minWidth: 140,
        flex: 1,
        renderCell({ row }) {
            return <Typography>{(row as RaidTeam).createdAt.toDateString()}</Typography>;
        },
        renderHeader() {
            return <Typography>Created</Typography>;
        },
    },
];

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

export default function RaidTeamsPage() {
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
            <Helmet>
                <title>Your Raid Teams - RaidSIMP</title>
            </Helmet>
            <Container maxWidth="lg">
                <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between">
                    <Typography variant="h5">Raid teams</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={openCreateDialog}
                        title="Create a new raid team"
                    >
                        <Add /> team
                    </Button>
                </Box>
                <Box marginY={2} />
                <DataGrid
                    autoHeight={true}
                    columns={RAIDERS_COLUMNS}
                    rows={raidTeams}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    isRowSelectable={() => false}
                />
                <Box marginY={2} />
            </Container>
            <CreateTeamDialog
                isOpen={dialogOpen === "create"}
                handleClose={closeDialog}
                reload={reload}
            />
        </>
    );
}
