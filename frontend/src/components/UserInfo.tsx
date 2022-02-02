import { Avatar, Typography } from "@material-ui/core";
import { UsersApi } from "../server";
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
    const { data } = useData();
    if (!data.isOk) {
        return <></>;
    }
    const userInfo: User = data.body;

    return <Typography variant="h6">{userInfo.battletag}</Typography>;
}
