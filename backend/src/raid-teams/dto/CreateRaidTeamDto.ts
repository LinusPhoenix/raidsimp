import { IsEnum, Length } from "class-validator";
import { BlizzardRegion } from "src/commons/regions";

export class CreateRaidTeamDto {
    @Length(3, 128)
    name: string;

    @IsEnum(BlizzardRegion)
    region: BlizzardRegion;
}