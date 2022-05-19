import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Menu,
    MenuItem,
    TextField,
    Typography,
} from "@material-ui/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthApi, UsersApi } from "../server";
import { User } from "../server/models/User";
import { serverRequest } from "../utility";
import { Link } from "./Link";
import { useUserInfo, useUserInfoActions } from "./UserInfoContext";

type DialogOpen = "none" | "confirm";

export function UserInfo() {
    const navigate = useNavigate();

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
        await serverRequest((cfg) => new AuthApi(cfg).authControllerLogout());
        userInfoActions.reload();
        navigate("/");
    };

    const [challengeAnswer, setChallengeAnswer] = React.useState("");
    const challengeComplete = challengeAnswer.toLowerCase() === "delete";
    const handleDeleteAccount = async () => {
        if (!challengeComplete) {
            return;
        }
        setAnchorEl(null);
        await serverRequest((cfg) => new UsersApi(cfg).usersControllerDeleteUser());
        userInfoActions.reload();
        navigate("/login");
        setDialogOpen("none");
    };

    const [dialogOpen, setDialogOpen] = React.useState<DialogOpen>("none");
    const openConfirmDialog = React.useCallback(() => {
        setDialogOpen("confirm");
    }, [setDialogOpen]);

    const userInfoObj = useUserInfo();
    const userInfoActions = useUserInfoActions();

    if (userInfoObj.type === "loading") {
        return <></>;
    }
    if (userInfoObj.type !== "loaded" || userInfoObj.data == null) {
        return (
            <Link to="/login">
                <Button variant="outlined" size="medium">
                    Login
                </Button>
            </Link>
        );
    }
    const userInfo: User = userInfoObj.data;

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
                    <Typography variant="h6" color={(t) => t.palette.secondary.dark}>
                        #{id}
                    </Typography>
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
                        This will delete your account and all raid teams you created. You can sign
                        back in anytime, but your raid teams will be gone.
                    </Typography>
                    <Typography gutterBottom>Write "DELETE" to proceed.</Typography>
                    <TextField
                        autoFocus
                        value={challengeAnswer}
                        onChange={(ev) => setChallengeAnswer(ev.target.value.toUpperCase())}
                        variant="outlined"
                        size="small"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen("none")}>Cancel</Button>
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
