import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem, TextField, Typography } from "@material-ui/core";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthApi, UsersApi } from "../server";
import { User } from "../server/models/User";
import { serverRequest } from "../utility";
import { useCurrentUser } from "../utility/useCurrentUser";

type DialogOpen = "none" | "confirm";

export function UserInfo() {
    const history = useHistory();
    const location = useLocation();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = async () => {
        setAnchorEl(null);
        await serverRequest((cfg) => {
            const client = new AuthApi(cfg);
            return client.authControllerLogout();
        });
        reload();
        history.push("/login");
    };

    const [challengeAnswer, setChallengeAnswer] = React.useState("");
    const challengeComplete = challengeAnswer.toLowerCase() === "delete";
    const handleDeleteAccount = async () => {
        if (!challengeComplete) {
            return;
        }
        setAnchorEl(null);
        await serverRequest((cfg) => {
            const client = new UsersApi(cfg);
            return client.usersControllerDeleteUser();
        });
        reload();
        history.push("/login");
        setDialogOpen("none");
    };

    const [dialogOpen, setDialogOpen] = React.useState<DialogOpen>("none");
    const openConfirmDialog = React.useCallback(() => {
        setDialogOpen("confirm");
    }, [setDialogOpen]);

    const { data, reload } = useCurrentUser();

    React.useLayoutEffect(() => {
        if (!data.isOk && data.status === 401 && location.pathname !== "/login") {
            history.push("/login");
            reload();
        }
    }, [data, location.pathname]);

    if (!data.isOk) {
        return <></>;
    }
    const userInfo: User = data.body;

    const [name, id] = userInfo.battletag.split("#");

    return (
        <>
            <div>
                <Button
                    variant="text"
                    color="inherit"
                    onClick={handleClick}
                    style={{ textTransform: "none" }}
                >
                    <Typography variant="h6">{name}</Typography>
                    <Typography variant="h6" color={t => t.palette.secondary.dark}>#{id}</Typography>
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={openConfirmDialog}>Delete Account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </div>
            <Dialog open={dialogOpen === "confirm"} onClose={() => setDialogOpen("none")}>
                <DialogTitle>Delete your account?</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        This will delete your account and all raid teams you created. You can sign back in anytime, but your raid teams will be gone.
                    </Typography>
                    <Typography gutterBottom>
                        Write "DELETE" to proceed.
                    </Typography>
                    <TextField
                        autoFocus
                        value={challengeAnswer}
                        onChange={ev => setChallengeAnswer(ev.target.value.toUpperCase())}
                        variant="outlined"
                        size="small"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen("none")}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="danger"
                        onClick={handleDeleteAccount}
                        disabled={!challengeComplete}
                    >
                        Delete Account
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
