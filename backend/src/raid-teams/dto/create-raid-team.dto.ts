import { ApiProperty } from "@nestjs/swagger";
import { RegionNameEnum } from "blizzapi";
import { IsEnum, Length } from "class-validator";

export class CreateRaidTeamDto {
    @ApiProperty({ minLength: 3, maxLength: 128 })
    @Length(3, 128)
    name: string;

    @ApiProperty({ enum: RegionNameEnum })
    @IsEnum(RegionNameEnum)
    region: RegionNameEnum;
}
