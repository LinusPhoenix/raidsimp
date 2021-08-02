import React from "react";
import {
    Button,
    Divider,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from "@material-ui/core";
import { useForceRender, serverRequest } from "../../utility";
import { RaidTeam, Raider, RaidersApi } from "../../server";

type CreationStatus =
    | { variant: "inputting" }
    | { variant: "creating" }
    | { variant: "error"; messages: readonly string[] };

export interface RemoveRaiderDialogProps {
    readonly handleClose: () => void;
    readonly reload: () => void;
    readonly team: RaidTeam;
    readonly raider: Raider | null;
}

export function RemoveRaiderDialog({
    handleClose,
    reload,
    team,
    raider,
}: RemoveRaiderDialogProps): JSX.Element {
    const isOpen = raider !== null;
    const statusRef = React.useRef<CreationStatus>({ variant: "inputting" });
    const render = useForceRender();

    const removeRaider = React.useCallback(async () => {
        if (raider == null) {
            return;
        }
        if (statusRef.current.variant !== "inputting") {
            return;
        }
        statusRef.current = { variant: "creating" };
        render();
        const response = await serverRequest((config) => {
            const client = new RaidersApi(config);
            return client.raidersControllerRemoveRaiderFromTeam({
                raidTeamId: team.id,
                raiderId: raider.id,
            });
        });
        if (response.isOk) {
            statusRef.current = { variant: "inputting" };
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
    }, [statusRef, render, reload, handleClose, team.id, raider]);

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>
                Remove <i>{raider?.characterName ?? "raider"}</i> from <i>{team.name}</i>?
            </DialogTitle>
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
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                {statusRef.current.variant === "creating" ? (
                    <Button variant="contained" color="primary">
                        <CircularProgress color="inherit" />
                    </Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={removeRaider}>
                        Remove
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
