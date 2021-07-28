import React from "react";
import { Typography, Box, Container } from "@material-ui/core";
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
        field: "region",
        width: 120,
        renderCell({ row }) {
            return (
                <Typography color={(t) => t.palette.text.primary}>
                    {(row as Team).region}
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
            const team: Team = param.row as Team;
            const url = Routes.raidTeam(team.id);
            return <Link to={url}>{team.name}</Link>;
        },
        renderHeader() {
            return <Typography color={(t) => t.palette.text.primary}>Name</Typography>;
        },
    },
];

interface Team {
    readonly id: string;
    readonly name: string;
    readonly region: string;
}

function generateTeam(): Team {
    return {
        id: loremIpsum({ count: 4, units: "words" }).split(" ").join("-"),
        name: loremIpsum({ count: 1, units: "word" }),
        region: loremIpsum({ count: 1, units: "word", words: ["eu", "us", "kr", "tw"] }),
    };
}

const GRID_ROW_COUNT = 10;

export function RaidTeamsPage() {
    const TMP_ROWS = React.useMemo(() => new Array(20).fill(null).map(generateTeam), []);
    return (
        <Container maxWidth="xl">
            <Typography variant="h6">Raid teams</Typography>
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
