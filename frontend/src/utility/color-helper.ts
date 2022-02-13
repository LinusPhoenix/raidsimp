import { CurrentTierConfiguration } from "../config/current-tier-config";

export class ColorHelper {
    public static getClassColor(className: string): string {
        switch (className) {
            case "Death Knight":
                return "#C41E3A";
            case "Demon Hunter":
                return "#A330C9";
            case "Druid":
                return "#FF7C0A";
            case "Hunter":
                return "#AAD372";
            case "Mage":
                return "#3fC7EB";
            case "Monk":
                return "#00FF98";
            case "Paladin":
                return "#F48CBA";
            case "Priest":
                return "#FFFFFF";
            case "Rogue":
                return "#FFF468";
            case "Shaman":
                return "#0070DD";
            case "Warlock":
                return "#8788EE";
            case "Warrior":
                return "#C69B6D";
            default:
                return "";
        }
    }

    public static getCovenantColor(covenant: string): string {
        switch (covenant) {
            case "Kyrian":
                return "#68ccef";
            case "Night Fae":
                return "#a330c9";
            case "Necrolord":
                return "#40bf40";
            case "Venthyr":
                return "#ff4040";
            default:
                return "";
        }
    }

    public static getIlvlColor(ilvl: number): string {
        if (ilvl >= CurrentTierConfiguration.TopMythicIlvl) {
            return "#e6cc80";
        } else if (ilvl >= CurrentTierConfiguration.MythicIlvl) {
            return "#ff8000";
        } else if (ilvl >= CurrentTierConfiguration.TopHeroicIlvl) {
            return "#a335ee";
        } else if (ilvl >= CurrentTierConfiguration.HeroicIlvl) {
            return "#0070dd";
        } else if (ilvl >= CurrentTierConfiguration.NormalIlvl) {
            return "#1eff00";
        } else {
            return "#9d9d9d";
        }
    }

    public static getLockoutColor(bossesKilled: number, bossesTotal: number): string {
        const ratioCompleted = bossesKilled / bossesTotal;
        if (bossesKilled === bossesTotal) {
            return "#ff8000";
        } else if (ratioCompleted >= 0.9) {
            return "#a335ee";
        } else if (ratioCompleted >= 0.5) {
            return "#0070dd";
        } else if (ratioCompleted >= 0.1) {
            return "#1eff00";
        } else {
            return "#ffffff";
        }
    }
}
