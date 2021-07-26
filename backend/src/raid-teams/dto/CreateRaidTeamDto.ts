import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, Length } from "class-validator";
import { BlizzardRegion } from "src/commons/regions";

export class CreateRaidTeamDto {
    @ApiProperty({ minLength: 3, maxLength: 128 })
    @Length(3, 128)
    name: string;

    @ApiProperty({ enum: BlizzardRegion })
    @IsEnum(BlizzardRegion)
    region: BlizzardRegion;
}
