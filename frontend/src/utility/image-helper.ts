export class ImageHelper {
    public static getClassIconPath(className: string): string {
        return "/classes/classicon_" + className.toLowerCase().replaceAll(" ", "_") + ".png";
    }

    public static getSpecIconPath(className: string, specName: string): string {
        return "/specs/specicon_" + className.toLowerCase().replaceAll(" ", "_") + "_" + specName.toLowerCase().replaceAll("\\s+", "_") + ".jpg";
    }
}