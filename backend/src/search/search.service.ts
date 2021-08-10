import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { lastValueFrom } from 'rxjs';
import { BlizzardRegion } from "src/commons/blizzard-regions";
import { SearchResultDto, SearchResultDtoOptions } from "./dto/search-result.dto";

@Injectable()
export class SearchService {
    constructor(private httpService: HttpService) {}

    async search(region: BlizzardRegion, characterName: string): Promise<SearchResultDto[]> {
        var endpoint = `https://wowranks.io/api/public/character/find-character?characterName=${characterName}&region=${region}`;

        var searchResults: any = await lastValueFrom(this.httpService.get(endpoint));
        
        var transformedResults = searchResults.data.map((result: SearchResultDtoOptions) => {
            return new SearchResultDto(result);
        });

        return transformedResults;
    }
}