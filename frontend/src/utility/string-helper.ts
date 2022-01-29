export class StringHelper {
    public static capitalizeFirstLetter(s: string): string {
        return s && s[0].toUpperCase() + s.slice(1);
    }
}
