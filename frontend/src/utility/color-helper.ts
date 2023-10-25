import { CurrentTierConfiguration } from "../config/current-tier-config";

type IlvlThreshold = {
    ilvl: number;
    color: string;
};

const thresholds: IlvlThreshold[] = [
    {
        ilvl: 0,
        color: "#9d9d9d",
    },
    {
        ilvl: CurrentTierConfiguration.NormalIlvl,
        color: "#1eff00",
    },
    {
        ilvl: CurrentTierConfiguration.HeroicIlvl,
        color: "#0070dd",
    },
    {
        ilvl: CurrentTierConfiguration.TopHeroicIlvl,
        color: "#a335ee",
    },
    {
        ilvl: CurrentTierConfiguration.MythicIlvl,
        color: "#ff8000",
    },
    {
        ilvl: CurrentTierConfiguration.TopMythicIlvl,
        color: "#e6cc80",
    },
    {
        ilvl: Infinity,
        color: "#ffffff",
    },
];

export function getClassColor(className: string): string {
    switch (className) {
        case "Death Knight":
            return "#C41E3A";
        case "Demon Hunter":
            return "#A330C9";
        case "Druid":
            return "#FF7C0A";
        case "Evoker":
            return "#33937F";
        case "Hunter":
            return "#AAD372";
        case "Mage":
            return "#3FC7EB";
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

export function getCovenantColor(covenant: string): string {
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

export function getIlvlColor(ilvl: number): IlvlThreshold {
    return thresholds
        .filter((threshold) => ilvl >= threshold.ilvl)
        .reduce((prev, current) => (prev.ilvl > current.ilvl ? prev : current));
}

export function getNextIlvlColor(ilvl: number): IlvlThreshold {
    return thresholds
        .filter((threshold) => ilvl < threshold.ilvl)
        .reduce((prev, current) => (prev.ilvl < current.ilvl ? prev : current));
}

export function getIlvlColorGradiented(ilvl: number): IlvlThreshold {
    const baseColor = getIlvlColor(ilvl);
    const targetColor = getNextIlvlColor(ilvl);
    const shadePercentage = (ilvl - baseColor.ilvl) / (targetColor.ilvl - baseColor.ilvl);
    const shade = getShade(baseColor.color, targetColor.color, shadePercentage);
    return { color: shade, ilvl };
}

function getShade(baseColor: string, targetColor: string, shadePercentage: number) {
    const baseShade = {
        r: parseInt(baseColor.substring(1, 3), 16),
        g: parseInt(baseColor.substring(3, 5), 16),
        b: parseInt(baseColor.substring(5, 7), 16),
    };
    const targetShade = {
        r: parseInt(targetColor.substring(1, 3), 16),
        g: parseInt(targetColor.substring(3, 5), 16),
        b: parseInt(targetColor.substring(5, 7), 16),
    };
    const calculatedShade = {
        r: Math.round(baseShade.r - (baseShade.r - targetShade.r) * shadePercentage),
        g: Math.round(baseShade.g - (baseShade.g - targetShade.g) * shadePercentage),
        b: Math.round(baseShade.b - (baseShade.b - targetShade.b) * shadePercentage),
    };
    return `#${calculatedShade.r.toString(16).padStart(2, "0")}${calculatedShade.g
        .toString(16)
        .padStart(2, "0")}${calculatedShade.b.toString(16).padStart(2, "0")}`;
}

export function getLockoutColor(bossesKilled: number, bossesTotal: number): string {
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
