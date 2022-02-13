import { ApiProperty } from "@nestjs/swagger";

export class RealmDto {
    constructor(options?: RealmDtoOptions) {
        if (options) {
            this.name = options.name;
            this.id = options.id;
            this.slug = options.slug;
        }
    }

    @ApiProperty({ maxLength: 128 })
    name: string;

    @ApiProperty()
    id: number;

    @ApiProperty({ maxLength: 128 })
    slug: string;
}

export interface RealmDtoOptions {
    name: string;
    id: number;
    slug: string;
}
