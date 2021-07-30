import React, { ChangeEvent } from "react";
import {
    Button,
    Divider,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Typography,
    Box,
    Container,
    Stack,
    Modal,
    SelectChangeEvent,
} from "@material-ui/core";
import { DataGrid, GridColDef, GridCellParams } from "@material-ui/data-grid";
import { Link } from "../components/Link";
import * as Routes from "./routes";
import { DataGridContainer } from "../components/DataGridContainer";
import { loremIpsum } from "lorem-ipsum";
import { Configuration, CreateRaidTeamDtoRegionEnum, RaidTeamsApi } from "../server";

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

type ModalOpen = "none" | "create";

export function RaidTeamsPage() {
    const TMP_ROWS = React.useMemo(() => new Array(20).fill(null).map(generateTeam), []);
    const [modalOpen, setModalOpen] = React.useState<ModalOpen>("none");
    const openCreateModal = React.useCallback(() => {
        setModalOpen("create");
    }, [setModalOpen]);
    const closeModal = React.useCallback(() => {
        setModalOpen("none");
    }, [setModalOpen]);

    return (
        <>
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
                <Box marginY={2} />
                <Button variant="contained" color="primary" onClick={openCreateModal}>
                    New team
                </Button>
            </Container>
            <CreateTeamModal isOpen={modalOpen === "create"} handleClose={closeModal} />
        </>
    );
}

type Region = "eu" | "us" | "kr" | "tw";

type CreationStatus =
    | { variant: "inputting" }
    | { variant: "creating" }
    | { variant: "error"; messages: readonly string[] };

function useForceRender(): () => void {
    const update = React.useState(0)[1];
    return React.useCallback(() => {
        update((n) => n + 1);
    }, [update]);
}

const FORM_STYLE = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    p: 4,
} as const;

interface CreateTeamModalProps {
    readonly isOpen: boolean;
    readonly handleClose: () => void;
}

function CreateTeamModal({ isOpen, handleClose }: CreateTeamModalProps): JSX.Element {
    const [teamName, setTeamName] = React.useState<string>("");
    const [region, setRegion] = React.useState<"" | Region>("");
    const statusRef = React.useRef<CreationStatus>({ variant: "inputting" });
    const render = useForceRender();

    const createTeam = React.useCallback(async () => {
        if (statusRef.current.variant !== "inputting") {
            return;
        }
        statusRef.current = { variant: "creating" };
        render();
        try {
            const client = new RaidTeamsApi(
                new Configuration({ basePath: "http://localhost:3000" }),
            );
            await client.raidTeamsControllerCreate({
                createRaidTeamDto: {
                    name: teamName,
                    region: region as CreateRaidTeamDtoRegionEnum,
                },
            });
            statusRef.current = { variant: "inputting" };
            setTeamName("");
            setRegion("");
            // todo: refetch data for list
        } catch (err) {
            if (err instanceof Response) {
                statusRef.current = {
                    variant: "error",
                    messages: [`Error ${err.status}: ${err.statusText}`],
                };
            } else {
                console.error(err);
                statusRef.current = { variant: "error", messages: ["Unexpected error"] };
            }
            render();
        }
    }, [region, teamName, statusRef, render]);

    const handleNameChange = React.useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            statusRef.current = { variant: "inputting" };
            setTeamName(event.target.value);
        },
        [setTeamName],
    );

    const handleRegionChange = React.useCallback(
        (event: SelectChangeEvent) => {
            statusRef.current = { variant: "inputting" };
            setRegion(event.target.value as "" | Region);
        },
        [setRegion],
    );

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <Paper elevation={1} sx={FORM_STYLE}>
                {statusRef.current.variant === "error" && (
                    <>
                        {statusRef.current.messages.map((x, idx) => (
                            <Typography key={idx} color={(t) => t.palette.error.main}>
                                {x}
                            </Typography>
                        ))}
                        <Divider sx={{ my: 2 }} />
                    </>
                )}
                <Stack>
                    <FormControl variant="standard" sx={{ m: 1 }}>
                        <InputLabel id="create-team-region">Region</InputLabel>
                        <Select
                            autoFocus
                            labelId="create-team-region"
                            value={region}
                            onChange={handleRegionChange}
                            label="Region"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="eu">Europe</MenuItem>
                            <MenuItem value="us">United States</MenuItem>
                            <MenuItem value="kr">Korea</MenuItem>
                            <MenuItem value="tw">Taiwan</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Team name"
                        id="create-team-name"
                        size="small"
                        variant="standard"
                        sx={{ m: 1 }}
                        value={teamName}
                        onChange={handleNameChange}
                    />
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
                    <Stack direction="row">
                        <Button onClick={handleClose}>Close</Button>
                        <Button variant="contained" color="primary" onClick={createTeam}>
                            Create
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Modal>
    );
}
