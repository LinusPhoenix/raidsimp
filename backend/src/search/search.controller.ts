import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BlizzardRegion } from "src/commons/blizzard-regions";
import { SearchResultDto } from "./dto/search-result.dto";
import { SearchService } from "./search.service";

@ApiTags("search")
@Controller("search")
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    async search(
        @Query("region") region: string,
        @Query("characterName") characterName: string
    ): Promise<SearchResultDto[]> {
        if (!region) {
            throw new BadRequestException("Region query parameter not set.")
        }

        if (!characterName) {
            throw new BadRequestException("Region query parameter not set.")
        }

        var blizzRegion: BlizzardRegion = BlizzardRegion[region.toUpperCase()];
        if (!blizzRegion) {
            throw new BadRequestException(`Unknown region: ${region}.`)
        }

        return this.searchService.search(blizzRegion, characterName);
    }
}