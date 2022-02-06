import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { BlizzardRegion } from "src/commons/blizzard-regions";
import { SearchResultDto } from "./dto/search-result.dto";

interface RaiderIoSearchResult {
    matches: {
        type: string;
        name: string;
        data: any;
    }[];
}

interface RaiderIoCharacterData {
    class: {
        name: string;
        slug: string;
    };
    name: string;
    realm: {
        name: string;
        slug: string;
    };
    region: {
        name: string;
        slug: string;
    };
}

@Injectable()
export class SearchService {
    constructor(private httpService: HttpService) {}

    async search(region: BlizzardRegion, characterName: string): Promise<SearchResultDto[]> {
        const endpoint = `https://raider.io/api/search?term=${characterName}`;

        const searchResults = (await (
            await lastValueFrom(this.httpService.get(endpoint))
        ).data) as RaiderIoSearchResult;

        const characterResults = searchResults.matches
            .filter((match) => match.type === "character")
            .filter((match) => match.data.region.slug === region);

        const transformedResults: SearchResultDto[] = characterResults.map((character) => {
            const data = character.data as RaiderIoCharacterData;
            return new SearchResultDto({
                characterName: data.name,
                realmName: data.realm.name,
                className: data.class.name,
                guildName: "Not Implemented",
                characterLevel: 60,
            });
        });

        return transformedResults;
    }
}
