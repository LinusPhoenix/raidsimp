import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export class RenameRaidTeamDto {
    @ApiProperty({ minLength: 3, maxLength: 128 })
    @Length(3, 128)
    name: string;
}
