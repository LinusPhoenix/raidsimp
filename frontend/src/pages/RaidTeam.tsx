import React from "react";
import { Typography, Container, Box } from "@material-ui/core";
import { DataGrid, GridColDef, GridCellParams } from "@material-ui/data-grid";
import { Link } from "../components/Link";
import * as Routes from "./routes";
import { DataGridContainer } from "../components/DataGridContainer";
import { loremIpsum } from "lorem-ipsum";

const RAIDERS_COLUMNS: GridColDef[] = [
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
            const url = Routes.raider(raider.raidTeamId, raider.id);
            return <Link to={url}>{raider.characterName}</Link>;
        },
        renderHeader() {
            return <Typography color={(t) => t.palette.text.primary}>Name</Typography>;
        },
    },
    {
        field: "avgItemlevel",
        width: 110,
        renderCell({ row }) {
            return (
                <Typography color={(t) => t.palette.text.primary}>
                    {(row as Raider).avgItemlevel}
                </Typography>
            );
        },
        renderHeader() {
            return <Typography color={(t) => t.palette.text.primary}>Ilvl</Typography>;
        },
    },
    {
        field: "renown",
        width: 130,
        renderCell({ row }) {
            return (
                <Typography color={(t) => t.palette.text.primary}>
                    {(row as Raider).renown}
                </Typography>
            );
        },
        renderHeader() {
            return <Typography color={(t) => t.palette.text.primary}>Renown</Typography>;
        },
    },
    {
        field: "spec",
        width: 130,
        renderCell({ row }) {
            return (
                <Typography color={(t) => t.palette.text.primary}>
                    {(row as Raider).spec}
                </Typography>
            );
        },
        renderHeader() {
            return <Typography color={(t) => t.palette.text.primary}>Specialization</Typography>;
        },
    },
    {
        field: "covenant",
        width: 110,
        renderCell({ row }) {
            return (
                <Typography color={(t) => t.palette.text.primary}>
                    {(row as Raider).covenant}
                </Typography>
            );
        },
        renderHeader() {
            return <Typography color={(t) => t.palette.text.primary}>Covenant</Typography>;
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
];

interface Raider {
    readonly raidTeamId: string;
    readonly id: string;
    readonly characterId: string;
    readonly characterName: string;
    readonly realm: string;
    readonly region: string;
    readonly avgItemlevel: number;
    readonly renown: number;
    readonly role: string;
    readonly spec: string;
    readonly covenant: string;
}

function generateRaider(raidTeamId: string): Raider {
    return {
        raidTeamId,
        id: loremIpsum({ count: 4, units: "words" }).split(" ").join("-"),
        characterId: loremIpsum({ count: 4, units: "words" }).split(" ").join("-"),
        characterName: loremIpsum({ count: 1, units: "word" }),
        realm: loremIpsum({ count: 1, units: "word" }),
        region: "eu",
        avgItemlevel: Math.floor(Math.random() * 20) + 225,
        renown: Math.floor(Math.random() * 20) + 35,
        role: loremIpsum({
            count: 1,
            units: "word",
            words: ["dps", "tank", "healer"],
        }),
        spec: loremIpsum({ count: 1, units: "word" }),
        covenant: loremIpsum({ count: 1, units: "word" }),
    };
}

const GRID_ROW_COUNT = 12;

export interface RaidTeamPageProps {
    readonly teamId: string;
}

export function RaidTeamPage(props: RaidTeamPageProps) {
    const TMP_ROWS = React.useMemo(
        () => new Array(20).fill(props.teamId).map(generateRaider),
        [props.teamId],
    );
    return (
        <Container maxWidth="lg">
            <Typography variant="h6">Main</Typography>
            <Box marginY={2} />
            <DataGridContainer rowCount={GRID_ROW_COUNT}>
                <DataGrid
                    columns={RAIDERS_COLUMNS}
                    rows={TMP_ROWS}
                    pageSize={GRID_ROW_COUNT}
                    isRowSelectable={() => false}
                />
            </DataGridContainer>
        </Container>
    );
}
