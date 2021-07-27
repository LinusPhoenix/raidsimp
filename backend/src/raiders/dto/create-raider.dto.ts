import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, MaxLength } from "class-validator";
import { RaiderRole } from "src/commons/raider-roles";

export class CreateRaiderDto {
    @ApiProperty({ maxLength: 16 })
    @MaxLength(16)
    characterName: string;

    @ApiProperty({ maxLength: 128 })
    @MaxLength(128)
    realm: string;

    @ApiProperty({ enum: RaiderRole })
    @IsEnum(RaiderRole)
    role: RaiderRole;
}
