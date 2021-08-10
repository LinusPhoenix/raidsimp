import { ApiProperty } from "@nestjs/swagger";

export class SearchResultDto {
    constructor(options?: SearchResultDtoOptions) {
        if (options) {
            this.characterName = options.characterName;
            this.realmName = options.realmName;
        }
    }

    @ApiProperty({ maxLength: 16 })
    characterName: string;

    @ApiProperty({ maxLength: 128 })
    realmName: string;
}

export interface SearchResultDtoOptions {
    characterName: string;
    realmName: string;
}