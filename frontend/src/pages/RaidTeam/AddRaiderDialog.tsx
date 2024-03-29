import React from "react";
import {
    Button,
    Divider,
    TextField,
    FormControl,
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
    AutocompleteRenderInputParams,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel,
} from "@mui/material";
import { useForceRender, serverRequest, useThrottledPlus } from "../../utility";
import {
    RaidTeam,
    RaidersApi,
    CreateRaiderDtoRoleEnum,
    SearchApi,
    SearchResultDto,
} from "../../server";
import { ImageHelper } from "../../utility/image-helper";
import { getClassColor } from "../../utility/color-helper";

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

const DEFAULT_ROLE: Role = "tank";

export function AddRaiderDialog({
    isOpen,
    handleClose,
    reload,
    team,
}: AddRaiderDialogProps): JSX.Element {
    const [role, setRole] = React.useState<Role>(DEFAULT_ROLE);
    const statusRef = React.useRef<Status>({ variant: "inputting" });
    const render = useForceRender();

    const [character, setCharacter] = React.useState<Character>(DEFAULT_CHARACTER);
    const [characterOptions, setCharacterOptions] = React.useState<Character[]>([]);

    const baseAddRaider = async () => {
        if (statusRef.current.variant !== "inputting") {
            return false;
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
            setRole(DEFAULT_ROLE);
            reload();
            return true;
        } else {
            const { genericErrors } = response;
            statusRef.current = {
                variant: "error",
                messages: genericErrors,
            };
            render();
            return false;
        }
    };

    const characterFieldRef = React.createRef<HTMLDivElement>();

    const addRaider = async () => {
        if (await baseAddRaider()) {
            handleClose();
        }
    };

    const [dialogGen, nextDialogGen] = React.useReducer((n: number) => n + 1, 0);
    const addRaiderWithoutClose = async () => {
        await baseAddRaider();
        nextDialogGen();
    };
    React.useEffect(() => {
        // This effect is just for focusing the character input element after adding a raider.
        characterFieldRef.current?.querySelector("input")?.focus();
    }, [characterFieldRef.current, dialogGen]);

    const setAutoChar = React.useCallback(
        (ch: Character) => {
            statusRef.current = { variant: "inputting" };
            if (ch.className !== null) {
                const roles = appropriateRoles(ch.className);
                if (!roles.includes(role) && roles.length > 0) {
                    setRole(roles[0]);
                }
            }
            setCharacter(ch);
        },
        [role, appropriateRoles],
    );

    const handleRoleChange = React.useCallback(
        (event: SelectChangeEvent) => {
            statusRef.current = { variant: "inputting" };
            setRole(event.target.value as Role);
        },
        [statusRef, setRole],
    );

    // The "searchId" is used to filter out searches that are not the current one.
    // This prevents slow requests from overwriting more recent ones.
    const searchIdRef = React.useRef({ current: 0, next: 1 });
    useThrottledPlus(
        1000,
        async () => {
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
        },
        [character.className, character.characterName, team.region, setCharacterOptions],
    );

    return (
        <Dialog open={isOpen} onClose={handleClose} fullWidth={true} maxWidth="sm">
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
                    <Stack direction="row">
                        <RaiderAutocomplete
                            label="Search for a character"
                            character={character}
                            onChange={setAutoChar}
                            characterOptions={characterOptions}
                            inputFieldRef={characterFieldRef}
                        />
                        <TextField
                            sx={{ ml: 2 }}
                            id="add-raider-realm"
                            label="Realm"
                            value={character.realmName}
                            onChange={(ev) => {
                                statusRef.current = { variant: "inputting" };
                                setCharacter((ch) => ({ ...ch, realmName: ev.target.value }));
                            }}
                        />
                    </Stack>
                    <RoleInput role={role} handleRoleChange={handleRoleChange} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                {statusRef.current.variant === "creating" ? (
                    <>
                        <Button variant="outlined" color="secondary">
                            <CircularProgress color="inherit" />
                        </Button>
                        <Button variant="contained" color="primary">
                            <CircularProgress color="inherit" />
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={addRaiderWithoutClose}
                        >
                            Add without closing
                        </Button>
                        <Button variant="contained" color="primary" onClick={addRaider}>
                            Add
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

interface RoleInputProps {
    readonly role: Role;
    readonly handleRoleChange: (event: SelectChangeEvent) => void;
}

const RoleInput = React.memo(function RoleInput({ role, handleRoleChange }: RoleInputProps) {
    return (
        <FormControl>
            <FormLabel id="add-raider-role">Role</FormLabel>
            <RadioGroup row name="add-raider-role" value={role} onChange={handleRoleChange}>
                <FormControlLabel value="tank" control={<Radio />} label="Tank" />
                <FormControlLabel value="healer" control={<Radio />} label="Healer" />
                <FormControlLabel value="melee" control={<Radio />} label="Melee DPS" />
                <FormControlLabel value="ranged" control={<Radio />} label="Ranged DPS" />
            </RadioGroup>
        </FormControl>
    );
});

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
    readonly label: string;
    readonly character: Character;
    readonly characterOptions: readonly Character[];
    readonly onChange: (c: Character) => void;
    readonly inputFieldRef: React.RefObject<HTMLDivElement>;
}

const RaiderAutocomplete = React.memo(function RaiderAutocomplete({
    label,
    character,
    characterOptions,
    onChange,
    inputFieldRef,
}: RaiderAutocompleteProps) {
    return (
        <Autocomplete
            id="search-characters"
            autoSelect
            value={character}
            fullWidth
            options={characterOptions}
            getOptionLabel={(option) => option.characterName}
            onChange={(_event: unknown, newValue: Character | null) => {
                onChange(newValue ?? DEFAULT_CHARACTER);
            }}
            isOptionEqualToValue={(opt, val) => {
                return (
                    opt.realmName.toLowerCase() == val.realmName.toLowerCase() &&
                    opt.characterName.toLowerCase() === val.characterName.toLowerCase()
                );
            }}
            onInputChange={(_event: unknown, newInputValue: string) => {
                onChange({
                    characterName: newInputValue,
                    realmName: character.realmName,
                    className: null,
                });
            }}
            renderInput={(params: AutocompleteRenderInputParams) => (
                <TextField {...params} label={label} ref={inputFieldRef} autoFocus />
            )}
            renderOption={(props, option) => {
                return (
                    <Box
                        component="li"
                        {...props}
                        key={option.characterName + "-" + option.realmName}
                    >
                        <Grid container alignItems="center">
                            <Grid item>
                                <img
                                    width={40}
                                    alt={option.className + " Icon"}
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    src={ImageHelper.getClassIconPath(option.className!)}
                                />
                            </Grid>
                            <Grid item sm>
                                <Typography
                                    sx={{ m: 1 }}
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    color={getClassColor(option.className!)}
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

function appropriateRoles(className: string): readonly Role[] {
    const t: Role = "tank";
    const h: Role = "healer";
    const m: Role = "melee";
    const r: Role = "ranged";
    switch (className.toLowerCase()) {
        case "druid":
            return [t, h, m, r];
        case "paladin":
        case "monk":
            return [t, h, m];
        case "warrior":
        case "death knight":
        case "demon hunter":
            return [t, m];
        case "evoker":
        case "priest":
            return [h, r];
        case "shaman":
            return [h, m, r];
        case "rogue":
            return [m];
        case "hunter":
            return [r, m];
        case "warlock":
        case "mage":
            return [r];
        default:
            throw new Error("Unexpected class name: " + className);
    }
}
