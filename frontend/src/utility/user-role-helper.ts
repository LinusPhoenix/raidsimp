import { RaidTeamUserRoleEnum } from "../server";

export class UserRoleHelper {
    public static isOwner(userRole: RaidTeamUserRoleEnum) {
        return userRole === RaidTeamUserRoleEnum.Owner;
    }

    public static canEdit(userRole: RaidTeamUserRoleEnum) {
        return userRole === RaidTeamUserRoleEnum.Owner || userRole === RaidTeamUserRoleEnum.Editor;
    }

    public static canView(userRole: RaidTeamUserRoleEnum) {
        return (
            userRole === RaidTeamUserRoleEnum.Owner ||
            userRole === RaidTeamUserRoleEnum.Editor ||
            userRole === RaidTeamUserRoleEnum.Viewer
        );
    }
}
