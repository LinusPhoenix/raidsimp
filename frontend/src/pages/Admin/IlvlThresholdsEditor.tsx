import React from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AdminApi, AdminIlvlThresholdDto } from "../../server";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import { useReloadIlvlThresholds } from "../../components/IlvlThresholdsContext";
import { serverRequest } from "../../utility";
import * as Routes from "../routes";

// The ilvl is kept as a string while editing, so that it can be empty.
interface Row {
    readonly key: number;
    readonly ilvl: string;
    readonly color: string;
    readonly rarity: string;
    readonly description: string;
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

type Status =
    | { variant: "idle" }
    | { variant: "saving" }
    | { variant: "saved" }
    | { variant: "restored" }
    | { variant: "error"; messages: readonly string[] };

export interface IlvlThresholdsEditorProps {
    readonly initial: readonly AdminIlvlThresholdDto[];
}

export function IlvlThresholdsEditor({ initial }: IlvlThresholdsEditorProps): JSX.Element {
    const nextKey = React.useRef(0);
    const toRows = React.useCallback(
        (thresholds: readonly AdminIlvlThresholdDto[]): Row[] =>
            thresholds.map((threshold) => ({
                ...threshold,
                ilvl: "" + threshold.ilvl,
                key: nextKey.current++,
            })),
        [],
    );
    const [rows, setRows] = React.useState<readonly Row[]>(() => toRows(initial));
    const [status, setStatus] = React.useState<Status>({ variant: "idle" });
    const reloadThresholds = useReloadIlvlThresholds();
    const navigate = useNavigate();
    const [savedSnapshot, setSavedSnapshot] = React.useState(() => snapshot(toRows(initial)));
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const isDirty = snapshot(rows) !== savedSnapshot;
    const leave = () => navigate(Routes.raidTeams());

    const errors = validate(rows);

    const update = (key: number, change: Partial<Row>) => {
        setStatus({ variant: "idle" });
        setRows((rows) => rows.map((row) => (row.key === key ? { ...row, ...change } : row)));
    };
    const remove = (key: number) => {
        setStatus({ variant: "idle" });
        setRows((rows) => rows.filter((row) => row.key !== key));
    };
    const add = () => {
        setStatus({ variant: "idle" });
        setRows((rows) => [
            ...rows,
            { key: nextKey.current++, ilvl: "", color: "#ffffff", rarity: "", description: "" },
        ]);
    };

    const restoreDefaults = async () => {
        const response = await serverRequest((cfg) =>
            new AdminApi(cfg).adminControllerGetDefaultConfig(),
        );
        if (response.isOk) {
            setRows(toRows(response.body.ilvlThresholds));
            setStatus({ variant: "restored" });
        } else {
            setStatus({ variant: "error", messages: response.genericErrors });
        }
    };

    const save = async () => {
        setStatus({ variant: "saving" });
        const response = await serverRequest((cfg) =>
            new AdminApi(cfg).adminControllerUpdateConfig({
                adminConfigDto: {
                    ilvlThresholds: rows.map((row) => ({
                        ilvl: Number(row.ilvl),
                        color: row.color,
                        rarity: row.rarity,
                        description: row.description,
                    })),
                },
            }),
        );
        if (response.isOk) {
            const savedRows = toRows(response.body.ilvlThresholds);
            setRows(savedRows);
            setSavedSnapshot(snapshot(savedRows));
            setStatus({ variant: "saved" });
            reloadThresholds();
        } else {
            setStatus({ variant: "error", messages: response.genericErrors });
        }
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="h6">Item level colors</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Item levels at or above a threshold are displayed in its color, up to the
                        next threshold.
                    </Typography>
                </Box>
                <Button
                    onClick={restoreDefaults}
                    disabled={status.variant === "saving"}
                    title="Replace the values below with the defaults, without saving"
                >
                    Restore defaults
                </Button>
            </Stack>
            <Stack spacing={1.5} mt={2}>
                {rows.map((row) => (
                    <Stack key={row.key} direction="row" spacing={1} alignItems="center">
                        <TextField
                            label="Item level"
                            type="number"
                            size="small"
                            sx={{ width: 120 }}
                            value={row.ilvl}
                            onChange={(ev) => update(row.key, { ilvl: ev.target.value })}
                            error={errors.has(row.key)}
                            inputProps={{ min: 0 }}
                        />
                        <input
                            type="color"
                            aria-label="Pick color"
                            value={HEX_COLOR.test(row.color) ? row.color : "#ffffff"}
                            onChange={(ev) => update(row.key, { color: ev.target.value })}
                            style={{ width: 40, height: 40, border: 0, background: "none" }}
                        />
                        <TextField
                            label="Color"
                            size="small"
                            sx={{ width: 120 }}
                            value={row.color}
                            onChange={(ev) => update(row.key, { color: ev.target.value })}
                            error={!HEX_COLOR.test(row.color)}
                        />
                        <TextField
                            label="Rarity"
                            size="small"
                            sx={{ width: 160 }}
                            value={row.rarity}
                            onChange={(ev) => update(row.key, { rarity: ev.target.value })}
                            inputProps={{ maxLength: 32 }}
                        />
                        <TextField
                            label="Description"
                            size="small"
                            sx={{ flexGrow: 1 }}
                            value={row.description}
                            onChange={(ev) => update(row.key, { description: ev.target.value })}
                            inputProps={{ maxLength: 256 }}
                        />
                        <IconButton
                            title="Remove threshold"
                            onClick={() => remove(row.key)}
                            disabled={rows.length <= 1}
                        >
                            <Delete />
                        </IconButton>
                    </Stack>
                ))}
            </Stack>
            <Box mt={2}>
                <Button startIcon={<Add />} onClick={add}>
                    Add threshold
                </Button>
            </Box>
            {errors.size > 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Every threshold needs a distinct, non-negative whole item level and a color like
                    #a335ee.
                </Alert>
            )}
            {status.variant === "error" &&
                status.messages.map((message, idx) => (
                    <Alert key={idx} severity="error" sx={{ mt: 2 }}>
                        {message}
                    </Alert>
                ))}
            {status.variant === "saved" && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    Saved.
                </Alert>
            )}
            {status.variant === "restored" && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Defaults loaded. They only take effect once you save.
                </Alert>
            )}
            <Stack direction="row" spacing={1} mt={2}>
                <Button
                    variant="contained"
                    onClick={save}
                    disabled={status.variant === "saving" || errors.size > 0 || rows.length === 0}
                >
                    {status.variant === "saving" ? <CircularProgress size={24} /> : "Save"}
                </Button>
                <Button onClick={() => (isDirty ? setConfirmOpen(true) : leave())}>Cancel</Button>
            </Stack>
            <ConfirmationDialog
                isOpen={confirmOpen}
                title="Discard changes?"
                body="You have unsaved changes. If you leave now, they will be lost."
                okButtonText="Discard changes"
                performAction={leave}
                handleClose={() => setConfirmOpen(false)}
                isDeleteAction
            />
        </Paper>
    );
}

/** Comparable representation of the editable content. */
function snapshot(rows: readonly Row[]): string {
    return JSON.stringify(
        rows.map(({ ilvl, color, rarity, description }) => ({ ilvl, color, rarity, description })),
    );
}

/** Returns the keys of the rows that are invalid. */
function validate(rows: readonly Row[]): Set<number> {
    const invalid = new Set<number>();
    const seen = new Map<number, number>();
    for (const row of rows) {
        const ilvl = Number(row.ilvl);
        if (row.ilvl.trim() === "" || !Number.isInteger(ilvl) || ilvl < 0) {
            invalid.add(row.key);
        } else if (seen.has(ilvl)) {
            invalid.add(row.key);
            invalid.add(seen.get(ilvl) as number);
        } else {
            seen.set(ilvl, row.key);
        }
        if (!HEX_COLOR.test(row.color)) {
            invalid.add(row.key);
        }
    }
    return invalid;
}
