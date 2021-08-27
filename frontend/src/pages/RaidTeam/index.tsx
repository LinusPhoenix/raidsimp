import React from "react";
import { Box, Button, Container, Divider, Grid, Paper, Stack, Typography } from "@material-ui/core";
import { PageLoadingError } from "../../components";
import { RaidTeamsApi, RaidersApi, RaidTeam, RaiderOverviewDto } from "../../server";
import { usePromise, serverRequest } from "../../utility";
import { AddRaiderDialog } from "./AddRaiderDialog";
import { RemoveRaiderDialog } from "./RemoveRaiderDialog";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { RenameTeamInput } from "./RenameTeamInput";
import { RaidersTable, Raider } from "./RaidersTable";
import { Helmet } from "react-helmet";
import { Doughnut } from "react-chartjs-2";
import { ImageHelper } from "../../utility/image-helper";
import { ColorHelper } from "../../utility/color-helper";

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

    function getDoughnutChartData(raiders: Readonly<Raider[]>): number[] {
        const plateCount = raiders.filter((raider) =>
            ["Warrior", "Paladin", "Death Knight"].includes(raider.overview?._class || ""),
        ).length;
        const mailCount = raiders.filter((raider) =>
            ["Hunter", "Shaman"].includes(raider.overview?._class || ""),
        ).length;
        const leatherCount = raiders.filter((raider) =>
            ["Rogue", "Druid", "Monk", "Demon Hunter"].includes(raider.overview?._class || ""),
        ).length;
        const clothCount = raiders.filter((raider) =>
            ["Mage", "Priest", "Warlock"].includes(raider.overview?._class || ""),
        ).length;
        return [plateCount, mailCount, leatherCount, clothCount];
    }
    const doughnutData = {
        labels: ["Plate", "Mail", "Leather", "Cloth"],
        datasets: [
            {
                label: "No. of Characters",
                data: getDoughnutChartData(raiders),
                backgroundColor: ["rgba(198, 155, 109, 1)", "#0070DD", "#FF7C0A", "#FFFFFF"],
                borderWidth: 0,
                borderColor: "Black",
            },
        ],
    };

    return (
        <>
            <Helmet>
                <title>
                    {team.name} ({team.region.toUpperCase()})
                </title>
            </Helmet>
            <Container maxWidth="xl">
                <Box width="100%" display="flex" flexDirection="row" justifyContent="space-between">
                    <RenameTeamInput reload={reload} team={team} />
                    <Button variant="contained" color="primary" onClick={openCreateDialog}>
                        Add raider
                    </Button>
                </Box>
                <Box marginY={2} />
                <RaidersTable
                    team={team}
                    raiders={raiders}
                    removeRaiderDialog={removeRaiderDialog}
                />
                <Box marginY={2} />
                {/* TODO: This should be its own component. Extract it.*/}
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Paper style={{ padding: 10 }}>
                            <Typography
                                variant="h6"
                                align="center"
                                color={(t) => t.palette.text.primary}
                            >
                                Armor Types by No. of Characters
                            </Typography>
                            <div style={{ height: "40vh" }}>
                                <Doughnut
                                    data={doughnutData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                    }}
                                />
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container spacing={3} justifyContent="space-evenly">
                            <Grid item xs={12}>
                                <Paper style={{ padding: 10 }}>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        justifyContent="space-evenly"
                                    >
                                        {ImageHelper.classes.map((_class) => {
                                            return (
                                                <Stack maxWidth={50}>
                                                    <img
                                                        width={"100%"}
                                                        alt={_class + " Icon"}
                                                        src={ImageHelper.getClassIconPath(_class)}
                                                    />
                                                    <Typography
                                                        variant="subtitle1"
                                                        align="center"
                                                        fontWeight="fontWeightBold"
                                                        color={ColorHelper.getClassColor(_class)}
                                                    >
                                                        {
                                                            raiders.filter(
                                                                (raider) =>
                                                                    raider.overview?._class ===
                                                                    _class,
                                                            ).length
                                                        }
                                                    </Typography>
                                                </Stack>
                                            );
                                        })}
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item>
                                <Paper style={{ padding: 10 }}>Stat 2</Paper>
                            </Grid>
                            <Grid item>
                                <Paper style={{ padding: 10 }}>Stat 3</Paper>
                            </Grid>
                            <Grid item>
                                <Paper style={{ padding: 10 }}>Stat 4</Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
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
