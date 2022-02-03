import { Button, Link, Menu, MenuItem, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { AuthApi, UsersApi } from "../server";
import { User } from "../server/models/User";
import { serverRequest, usePromise } from "../utility";

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

export function UserInfo() {
    const history = useHistory();
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

    const { data, reload } = useData();
    if (!data.isOk) {
        return <></>;
    }
    const userInfo: User = data.body;

    return (
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
                <MenuItem onClick={handleClose}>Delete Account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
