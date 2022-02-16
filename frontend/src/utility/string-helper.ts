export class StringHelper {
    /**
     * A regular expression for battletags, assuming the number at the end can be of arbitrary length.
     * This regexp explained: https://regex101.com/r/EC5eRN/1
     * BattleTag naming rules: https://eu.battle.net/support/en/article/700007
     *
     * @type RegExp
     */
    private static readonly BattletagRegex = new RegExp(
        "^[A-Za-zÀ-ÖØ-öø-ÿ][\\dA-Za-zÀ-ÖØ-öø-ÿ]{2,11}#\\d+$",
    );

    public static capitalizeFirstLetter(s: string): string {
        return s && s[0].toUpperCase() + s.slice(1);
    }

    public static isBattletag(s: string): boolean {
        return StringHelper.BattletagRegex.test(s);
    }
}
