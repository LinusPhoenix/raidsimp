export type IlvlThreshold = {
    ilvl: number;
    color: string;
};

// Colors above the highest threshold are not blended any further.
const TOP_THRESHOLD: IlvlThreshold = { ilvl: Infinity, color: "#ffffff" };

function withTop(thresholds: readonly IlvlThreshold[]): IlvlThreshold[] {
    return [...thresholds, TOP_THRESHOLD];
}

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

export function getIlvlColor(ilvl: number, thresholds: readonly IlvlThreshold[]): IlvlThreshold {
    return withTop(thresholds)
        .filter((threshold) => ilvl >= threshold.ilvl)
        .reduce((prev, current) => (prev.ilvl > current.ilvl ? prev : current), {
            ilvl: -Infinity,
            color: thresholds[0]?.color ?? TOP_THRESHOLD.color,
        });
}

export function getNextIlvlColor(
    ilvl: number,
    thresholds: readonly IlvlThreshold[],
): IlvlThreshold {
    return withTop(thresholds)
        .filter((threshold) => ilvl < threshold.ilvl)
        .reduce((prev, current) => (prev.ilvl < current.ilvl ? prev : current));
}

export function getIlvlColorGradiented(
    ilvl: number,
    thresholds: readonly IlvlThreshold[],
): { ilvl: number; color: string | undefined } {
    // Without thresholds there is nothing to color by; undefined falls back to the normal text color.
    if (thresholds.length === 0) {
        return { color: undefined, ilvl };
    }
    const baseColor = getIlvlColor(ilvl, thresholds);
    const targetColor = getNextIlvlColor(ilvl, thresholds);
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
