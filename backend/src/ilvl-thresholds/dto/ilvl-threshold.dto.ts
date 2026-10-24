import { ApiProperty } from "@nestjs/swagger";

export class IlvlThresholdDto {
    constructor(options?: IlvlThresholdDtoOptions) {
        if (options) {
            this.ilvl = options.ilvl;
            this.color = options.color;
            this.rarity = options.rarity;
        }
    }

    @ApiProperty({ description: "Minimum item level for this color." })
    ilvl: number;

    @ApiProperty({ maxLength: 7, description: "Hex color, e.g. #a335ee." })
    color: string;

    @ApiProperty({ maxLength: 32, description: "Item rarity this color belongs to, e.g. Epic." })
    rarity: string;
}

export interface IlvlThresholdDtoOptions {
    ilvl: number;
    color: string;
    rarity: string;
}
