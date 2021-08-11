import React from "react";
import {
    Typography,
    Box,
    Button,
    Container,
    Divider,
    Link as MuiLink,
    Stack,
    Avatar,
    IconButton,
} from "@material-ui/core";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import { Link, DataGridContainer, PageLoadingError } from "../../components";
import * as Routes from "../routes";
import {
    RaidTeamsApi,
    RaidersApi,
    RaidTeam,
    Raider as ServerRaider,
    RaiderOverviewDto,
    RaidLockout,
    RaidDifficultyLockout,
    RaidDifficultyLockoutDifficultyEnum,
} from "../../server";
import { usePromise, serverRequest } from "../../utility";
import { AddRaiderDialog } from "./AddRaiderDialog";
import { RemoveRaiderDialog } from "./RemoveRaiderDialog";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { RenameTeamInput } from "./RenameTeamInput";
import { Delete } from "@material-ui/icons";
import { ColorHelper } from "../../utility/color-helper";
import { ImageHelper } from "../../utility/image-helper";

interface Raider extends Readonly<ServerRaider> {
    readonly overview: RaiderOverviewDto | null;
}

function difficultySuffix(diff: RaidDifficultyLockoutDifficultyEnum): string {
    switch (diff) {
        case RaidDifficultyLockoutDifficultyEnum.Mythic:
            return "M";
        case RaidDifficultyLockoutDifficultyEnum.Heroic:
            return "H";
        case RaidDifficultyLockoutDifficultyEnum.Normal:
            return "N";
        case RaidDifficultyLockoutDifficultyEnum.LookingForRaid:
            return "L";
        default:
            const never: never = diff;
            throw new Error("unexpected: " + diff);
    }
}

function createRaidersColumns(team: RaidTeam, removeRaider: (r: Raider) => void): GridColDef[] {
    return [
        // We shouldn't have to specify renderCell and renderHeader normally,
        // but data-grid 4.0.0-alpha.34 doesn't use the correct text color
        // by default.
        {
            field: "avatar",
            headerName: " ",
            disableColumnMenu: true,
            width: 60,
            sortable: false,
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                return <Avatar alt={raider.characterName} src={raider.overview?.avatarUrl} />;
            },
        },
        {
            field: "characterName",
            width: 130,
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                const url = Routes.raider(team.id, raider.id);
                return (
                    <Link to={url}>
                        <Typography
                            color={ColorHelper.getClassColor(raider.overview?._class ?? "")}
                        >
                            {raider.characterName}
                        </Typography>
                    </Link>
                );
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Name</Typography>;
            },
        },
        {
            field: "realm",
            width: 120,
            renderCell({ row }) {
                return (
                    <Typography color={(t) => t.palette.text.primary} fontStyle="italic">
                        {(row as Raider).realm}
                    </Typography>
                );
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Realm</Typography>;
            },
        },
        {
            field: "role",
            width: 100,
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
            field: "_class",
            disableColumnMenu: true,
            width: 150,
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                if (raider.overview?._class) {
                    return (
                        <Stack direction="row">
                            <img
                                width={40}
                                alt={raider.overview?._class + " Icon"}
                                src={ImageHelper.getClassIconPath(raider.overview?._class ?? "")}
                            />
                            <Typography
                                sx={{ m: 1 }}
                                color={ColorHelper.getClassColor(raider.overview?._class ?? "")}
                            >
                                {raider.overview?._class}
                            </Typography>
                        </Stack>
                    );
                } else {
                    return <Typography />;
                }
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Class</Typography>;
            },
        },
        {
            field: "spec",
            disableColumnMenu: true,
            width: 200,
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                if (raider.overview?._class && raider.overview?.spec) {
                    return (
                        <Stack direction="row">
                            <img
                                width={40}
                                alt={
                                    raider.overview?._class + " " + raider.overview?.spec + " Icon"
                                }
                                src={ImageHelper.getSpecIconPath(
                                    raider.overview?._class ?? "",
                                    raider.overview?.spec ?? "",
                                )}
                            />
                            <Typography
                                sx={{ m: 1 }}
                                color={ColorHelper.getClassColor(raider.overview?._class ?? "")}
                            >
                                {raider.overview?.spec}
                            </Typography>
                        </Stack>
                    );
                } else {
                    return <Typography />;
                }
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Spec</Typography>;
            },
        },
        {
            field: "covenant",
            width: 120,
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                return (
                    <Typography
                        color={ColorHelper.getCovenantColor(raider.overview?.covenant ?? "")}
                    >
                        {raider.overview?.covenant}
                    </Typography>
                );
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Covenant</Typography>;
            },
        },
        {
            field: "averageItemLevel",
            width: 110,
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                return (
                    <Typography color={(t) => t.palette.text.primary}>
                        {raider.overview?.averageItemLevel}
                    </Typography>
                );
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Avg. ilvl</Typography>;
            },
        },
        {
            field: "renown",
            width: 110,
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                return (
                    <Typography color={(t) => t.palette.text.primary}>
                        {raider.overview?.renown}
                    </Typography>
                );
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Renown</Typography>;
            },
        },
        {
            field: "currentLockout",
            disableColumnMenu: true,
            sortable: false,
            width: 200,
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                const lockout: RaidLockout | undefined = raider.overview?.currentLockout;
                if (lockout == null) {
                    return (
                        <Typography color={(t) => t.palette.text.primary}>
                            No current lockout
                        </Typography>
                    );
                }
                const lockouts = lockout.lockouts.map((x: RaidDifficultyLockout) => (
                    <Typography
                        key={x.difficulty}
                        color={(t) => t.palette.text.primary}
                        sx={{ mr: 1 }}
                    >
                        {x.bossesKilled}/{x.bossesTotal}
                        {difficultySuffix(x.difficulty)}
                    </Typography>
                ));
                return <Stack direction="row">{lockouts}</Stack>;
            },
            renderHeader() {
                return <Typography color={(t) => t.palette.text.primary}>Lockout</Typography>;
            },
        },
        {
            field: "armory link",
            disableColumnMenu: true,
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
            field: "action remove",
            disableColumnMenu: true,
            sortable: false,
            renderCell({ row }) {
                return (
                    <IconButton onClick={() => removeRaider(row as Raider)}>
                        <Delete color="primary" />
                    </IconButton>
                );
            },
            renderHeader() {
                return <div></div>;
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
    const columns = React.useMemo(
        () => createRaidersColumns(team, removeRaiderDialog),
        [team, removeRaiderDialog],
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
                <DataGridContainer rowCount={GRID_ROW_COUNT}>
                    <DataGrid
                        columns={columns}
                        rows={raiders}
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
