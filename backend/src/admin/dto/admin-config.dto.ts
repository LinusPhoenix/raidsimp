import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
    ArrayMaxSize,
    IsArray,
    IsInt,
    IsString,
    Matches,
    MaxLength,
    Min,
    ValidateNested,
} from "class-validator";

export class AdminIlvlThresholdDto {
    @ApiProperty({ minimum: 0, description: "Minimum item level for this color." })
    @IsInt()
    @Min(0)
    ilvl: number;

    @ApiProperty({ maxLength: 7, description: "Hex color, e.g. #a335ee." })
    @Matches(/^#[0-9a-fA-F]{6}$/, { message: "color must be a hex color like #a335ee" })
    color: string;

    @ApiProperty({ maxLength: 32, description: "Item rarity this color belongs to, e.g. Epic." })
    @IsString()
    @MaxLength(32)
    rarity: string;

    @ApiProperty({ maxLength: 256, description: "What the threshold stands for." })
    @IsString()
    @MaxLength(256)
    description: string;
}

/** Everything that can be configured in the admin panel. */
export class AdminConfigDto {
    @ApiProperty({ type: AdminIlvlThresholdDto, isArray: true })
    @IsArray()
    @ArrayMaxSize(50)
    @ValidateNested({ each: true })
    @Type(() => AdminIlvlThresholdDto)
    ilvlThresholds: AdminIlvlThresholdDto[];
}
