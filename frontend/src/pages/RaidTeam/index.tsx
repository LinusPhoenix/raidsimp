import React from "react";
import { Box, Button, Container, Divider } from "@material-ui/core";
import { PageLoadingError } from "../../components";
import { RaidTeamsApi, RaidersApi, RaidTeam, RaiderOverviewDto } from "../../server";
import { usePromise, serverRequest } from "../../utility";
import { AddRaiderDialog } from "./AddRaiderDialog";
import { RemoveRaiderDialog } from "./RemoveRaiderDialog";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { RenameTeamInput } from "./RenameTeamInput";
import { RaidersTable, Raider } from "./RaidersTable";

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
    | Readonly<{ variant: "none" }>
    | Readonly<{ variant: "addRaider" }>
    | Readonly<{ variant: "removeRaider"; readonly raider: Raider }>
    | Readonly<{ variant: "deleteTeam" }>;

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
    const [raiders, setRaiders] = React.useState<readonly Raider[]>(() =>
        team.raiders.map((x) => ({ ...x, overview: null })),
    );

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
                });
            }).then((data) => {
                if (!data.isOk) {
                    console.error(data);
                } else {
                    addRaider(idx, data.body);
                }
            });
        }
    }, [setRaiders, team.id, team.raiders]);

    return (
        <>
            <Container maxWidth="xl">
                <RenameTeamInput reload={reload} team={team} />
                <Box marginY={2} />
                <RaidersTable
                    team={team}
                    raiders={raiders}
                    removeRaiderDialog={removeRaiderDialog}
                />
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
