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
    Grid,
    Autocomplete,
    InputAdornment,
    Box,
} from "@material-ui/core";
import { useForceRender, serverRequest } from "../../utility";
import {
    RaidTeam,
    RaidersApi,
    CreateRaiderDtoRoleEnum,
    SearchApi,
    SearchResultDto,
} from "../../server";
import { ColorHelper } from "../../utility/color-helper";
import { ImageHelper } from "../../utility/image-helper";

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
    const [role, setRole] = React.useState<"" | Role>("");
    const statusRef = React.useRef<Status>({ variant: "inputting" });
    const render = useForceRender();

    const [character, setCharacter] = React.useState<SearchResultDto | null>(null);
    const [searchInput, setSearchInput] = React.useState("");
    const [characterOptions, setCharacterOptions] = React.useState<SearchResultDto[]>([]);

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
                    characterName: character?.characterName || "",
                    realm: character?.realmName || "",
                    role: role as CreateRaiderDtoRoleEnum,
                },
            });
        });
        if (response.isOk) {
            statusRef.current = { variant: "inputting" };
            setCharacter(null);
            setCharacterOptions([]);
            setSearchInput("");
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
        character,
        role,
        setCharacter,
        setCharacterOptions,
        setSearchInput,
        setRole,
        statusRef,
        render,
        reload,
        handleClose,
        team.id,
    ]);

    const handleRoleChange = React.useCallback(
        (event: SelectChangeEvent) => {
            statusRef.current = { variant: "inputting" };
            setRole(event.target.value as "" | Role);
        },
        [statusRef, setRole],
    );

    const searchCharacters = React.useEffect(() => {
        var active = true;

        // Unset options if search field is empty.
        if (searchInput.length < 3) {
            setCharacterOptions(character ? [character] : []);
            return undefined;
        }
        serverRequest((config) => {
            const client = new SearchApi(config);
            return client.searchControllerSearch({
                region: team.region,
                characterName: searchInput,
            });
        }).then((data) => {
            if (!data.isOk) {
                console.error(data);
            } else {
                if (active) {
                    setCharacterOptions(data.body.slice(0, 10));
                }
            }
        });

        return () => {
            active = false;
        };
    }, [searchInput, character, team.region]);

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
                    <Autocomplete
                        id="search-characters"
                        sx={{ m: 1 }}
                        value={character}
                        options={characterOptions}
                        getOptionLabel={(option) =>
                            option ? option.characterName + "-" + option.realmName : ""
                        }
                        onChange={(event: any, newValue: SearchResultDto | null) => {
                            setCharacterOptions(
                                newValue ? [newValue, ...characterOptions] : characterOptions,
                            );
                            setCharacter(newValue);
                        }}
                        onInputChange={(_event: any, newInputValue: any) => {
                            setCharacter(null);
                            setSearchInput(newInputValue);
                        }}
                        renderInput={(params: any) => (
                            <TextField
                                {...params}
                                label="Search for a character"
                                variant="standard"
                            />
                        )}
                        renderOption={(props, option) => {
                            return (
                                <Box component="li" {...props}>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <img
                                                width={40}
                                                alt={option.className + " Icon"}
                                                src={ImageHelper.getClassIconPath(option.className)}
                                            />
                                        </Grid>
                                        <Grid item sm>
                                            <Typography
                                                sx={{ m: 1 }}
                                                color={ColorHelper.getClassColor(option.className)}
                                            >
                                                {option.characterName}
                                            </Typography>
                                        </Grid>
                                        <Grid item sm>
                                            <Typography sx={{ m: 1 }} fontStyle="italic">
                                                {option.realmName}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            );
                        }}
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
