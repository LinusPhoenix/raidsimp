import React from "react";
import { AdminApi } from "../server";
import { serverRequest } from "../utility";
import { useUserInfo } from "./UserInfoContext";

/** `null` while it is still being determined. */
export function useIsAdmin(): boolean | null {
    const userInfo = useUserInfo();
    const battletag = userInfo.type === "loaded" ? userInfo.data?.battletag : undefined;
    const [state, setState] = React.useState<{ battletag?: string; isAdmin: boolean } | null>(null);

    React.useEffect(() => {
        if (userInfo.type === "loading" || userInfo.type === "uninitialized") {
            return;
        }
        if (battletag === undefined) {
            setState({ battletag, isAdmin: false });
            return;
        }
        let cancelled = false;
        serverRequest((cfg) => new AdminApi(cfg).adminControllerIsAdmin()).then((result) => {
            if (!cancelled) {
                setState({ battletag, isAdmin: result.isOk && result.body });
            }
        });
        return () => {
            cancelled = true;
        };
    }, [userInfo.type, battletag]);

    // Ignore a result that belongs to a previously logged in user.
    return state !== null && state.battletag === battletag ? state.isAdmin : null;
}
