import React from "react";
import { Box, Button, Container, Stack, Typography } from "@material-ui/core";
import { PageLoadingError } from "../../components";
import { RaidTeamsApi, RaidersApi, RaidTeam, RaiderOverviewDto } from "../../server";
import { usePromise, serverRequest } from "../../utility";
import { AddRaiderDialog } from "./AddRaiderDialog";
import { RemoveRaiderDialog } from "./RemoveRaiderDialog";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { RenameTeamInput } from "./RenameTeamInput";
import { RaidersTable, Raider } from "./RaidersTable";
import { Helmet } from "react-helmet";
import { TeamStatistics } from "./TeamStatistics";
import { Refresh, Add, Delete } from "@material-ui/icons";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import { UserRoleHelper } from "../../utility/user-role-helper";
import { ManageCollaborators } from "./ManageCollaborators";
import { NotFoundPage } from "../NotFound";

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

export default function RaidTeamPage({ teamId }: RaidTeamPageProps) {
    const { data, reload } = useData(teamId);

    if (!data.isOk) {
        if (data.status === 404) {
            return <NotFoundPage />;
        } else {
            return <PageLoadingError error={data} reload={reload} />;
        }
    }

    const team: RaidTeam = data.body;

    return <RaidTeamPageLoaded team={team} reload={reload} />;
}

type DialogStatus =
    | Readonly<{ variant: "none" }>
    | Readonly<{ variant: "addRaider" }>
    | Readonly<{ variant: "removeRaider"; readonly raider: Raider }>
    | Readonly<{ variant: "deleteTeam" }>
    | Readonly<{ variant: "refreshData" }>;

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
    const refreshDataDialog = React.useCallback(() => {
        setDialogStatus({ variant: "refreshData" });
    }, [setDialogStatus]);
    const [raiders, setRaiders] = React.useState<readonly Raider[]>(() =>
        team.raiders.map((x) => ({ ...x, overview: null })),
    );
    const [caching, setCaching] = React.useState<number>(0);

    const refreshData = React.useCallback(() => setCaching(caching + 1), [setCaching, caching]);

    React.useEffect(() => {
        setRaiders(() => team.raiders.map((x) => ({ ...x, overview: null })));

        function addRaider(idx: number, overview: RaiderOverviewDto) {
            setRaiders((rs) => {
                const next = rs.slice();
                next.splice(idx, 1, { ...rs[idx], overview });
                return next;
            });
        }

        for (const [raider, idx] of team.raiders.map((x, i) => [x, i] as const)) {
            serverRequest(async (cfg) => {
                const client = new RaidersApi(cfg);
                return client.raidersControllerGetOverview({
                    raidTeamId: team.id,
                    raiderId: raider.id,
                    caching: caching === 0 ? "true" : "false",
                });
            }).then((data) => {
                if (!data.isOk) {
                    console.error(data);
                } else {
                    addRaider(idx, data.body);
                }
            });
        }
    }, [setRaiders, team.id, team.raiders, caching]);

    const hasRaiders = team.raiders.length > 0;

    return (
        <>
            <Helmet>
                <title>
                    {team.name} ({team.region.toUpperCase()}) - RaidSIMP
                </title>
            </Helmet>
            <Container maxWidth="xl">
                <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between">
                    <RenameTeamInput reload={reload} team={team} />
                    <Stack direction="row" spacing={1}>
                        {hasRaiders && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={refreshDataDialog}
                                title="Refresh team data"
                            >
                                <Refresh />
                            </Button>
                        )}
                        {UserRoleHelper.isOwner(team.userRole) && (
                            <ManageCollaborators team={team} />
                        )}

                        {hasRaiders && UserRoleHelper.canEdit(team.userRole) && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={openCreateDialog}
                                title="Add a raider"
                            >
                                <Add />
                                &nbsp;raider
                            </Button>
                        )}
                    </Stack>
                </Box>

                {hasRaiders ? (
                    <NonEmptyTeamBody
                        removeRaiderDialog={removeRaiderDialog}
                        team={team}
                        raiders={raiders}
                    />
                ) : (
                    <EmptyTeamBody team={team} openCreateDialog={openCreateDialog} />
                )}

                {UserRoleHelper.isOwner(team.userRole) && (
                    <>
                        <Box marginY={5} />
                        <Button
                            variant="outlined"
                            color="danger"
                            size="medium"
                            onClick={openDeleteTeamDialog}
                            title="Delete the team"
                        >
                            <Delete />
                            &nbsp;team
                        </Button>
                    </>
                )}
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
            <ConfirmationDialog
                title="Manually refresh raider data?"
                body="The character data is never older than 12 hours. Please don't manually refresh
                the data unless you know it has changed since then."
                okButtonText="Refresh"
                performAction={refreshData}
                handleClose={closeDialog}
                isOpen={dialogStatus.variant === "refreshData"}
            />
        </>
    );
}

interface EmptyTeamBodyProps {
    openCreateDialog(): void;
    team: RaidTeam;
}

function EmptyTeamBody({ team, openCreateDialog }: EmptyTeamBodyProps) {
    if (!UserRoleHelper.canEdit(team.userRole)) {
        return (
            <Stack alignItems="center" marginY={10} spacing={10}>
                <Typography variant="h4">
                    This raid team does not have any characters yet.
                </Typography>
            </Stack>
        );
    }

    return (
        <Stack alignItems="center" marginY={10} spacing={10}>
            <Typography variant="h4">
                Get started by adding characters to your raid team.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={openCreateDialog}
                size="large"
                title="Add a raider"
            >
                <Add />
                &nbsp;raider
            </Button>
        </Stack>
    );
}

interface NonEmptyTeamBodyProps {
    removeRaiderDialog(x: Raider): void;
    team: RaidTeam;
    raiders: readonly Raider[];
}

function NonEmptyTeamBody({ removeRaiderDialog, team, raiders }: NonEmptyTeamBodyProps) {
    return (
        <>
            <Box marginY={2} />
            <TeamStatistics raiders={raiders} />
            <Box marginY={2} />
            <Typography variant="h5">Raiders</Typography>
            <Box marginY={2} />
            <RaidersTable team={team} raiders={raiders} removeRaiderDialog={removeRaiderDialog} />
        </>
    );
}
