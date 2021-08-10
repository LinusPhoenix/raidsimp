import React from "react";
import { IconButton, TextField, Typography, Stack, CircularProgress } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import DoneIcon from "@material-ui/icons/Done";
import { useForceRender, serverRequest, ServerResult } from "../../utility";
import { RaidTeam, RaidTeamsApi } from "../../server";

type Status =
    | Readonly<{ variant: "displaying" }>
    | Readonly<{ variant: "inputting"; name: string }>
    | Readonly<{ variant: "awaitingResponse"; name: string }>
    | Readonly<{ variant: "error"; name: string; messages: readonly string[] }>;

export interface RenameTeamInputProps {
    readonly reload: () => void;
    readonly team: RaidTeam;
}

export function RenameTeamInput({ reload, team }: RenameTeamInputProps): JSX.Element {
    const statusRef = React.useRef<Status>({ variant: "displaying" });
    const forceRender = useForceRender();

    const startEdit = React.useCallback(() => {
        statusRef.current = { variant: "inputting", name: team.name };
        forceRender();
    }, [statusRef, team.name, forceRender]);

    const cancelEdit = React.useCallback(() => {
        statusRef.current = { variant: "displaying" };
        forceRender();
    }, [statusRef, forceRender]);

    const handleNameInput = React.useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            const st = statusRef.current;
            if (st.variant !== "inputting" && st.variant !== "error") {
                return;
            }
            statusRef.current = { variant: "inputting", name: ev.target.value };
            forceRender();
        },
        [statusRef, forceRender],
    );

    const changeName = React.useCallback(async () => {
        const st = statusRef.current;
        if (st.variant !== "inputting") {
            return;
        }
        statusRef.current = { variant: "awaitingResponse", name: st.name };
        forceRender();
        const response = await sendChangeName(team, st.name);
        if (response.isOk) {
            statusRef.current = { variant: "displaying" };
            reload();
        } else {
            statusRef.current = {
                variant: "error",
                name: st.name,
                messages: response.genericErrors.concat(
                    response.fieldErrors.map((x) => x.field + ": " + x.message),
                ),
            };
            reload();
        }
    }, [statusRef, team, forceRender, reload]);

    const status = statusRef.current;
    if (status.variant === "displaying") {
        return (
            <Stack direction="row" alignItems="center">
                <Typography variant="h6">
                    {team.region} - {team.name}
                </Typography>
                &nbsp;
                <IconButton onClick={startEdit}>
                    <EditIcon color="primary" />
                </IconButton>
            </Stack>
        );
    } else {
        const sameName = status.name.trim() === team.name;
        return (
            <Stack direction="column">
                {status.variant === "error" &&
                    status.messages.map((x) => (
                        <Typography color={(t) => t.palette.error.main}>{x}</Typography>
                    ))}
                <Stack direction="row" alignItems="center">
                    <Typography variant="h6">{team.region} - </Typography>
                    &nbsp;
                    <TextField
                        autoFocus
                        value={status.name}
                        onChange={handleNameInput}
                        disabled={status.variant === "awaitingResponse"}
                    />
                    &nbsp;
                    <IconButton
                        onClick={cancelEdit}
                        disabled={status.variant === "awaitingResponse"}
                    >
                        <CancelIcon />
                    </IconButton>
                    &nbsp;
                    <IconButton
                        onClick={changeName}
                        disabled={status.variant === "awaitingResponse" || sameName}
                    >
                        <DoneIcon />
                    </IconButton>
                    {status.variant === "awaitingResponse" && <CircularProgress />}
                </Stack>
            </Stack>
        );
    }
}

function sendChangeName(team: RaidTeam, newName: string): Promise<ServerResult<unknown>> {
    return serverRequest((cf) => {
        const api = new RaidTeamsApi(cf);
        return api.raidTeamsControllerRenameTeam({
            id: team.id,
            renameRaidTeamDto: {
                name: newName,
            },
        });
    });
}