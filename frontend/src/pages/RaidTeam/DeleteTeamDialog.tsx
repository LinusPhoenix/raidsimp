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
import { RaidTeam, RaidTeamsApi } from "../../server";
import * as RRD from "react-router-dom";
import * as Routes from "../routes";

type Status =
    | { variant: "inputting" }
    | { variant: "awaitingResponse" }
    | { variant: "error"; messages: readonly string[] };

export interface DeleteTeamDialogProps {
    readonly handleClose: () => void;
    readonly team: RaidTeam;
    readonly isOpen: boolean;
}

export function DeleteTeamDialog({
    handleClose,
    team,
    isOpen,
}: DeleteTeamDialogProps): JSX.Element {
    const statusRef = React.useRef<Status>({ variant: "inputting" });
    const render = useForceRender();

    const history = RRD.useHistory();

    const deleteTeam = React.useCallback(async () => {
        if (statusRef.current.variant !== "inputting") {
            return;
        }
        statusRef.current = { variant: "awaitingResponse" };
        render();
        const response = await serverRequest((config) => {
            const client = new RaidTeamsApi(config);
            return client.raidTeamsControllerRemove({ id: team.id });
        });
        if (response.isOk) {
            statusRef.current = { variant: "inputting" };
            handleClose();
            history.push(Routes.raidTeams());
        } else {
            const { genericErrors } = response;
            statusRef.current = {
                variant: "error",
                messages: genericErrors,
            };
            render();
        }
    }, [statusRef, render, handleClose, history, team.id]);

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>
                Delete <em>{team.name}</em>?
            </DialogTitle>
            {statusRef.current.variant === "error" && (
                <DialogContent>
                    {statusRef.current.messages.map((x, idx) => (
                        <Typography key={idx} color={(t) => t.palette.error.main}>
                            {x}
                        </Typography>
                    ))}
                    <Divider sx={{ my: 2 }} />
                </DialogContent>
            )}
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                {statusRef.current.variant === "awaitingResponse" ? (
                    <Button variant="contained" color="danger">
                        <CircularProgress color="inherit" />
                    </Button>
                ) : (
                    <Button variant="contained" color="danger" onClick={deleteTeam}>
                        Delete
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
