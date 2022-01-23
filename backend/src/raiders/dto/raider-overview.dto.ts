import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { RaiderRole } from "src/commons/raider-roles";
import { RaidLockout } from "./lockout/raid-lockout.dto";

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

    @ApiPropertyOptional()
    covenant?: string;

    @ApiPropertyOptional({ type: "integer", minimum: 0 })
    renown?: number;

    @ApiPropertyOptional()
    currentLockout?: RaidLockout;

    @ApiProperty({ format: "date-time" })
    refreshedAt: Date;
    // TODO: Add data about enchants (full data or boolean whether anything is missing?)
}
