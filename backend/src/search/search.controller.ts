import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegionName } from "blizzapi";
import { SearchResultDto } from "./dto/search-result.dto";
import { SearchService } from "./search.service";

@ApiTags("search")
@Controller("search")
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @ApiOperation({ summary: "Search for WoW characters in a region." })
    @ApiOkResponse({ type: SearchResultDto, isArray: true, description: "Search results" })
    @ApiBadRequestResponse({ description: "No such region exists." })
    @Get()
    async search(
        @Query("region") region: string,
        @Query("characterName") characterName: string,
    ): Promise<SearchResultDto[]> {
        if (!region) {
            throw new BadRequestException("Region query parameter not set.");
        }

        if (!characterName) {
            throw new BadRequestException("Region query parameter not set.");
        }

        const blizzRegion = RegionName[region.toLowerCase()];
        if (!blizzRegion) {
            throw new BadRequestException(`Unknown region: ${region}.`);
        }

        return this.searchService.search(blizzRegion, characterName);
    }
}
