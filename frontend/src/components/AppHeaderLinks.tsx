import { Stack, Typography } from "@mui/material";
import { Link } from "./Link";
import { useUserInfo } from "./UserInfoContext";
import { useIsAdmin } from "./useIsAdmin";

export function AppHeaderLinks() {
    const userInfo = useUserInfo();
    const isAdmin = useIsAdmin();
    if (userInfo.type === "loaded" && userInfo.data !== null) {
        return (
            <Stack direction="row" spacing={3}>
                <Link to="/raid-teams">
                    <Typography variant="h6">Teams</Typography>
                </Link>
                {isAdmin && (
                    <Link to="/admin">
                        <Typography variant="h6">Admin</Typography>
                    </Link>
                )}
            </Stack>
        );
    }
    return <></>;
}
