import { Button, Link, Menu, MenuItem, Typography } from "@material-ui/core";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthApi, UsersApi } from "../server";
import { User } from "../server/models/User";
import { serverRequest, usePromise } from "../utility";
import { ConfirmationDialog } from "./ConfirmationDialog";

function useData() {
    return usePromise(
        "Users_get",
        () => {
            return serverRequest((cfg) => {
                const client = new UsersApi(cfg);
                return client.usersControllerGetUserInfo();
            });
        },
        [],
    );
}

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
    const handleLogout = () => {
        setAnchorEl(null);
        serverRequest((cfg) => {
            const client = new AuthApi(cfg);
            return client.authControllerLogout();
        }).then(() => {
            history.push("/");
            reload();
        });
    };
    const handleDeleteAccount = () => {
        setAnchorEl(null);
        serverRequest((cfg) => {
            const client = new UsersApi(cfg);
            return client.usersControllerDeleteUser();
        }).then(() => {
            history.push("/");
            reload();
        });
    };

    const [dialogOpen, setDialogOpen] = React.useState<DialogOpen>("none");
    const openConfirmDialog = React.useCallback(() => {
        setDialogOpen("confirm");
    }, [setDialogOpen]);
    const closeDialog = React.useCallback(() => {
        setDialogOpen("none");
    }, [setDialogOpen]);

    const { data, reload } = useData();

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

    return (
        <>
            <div>
                <Button
                    variant="text"
                    color="inherit"
                    onClick={handleClick}
                    style={{ textTransform: "none" }}
                >
                    <Typography variant="h6">{userInfo.battletag}</Typography>
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <MenuItem onClick={openConfirmDialog}>Delete Account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </div>
            <ConfirmationDialog
                title="Delete your account?"
                body="This will delete your account and all raid teams you created. You can sign back in anytime, but your raid teams will be gone."
                okButtonText="Delete Account"
                performAction={handleDeleteAccount}
                handleClose={closeDialog}
                isOpen={dialogOpen === "confirm"}
                isDeleteAction={true}
            />
        </>
    );
}
