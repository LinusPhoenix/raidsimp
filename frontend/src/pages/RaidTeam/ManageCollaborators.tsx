import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from "@material-ui/core";
import { Delete, ManageAccounts, AddCircle, ArrowDownward, ArrowUpward } from "@material-ui/icons";
import React from "react";
import {
    Collaborator,
    CollaboratorDtoRoleEnum,
    CollaboratorRoleEnum,
    RaidTeam,
    RaidTeamsApi,
} from "../../server";
import { serverRequest, usePromise } from "../../utility";
import { StringHelper } from "../../utility/string-helper";

function useCollaborators(teamId: string) {
    return usePromise(
        "RaidTeam_collaborators_get " + teamId,
        () => {
            return serverRequest((cfg) =>
                new RaidTeamsApi(cfg).raidTeamsControllerGetCollaborators({
                    id: teamId,
                }),
            );
        },
        [teamId],
    );
}

export interface ManageCollaboratorsProps {
    readonly team: RaidTeam;
}
export function ManageCollaborators({ team }: ManageCollaboratorsProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpen}
                title="Share with Others"
            >
                <ManageAccounts />
            </Button>
            <Dialog open={isOpen} onClose={handleClose}>
                <DialogTitle>
                    Share {team.name} ({team.region.toUpperCase()})
                </DialogTitle>
                <DialogContent>
                    <React.Suspense fallback={<CircularProgress size="4rem" />}>
                        <ManageCollaboratorsInner team={team} />
                    </React.Suspense>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

function roleToText(r: CollaboratorRoleEnum): string {
    switch (r) {
        case CollaboratorRoleEnum.Editor:
            return "Editor";
        case CollaboratorRoleEnum.Viewer:
            return "Viewer";
        default:
            throw new Error("Unexpected role: " + r);
    }
}

interface ManageCollaboratorsInnerProps {
    readonly team: RaidTeam;
}
function ManageCollaboratorsInner({ team }: ManageCollaboratorsInnerProps) {
    const { data, reload } = useCollaborators(team.id);
    if (!data.isOk) {
        throw data;
    }

    const addCollab = async (btag: string, role: CollaboratorDtoRoleEnum) => {
        if (isAwaiting) {
            return;
        }
        setIsAwaiting(true);
        await serverRequest((cfg) =>
            new RaidTeamsApi(cfg).raidTeamsControllerPutCollaborator({
                collaboratorDto: { role },
                id: team.id,
                battletag: btag,
            }),
        );
        setInputBtag("");
        setIsAwaiting(false);
        reload();
    };

    const removeCollab = async (c: Collaborator) => {
        if (isAwaiting) {
            return;
        }
        setIsAwaiting(true);
        await serverRequest((cfg) =>
            new RaidTeamsApi(cfg).raidTeamsControllerDeleteCollaborator({
                id: team.id,
                battletag: c.battletag,
            }),
        );
        setIsAwaiting(false);
        reload();
    };

    const sortedCollab: Collaborator[] = React.useMemo(
        () => data.body.slice().sort((l, r) => l.displayName.localeCompare(r.displayName)),
        [data.body],
    );

    const [inputBtag, setInputBtag] = React.useState("");
    const [isAwaiting, setIsAwaiting] = React.useState(false);

    return (
        <>
            <List dense>
                {sortedCollab.map((c) => {
                    const [name, id] = c.displayName.split("#");
                    const isEditor = c.role === CollaboratorRoleEnum.Editor;
                    return (
                        <ListItem
                            key={c.battletag}
                            secondaryAction={
                                <>
                                    {isEditor ? (
                                        <IconButton
                                            size="large"
                                            onClick={() =>
                                                addCollab(
                                                    c.battletag,
                                                    CollaboratorDtoRoleEnum.Viewer,
                                                )
                                            }
                                            title={`Demote ${c.battletag} to viewer`}
                                            sx={{ mr: 1 }}
                                        >
                                            <ArrowDownward />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            size="large"
                                            onClick={() =>
                                                addCollab(
                                                    c.battletag,
                                                    CollaboratorDtoRoleEnum.Editor,
                                                )
                                            }
                                            title={`Promote ${c.battletag} to editor`}
                                            sx={{ mr: 1 }}
                                        >
                                            <ArrowUpward />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        size="large"
                                        onClick={() => removeCollab(c)}
                                        title={`Remove ${c.battletag}`}
                                    >
                                        <Delete />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText
                                primary={
                                    <Box display="flex" flexDirection="row">
                                        <Typography>{name}</Typography>
                                        <Typography color="secondary">#{id}</Typography>
                                    </Box>
                                }
                                secondary={roleToText(c.role)}
                            />
                        </ListItem>
                    );
                })}
                <ListItem
                    secondaryAction={
                        <IconButton
                            size="large"
                            onClick={() => addCollab(inputBtag, CollaboratorDtoRoleEnum.Viewer)}
                            title="Add battletag"
                            disabled={isAwaiting || !StringHelper.isBattletag(inputBtag)}
                        >
                            <AddCircle />
                        </IconButton>
                    }
                >
                    <Box mr={2}>
                        <TextField
                            label="Battletag"
                            value={inputBtag}
                            error={inputBtag.length >= 3 && !StringHelper.isBattletag(inputBtag)}
                            onChange={(ev) => setInputBtag(ev.target.value)}
                            sx={{ mr: 2 }}
                        />
                    </Box>
                </ListItem>
            </List>
        </>
    );
}
