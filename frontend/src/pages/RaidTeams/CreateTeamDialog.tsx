import React, { ChangeEvent } from "react";
import {
    Button,
    Divider,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    SelectChangeEvent,
} from "@material-ui/core";
import { useForceRender, serverRequest } from "../../utility";
import { CreateRaidTeamDtoRegionEnum, RaidTeamsApi } from "../../server";

type Region = "eu" | "us" | "kr" | "tw";

type CreationStatus =
    | { variant: "inputting" }
    | { variant: "creating" }
    | { variant: "error"; messages: readonly string[] };

export interface CreateTeamDialogProps {
    readonly isOpen: boolean;
    readonly handleClose: () => void;
    readonly reload: () => void;
}

export function CreateTeamDialog({
    isOpen,
    handleClose,
    reload,
}: CreateTeamDialogProps): JSX.Element {
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
        const response = await serverRequest((config) => {
            const client = new RaidTeamsApi(config);
            return client.raidTeamsControllerCreate({
                createRaidTeamDto: {
                    name: teamName,
                    region: region as CreateRaidTeamDtoRegionEnum,
                },
            });
        });
        if (response.isOk) {
            statusRef.current = { variant: "inputting" };
            setTeamName("");
            setRegion("");
            handleClose();
            reload();
        } else {
            const { genericErrors } = response;
            statusRef.current = {
                variant: "error",
                messages: genericErrors,
            };
            render();
        }
    }, [region, teamName, statusRef, render, reload, handleClose]);

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
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>New team</DialogTitle>
            <DialogContent>
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
                        variant="standard"
                        sx={{ m: 1 }}
                        value={teamName}
                        onChange={handleNameChange}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                {statusRef.current.variant === "creating" ? (
                    <Button variant="contained" color="primary">
                        <CircularProgress color="inherit" />
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={createTeam}>
                        Create
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
