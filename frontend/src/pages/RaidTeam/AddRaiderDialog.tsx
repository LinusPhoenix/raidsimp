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
import { RaidTeam, RaidersApi, CreateRaiderDtoRoleEnum } from "../../server";

type Role = "tank" | "healer" | "melee" | "ranged";

type Status =
    | { variant: "inputting" }
    | { variant: "creating" }
    | { variant: "error"; messages: readonly string[] };

export interface AddRaiderDialogProps {
    readonly isOpen: boolean;
    readonly handleClose: () => void;
    readonly reload: () => void;
    readonly team: RaidTeam;
}

export function AddRaiderDialog({
    isOpen,
    handleClose,
    reload,
    team,
}: AddRaiderDialogProps): JSX.Element {
    const [characterName, setCharacterName] = React.useState<string>("");
    const [realm, setRealm] = React.useState<string>("");
    const [role, setRole] = React.useState<"" | Role>("");
    const statusRef = React.useRef<Status>({ variant: "inputting" });
    const render = useForceRender();

    const createTeam = React.useCallback(async () => {
        if (statusRef.current.variant !== "inputting") {
            return;
        }
        statusRef.current = { variant: "creating" };
        render();
        const response = await serverRequest((config) => {
            const client = new RaidersApi(config);
            return client.raidersControllerAddRaiderToRaidTeam({
                raidTeamId: team.id,
                createRaiderDto: {
                    characterName,
                    realm,
                    role: role as CreateRaiderDtoRoleEnum,
                },
            });
        });
        if (response.isOk) {
            statusRef.current = { variant: "inputting" };
            setCharacterName("");
            setRealm("");
            setRole("");
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
    }, [
        characterName,
        realm,
        role,
        setCharacterName,
        setRealm,
        setRole,
        statusRef,
        render,
        reload,
        handleClose,
        team.id,
    ]);

    const handleNameChange = React.useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            statusRef.current = { variant: "inputting" };
            setCharacterName(event.target.value);
        },
        [statusRef, setCharacterName],
    );

    const handleRealmChange = React.useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            statusRef.current = { variant: "inputting" };
            setRealm(event.target.value);
        },
        [statusRef, setRealm],
    );

    const handleRoleChange = React.useCallback(
        (event: SelectChangeEvent) => {
            statusRef.current = { variant: "inputting" };
            setRole(event.target.value as "" | Role);
        },
        [statusRef, setRole],
    );

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth={true} maxWidth={"xs"}>
            <DialogTitle>Add raider</DialogTitle>
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
                        <InputLabel id="add-raider-role">Role</InputLabel>
                        <Select
                            autoFocus
                            labelId="add-raider-role"
                            value={role}
                            onChange={handleRoleChange}
                            label="Role"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="tank">Tank</MenuItem>
                            <MenuItem value="healer">Healer</MenuItem>
                            <MenuItem value="melee">Melee DPS</MenuItem>
                            <MenuItem value="ranged">Ranged DPS</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Character name"
                        id="add-raider-character-name"
                        variant="standard"
                        sx={{ m: 1 }}
                        value={characterName}
                        onChange={handleNameChange}
                    />
                    <TextField
                        label="Realm"
                        id="add-raider-realm"
                        variant="standard"
                        sx={{ m: 1 }}
                        value={realm}
                        onChange={handleRealmChange}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {statusRef.current.variant === "creating" ? (
                    <Button variant="contained" color="primary">
                        <CircularProgress color="inherit" />
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={createTeam}>
                        Add
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
