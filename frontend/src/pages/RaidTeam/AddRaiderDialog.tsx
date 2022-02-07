import React from "react";
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
    Box,
    AutocompleteInputChangeReason,
    AutocompleteRenderInputParams,
} from "@material-ui/core";
import { useForceRender, serverRequest, useThrottledPlus } from "../../utility";
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
    | Readonly<{ variant: "inputting" }>
    | Readonly<{ variant: "creating" }>
    | Readonly<{ variant: "error"; messages: readonly string[] }>;

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

    const [character, setCharacter] = React.useState<Character>(DEFAULT_CHARACTER);
    const [characterOptions, setCharacterOptions] = React.useState<Character[]>([]);

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
            setCharacter(DEFAULT_CHARACTER);
            setCharacterOptions([]);
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

    // The "searchId" is used to filter out searches that are not the current one.
    // This prevents slow requests from overwriting more recent ones.
    const searchIdRef = React.useRef({ current: 0, next: 1 });
    useThrottledPlus(1000, async () => {
        if (character.characterName.length < 3) {
            setCharacterOptions([]);
            return;
        }
        const searchId = searchIdRef.current.next++;
        const data = await serverRequest((config) => {
            return new SearchApi(config).searchControllerSearch({
                region: team.region,
                characterName: character.characterName,
            });
        });
        if (!data.isOk) {
            console.error(data);
        } else if (searchId >= searchIdRef.current.current) {
            setCharacterOptions(data.body.map(searchResultToCharacter));
            searchIdRef.current.current = searchId;
        }
    }, [character.className, character.characterName, team.region, setCharacterOptions]);

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
                <Stack spacing={1} sx={{ mt: 1 }}>
                    <FormControl variant="standard">
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
                        id="add-raider-realm"
                        label="Realm"
                        variant="standard"
                        value={character.realmName}
                        onChange={(ev) => {
                            statusRef.current = { variant: "inputting" };
                            setCharacter((ch) => ({ ...ch, realmName: ev.target.value }));
                        }}
                    />
                    <RaiderAutocomplete
                        character={character}
                        onChange={(ch) => {
                            statusRef.current = { variant: "inputting" };
                            setCharacter(ch);
                        }}
                        characterOptions={characterOptions}
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

const DEFAULT_CHARACTER: Character = {
    characterName: "",
    realmName: "",
    className: null,
};

interface Character {
    readonly characterName: string;
    readonly realmName: string;
    readonly className: string | null;
}

function searchResultToCharacter(dto: SearchResultDto): Character {
    return {
        characterName: dto.characterName,
        realmName: dto.realmName,
        className: dto.className,
    };
}

interface RaiderAutocompleteProps {
    readonly character: Character;
    readonly characterOptions: readonly Character[];
    readonly onChange: (c: Character) => void;
}

const RaiderAutocomplete = React.memo(function RaiderAutocomplete({
    character,
    characterOptions,
    onChange,
}: RaiderAutocompleteProps) {
    return (
        <Autocomplete
            id="search-characters"
            value={character}
            options={characterOptions}
            getOptionLabel={(option) => option.characterName}
            onChange={(_event: unknown, newValue: Character | null) => {
                onChange(newValue ?? DEFAULT_CHARACTER);
            }}
            isOptionEqualToValue={(opt, val) => {
                return opt.realmName.toLowerCase() == val.realmName.toLowerCase()
                    && opt.characterName.toLowerCase() === val.characterName.toLowerCase()
            }}
            onInputChange={(
                _event: unknown,
                newInputValue: string,
                _reason: AutocompleteInputChangeReason,
            ) => {
                onChange({
                    characterName: newInputValue,
                    realmName: character.realmName,
                    className: null,
                });
            }}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} label="Search for a character" variant="standard" />
            )}
            renderOption={(props, option) => {
                return (
                    <Box component="li" {...props} key={option.characterName + "-" + option.realmName}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <img
                                    width={40}
                                    alt={option.className + " Icon"}
                                    src={ImageHelper.getClassIconPath(option.className!)}
                                />
                            </Grid>
                            <Grid item sm>
                                <Typography
                                    sx={{ m: 1 }}
                                    color={ColorHelper.getClassColor(option.className!)}
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
    );
});
