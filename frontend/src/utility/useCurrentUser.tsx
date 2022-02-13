import { UsersApi, User } from "../server";
import { Data, usePromise } from "./usePromise";
import { serverRequest, ServerResult } from "./server";

/*
 * Returns information about the currently logged in user.
 *
 * The server request is sent lazily by the first component to invoke it, and the result is cached.
 */
export function useCurrentUser(): Data<ServerResult<User>> {
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
