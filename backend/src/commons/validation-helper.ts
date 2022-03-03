import { RaiderClass } from "./raider-classes";
import { RaiderRole } from "./raider-roles";

export class ValidationHelper {
    private static readonly TANK_HEALER_MELEE: RaiderRole[] = [
        RaiderRole.Tank,
        RaiderRole.Healer,
        RaiderRole.Melee,
    ];
    private static readonly HEALER_MELEE_RANGED: RaiderRole[] = [
        RaiderRole.Healer,
        RaiderRole.Melee,
        RaiderRole.Ranged,
    ];
    private static readonly HEALER_RANGED: RaiderRole[] = [RaiderRole.Healer, RaiderRole.Ranged];
    private static readonly TANK_MELEE: RaiderRole[] = [RaiderRole.Tank, RaiderRole.Melee];
    private static readonly MELEE_RANGED: RaiderRole[] = [RaiderRole.Melee, RaiderRole.Ranged];

    public static canClassFulfillRole(_class: RaiderClass, role: RaiderRole): boolean {
        switch (_class) {
            case "Druid":
                return true;
            case "Paladin":
            case "Monk":
                return this.TANK_HEALER_MELEE.includes(role);
            case "Warrior":
            case "Death Knight":
            case "Demon Hunter":
                return this.TANK_MELEE.includes(role);
            case "Priest":
                return this.HEALER_RANGED.includes(role);
            case "Shaman":
                return this.HEALER_MELEE_RANGED.includes(role);
            case "Rogue":
                return RaiderRole.Melee === role;
            case "Hunter":
                return this.MELEE_RANGED.includes(role);
            case "Warlock":
            case "Mage":
                return RaiderRole.Ranged === role;
        }
    }
}
