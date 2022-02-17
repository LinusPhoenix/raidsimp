import { ReactNode } from "react";
import { RaidTeamRegionEnum, RaidTeamUserRoleEnum } from "../server";

export function regionData(region: RaidTeamRegionEnum): { flag: ReactNode; name: string } {
    switch (region) {
        case RaidTeamRegionEnum.Cn:
            return { flag: "🇨🇳", name: "The People's Republic of China" };
        case RaidTeamRegionEnum.Eu:
            return { flag: "🇪🇺", name: "Europe" };
        case RaidTeamRegionEnum.Kr:
            return { flag: "🇰🇷", name: "South Korea" };
        case RaidTeamRegionEnum.Tw:
            return { flag: "🇹🇼", name: "Taiwan" };
        case RaidTeamRegionEnum.Us:
            return { flag: "🇺🇸", name: "United States" };
        default:
            throw new Error("Unexpected region: " + region);
    }
}

export function userRole(r: RaidTeamUserRoleEnum): string {
    switch (r) {
        case RaidTeamUserRoleEnum.Editor:
            return "Editor";
        case RaidTeamUserRoleEnum.Owner:
            return "Owner";
        case RaidTeamUserRoleEnum.Viewer:
            return "Viewer";
        default:
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const n: never = r;
            throw new Error("Unexpected role: " + r);
    }
}
