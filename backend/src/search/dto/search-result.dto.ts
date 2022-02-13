import { ApiProperty } from "@nestjs/swagger";

export class SearchResultDto {
    constructor(options?: SearchResultDtoOptions) {
        if (options) {
            this.characterName = options.characterName;
            this.realmName = options.realmName;
            this.className = options.className;
            this.guildName = options.guildName;
            this.characterLevel = options.characterLevel;
        }
    }

    @ApiProperty({ maxLength: 16 })
    characterName: string;

    @ApiProperty({ maxLength: 128 })
    realmName: string;

    @ApiProperty({ maxLength: 16 })
    className: string;

    @ApiProperty({ maxLength: 24 })
    guildName: string;

    @ApiProperty()
    characterLevel: number;
}

export interface SearchResultDtoOptions {
    characterName: string;
    realmName: string;
    className: string;
    guildName: string;
    characterLevel: number;
}
