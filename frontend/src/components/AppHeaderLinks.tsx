import { Link } from "./Link";
import { useUserInfo } from "./UserInfoContext";

export function AppHeaderLinks() {
    const userInfo = useUserInfo();
    if (userInfo.type === "loaded" && userInfo.data !== null) {
        return <Link to="/raid-teams">Teams</Link>
    }
    return <></>
}