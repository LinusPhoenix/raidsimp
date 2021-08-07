import { RaiderClass } from "src/commons/raider-classes";

export interface CharacterProfile {
    id: number;
    name: string;
    character_class: {
        name: RaiderClass;
        id: number;
    };
}
