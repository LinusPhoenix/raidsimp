import { ApiProperty } from "@nestjs/swagger";
import { RaiderRole } from "src/commons/raider-roles";

export class RaiderOverviewDto {
    @ApiProperty({ format: "uri" })
    avatarUrl: string;

    @ApiProperty({ maxLength: 16 })
    characterName: string;

    @ApiProperty({ maxLength: 128 })
    realm: string;

    @ApiProperty({ enum: RaiderRole })
    role: RaiderRole;

    @ApiProperty()
    class: string;

    @ApiProperty()
    spec: string;

    @ApiProperty({ format: "double", minimum: 0 })
    averageItemLevel: number;

    @ApiProperty({ nullable: true })
    covenant: string;

    @ApiProperty({ type: "integer", minimum: 0, nullable: true })
    renown: number;

    // TODO: Add data about enchants (full data or boolean whether anything is missing?)
    // TODO: Add lockout data.
}
