import { RaiderClass } from "./raider-classes"
import { RaiderRole } from "./raider-roles"

export class ValidationHelper {
    private static readonly TANK_HEALER_MELEE: RaiderRole[] = [RaiderRole.Tank, RaiderRole.Healer, RaiderRole.Melee];
    private static readonly TANK_MELEE: RaiderRole[] = [RaiderRole.Tank, RaiderRole.Melee];
    private static readonly HEALER_RANGED: RaiderRole[] = [RaiderRole.Healer, RaiderRole.Ranged];
    

    public static canClassFulfillRole(_class: RaiderClass, role: RaiderRole): boolean {
        switch (_class) {
            case RaiderClass.Druid:
                return true;
            case RaiderClass.Paladin:
            case RaiderClass.Monk:
                return this.TANK_HEALER_MELEE.includes(role);
            case RaiderClass.Warrior:
            case RaiderClass.DeathKnight:
            case RaiderClass.DemonHunter:
                return this.TANK_MELEE.includes(role);
            case RaiderClass.Priest:
            case RaiderClass.Shaman:
                return this.HEALER_RANGED.includes(role);
            case RaiderClass.Rogue:
                return RaiderRole.Melee === role;
            case RaiderClass.Hunter:
            case RaiderClass.Warlock:
            case RaiderClass.Mage:
                return RaiderRole.Ranged === role;
        }
    }
}