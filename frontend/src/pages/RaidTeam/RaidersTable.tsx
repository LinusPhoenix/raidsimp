import React from "react";
import { Typography, Avatar, IconButton, Tooltip, CircularProgress } from "@material-ui/core";
import {
    DataGrid,
    GridCellValue,
    GridColDef,
    GridSortModel,
    GridValueGetterParams,
} from "@material-ui/data-grid";
import { Link } from "../../components";
import * as Routes from "../routes";
import {
    RaidTeam,
    Raider as ServerRaider,
    RaiderOverviewDto,
    RaidDifficultyLockoutDifficultyEnum,
} from "../../server";
import { Delete } from "@material-ui/icons";
import { ColorHelper } from "../../utility/color-helper";
import { ImageHelper } from "../../utility/image-helper";
import { StringHelper } from "../../utility/string-helper";

export interface Raider extends Readonly<ServerRaider> {
    readonly overview: RaiderOverviewDto | null;
}

function lockoutRenderCell(
    difficulty: RaidDifficultyLockoutDifficultyEnum,
): (params: GridValueGetterParams) => GridCellValue {
    return (params) => {
        const raider = params.row as Raider;
        if (raider.overview == null) {
            return <CircularProgress />;
        }
        const lockout = raider.overview.currentLockout?.lockouts.find(
            (x) => x.difficulty === difficulty,
        );
        if (lockout == null) {
            return <Typography color={(t) => t.palette.text.primary}>-</Typography>;
        }
        return (
            <Typography
                color={ColorHelper.getLockoutColor(lockout.bossesKilled, lockout.bossesTotal)}
                sx={{ mr: 1 }}
            >
                {lockout.bossesKilled}/{lockout.bossesTotal}
            </Typography>
        );
    };
}
function lockoutValueGetter(
    difficulty: RaidDifficultyLockoutDifficultyEnum,
): (params: GridValueGetterParams) => number {
    return (params) => {
        const raider = params.row as Raider;
        const lockout = raider.overview?.currentLockout?.lockouts.find(
            (x) => x.difficulty === difficulty,
        );
        if (lockout == null) {
            return 0;
        }
        return lockout.bossesKilled;
    };
}
function overviewValueGetter<A>(
    default_: A,
    f: (x: RaiderOverviewDto) => A,
): (params: GridValueGetterParams) => A {
    return (params) => {
        const raider = params.row as Raider;
        if (raider.overview == null) {
            return default_;
        } else {
            return f(raider.overview);
        }
    };
}
function renderHeader(text: string): () => JSX.Element {
    return () => <Typography color={(t) => t.palette.text.primary}>{text}</Typography>;
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
                const url = Routes.armoryUrl({
                    name: raider.characterName,
                    realm: raider.realm,
                    region: team.region,
                });
                return (
                    <a href={url} target="_blank" rel="noreferrer">
                        <Avatar alt={raider.characterName} src={raider.overview?.avatarUrl} />
                    </a>
                );
            },
        },
        {
            field: "characterName",
            minWidth: 100,
            flex: 1,
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
            renderHeader: renderHeader("Name"),
        },
        {
            field: "realm",
            minWidth: 130,
            flex: 1,
            renderCell({ row }) {
                return (
                    <Typography color={(t) => t.palette.text.primary} fontStyle="italic">
                        {(row as Raider).realm}
                    </Typography>
                );
            },
            renderHeader: renderHeader("Realm"),
        },
        {
            field: "role",
            minWidth: 100,
            flex: 0.75,
            renderCell({ row }) {
                return (
                    <Typography color={(t) => t.palette.text.primary}>
                        {StringHelper.capitalizeFirstLetter((row as Raider).role)}
                    </Typography>
                );
            },
            renderHeader: renderHeader("Role"),
        },
        {
            field: "_class",
            width: 100,
            sortable: true,
            disableColumnMenu: true,
            valueGetter: overviewValueGetter("", (x) => x._class),
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                if (raider.overview?._class) {
                    return (
                        <Tooltip
                            placement="right"
                            title={
                                <Typography
                                    sx={{ m: 1 }}
                                    color={ColorHelper.getClassColor(raider.overview?._class ?? "")}
                                >
                                    {raider.overview?._class}
                                </Typography>
                            }
                        >
                            <img
                                width={40}
                                alt={raider.overview?._class + " Icon"}
                                src={ImageHelper.getClassIconPath(raider.overview?._class ?? "")}
                            />
                        </Tooltip>
                    );
                } else {
                    return <CircularProgress />;
                }
            },
            renderHeader: renderHeader("Class"),
        },
        {
            field: "spec",
            width: 70,
            sortable: false,
            disableColumnMenu: true,
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                if (raider.overview?._class && raider.overview?.spec) {
                    return (
                        <Tooltip
                            placement="right"
                            title={
                                <Typography
                                    sx={{ m: 1 }}
                                    color={ColorHelper.getClassColor(raider.overview?._class ?? "")}
                                >
                                    {raider.overview?.spec}
                                </Typography>
                            }
                        >
                            <img
                                width={40}
                                alt={
                                    raider.overview?.spec + " " + raider.overview?._class + " Icon"
                                }
                                src={ImageHelper.getSpecIconPath(
                                    raider.overview?._class ?? "",
                                    raider.overview?.spec ?? "",
                                )}
                            />
                        </Tooltip>
                    );
                } else {
                    return <CircularProgress />;
                }
            },
            renderHeader: renderHeader("Spec"),
        },
        {
            field: "covenant",
            minWidth: 100,
            flex: 0.75,
            valueGetter: overviewValueGetter("", (x) => x.covenant),
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                return (
                    <Typography
                        color={ColorHelper.getCovenantColor(raider.overview?.covenant ?? "")}
                    >
                        {raider.overview == null ? <CircularProgress /> : raider.overview?.covenant}
                    </Typography>
                );
            },
            renderHeader: renderHeader("Covenant"),
        },
        {
            field: "averageItemLevel",
            type: "number",
            minWidth: 80,
            flex: 0.75,
            valueGetter: overviewValueGetter(0, (x) => x.averageItemLevel),
            renderCell: (params) => {
                const raider: Raider = params.row as Raider;
                return (
                    <Typography
                        color={ColorHelper.getIlvlColor(raider.overview?.averageItemLevel || 0)}
                    >
                        {raider.overview?.averageItemLevel ?? <CircularProgress />}
                    </Typography>
                );
            },
            renderHeader: renderHeader("Avg. ilvl"),
        },
        {
            field: "renown",
            type: "number",
            minWidth: 80,
            flex: 0.75,
            valueGetter: overviewValueGetter(0, (x) => x.renown),
            renderCell({ row }) {
                const raider: Raider = row as Raider;
                return (
                    <Typography color={(t) => t.palette.text.primary}>
                        {raider.overview == null ? <CircularProgress /> : raider.overview?.renown}
                    </Typography>
                );
            },
            renderHeader: renderHeader("Renown"),
        },
        {
            field: "lockoutNormal",
            width: 80,
            disableColumnMenu: true,
            valueGetter: lockoutValueGetter(RaidDifficultyLockoutDifficultyEnum.Normal),
            renderCell: lockoutRenderCell(RaidDifficultyLockoutDifficultyEnum.Normal),
            renderHeader: renderHeader("Normal"),
        },
        {
            field: "lockoutHeroic",
            width: 80,
            disableColumnMenu: true,
            valueGetter: lockoutValueGetter(RaidDifficultyLockoutDifficultyEnum.Heroic),
            renderCell: lockoutRenderCell(RaidDifficultyLockoutDifficultyEnum.Heroic),
            renderHeader: renderHeader("Heroic"),
        },
        {
            field: "lockoutMythic",
            width: 80,
            disableColumnMenu: true,
            valueGetter: lockoutValueGetter(RaidDifficultyLockoutDifficultyEnum.Mythic),
            renderCell: lockoutRenderCell(RaidDifficultyLockoutDifficultyEnum.Mythic),
            renderHeader: renderHeader("Mythic"),
        },
        {
            field: "action remove",
            headerName: " ",
            width: 60,
            disableColumnMenu: true,
            sortable: false,
            renderCell({ row }) {
                return (
                    <IconButton onClick={() => removeRaider(row as Raider)}>
                        <Delete color="primary" />
                    </IconButton>
                );
            },
        },
    ];
}

export interface RaidersTableProps {
    readonly team: RaidTeam;
    readonly raiders: readonly Raider[];
    readonly removeRaiderDialog: (x: Raider) => void;
}

export const RaidersTable = React.memo(function RaidersTable({
    team,
    raiders,
    removeRaiderDialog,
}: RaidersTableProps) {
    const columns = React.useMemo(
        () => createRaidersColumns(team, removeRaiderDialog),
        [team, removeRaiderDialog],
    );
    const [sortModel, setSortModel] = React.useState<GridSortModel>([
        {
            field: "characterName",
            sort: "asc",
        },
    ]);

    return (
        <DataGrid
            autoHeight={true}
            columns={columns}
            rows={raiders}
            pageSize={30}
            isRowSelectable={() => false}
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
        />
    );
});
