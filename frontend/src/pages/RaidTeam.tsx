import React from "react";
import { Typography, Container, Box } from "@material-ui/core";
import { DataGrid, GridColDef, GridCellParams } from "@material-ui/data-grid";
import { Link } from "../components/Link";
import * as Routes from "./routes";
import { DataGridContainer } from "../components/DataGridContainer";
import { loremIpsum } from "lorem-ipsum";

const RAIDERS_COLUMNS: GridColDef[] = [
    {
        field: "realm",
        headerName: "Realm",
        width: 120,
    },
    {
        field: "characterName",
        headerName: "Name",
        width: 200,
        renderCell(param: GridCellParams) {
            const raider: Raider = param.row as Raider;
            const url = Routes.raider(raider.raidTeamId, raider.id);
            return <Link to={url}>{raider.characterName}</Link>;
        },
    },
    {
        field: "avgItemlevel",
        headerName: "Ilvl",
        width: 110,
    },
    {
        field: "renown",
        headerName: "Renown",
        width: 130,
    },
    {
        field: "spec",
        headerName: "Specialization",
        width: 130,
    },
    {
        field: "covenant",
        headerName: "Covenant",
        width: 110,
    },
    {
        field: "role",
        headerName: "Role",
        width: 110,
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
    const TMP_ROWS = React.useMemo(() => new Array(20).fill(props.teamId).map(generateRaider), []);
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
