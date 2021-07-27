import { ApiProperty } from "@nestjs/swagger";
import { MaxLength } from "class-validator";

export class CreateRaiderDto {
    @ApiProperty({ maxLength: 16 })
    @MaxLength(16)
    characterName: string;

    @ApiProperty({ maxLength: 128 })
    @MaxLength(128)
    realm: string;
}
