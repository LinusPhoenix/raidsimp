export class ColorHelper {
    public static getClassColor(className: string): string {
        switch(className) {
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
        switch(covenant) {
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
}