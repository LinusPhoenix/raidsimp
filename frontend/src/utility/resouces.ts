import { ReactNode } from "react";
import { RaidTeamRegionEnum } from "../server";

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
