import { HttpModule, HttpService } from "@nestjs/axios";
import { Test } from "@nestjs/testing";
import { SearchService } from "./search.service";
import { AxiosResponse } from "axios";
import { of } from "rxjs";
import { RegionName } from "blizzapi";
import { SearchResultDto } from "./dto/search-result.dto";

describe("SearchService", () => {
    let searchService: SearchService;
    let httpService: HttpService;

    const guildResult = {
        type: "guild",
        name: "guildName",
        data: {},
    };
    const euCharacterResult = {
        type: "character",
        name: "euCharacter",
        data: {
            class: {
                name: "className",
                slug: "classSlug",
            },
            name: "euCharacter",
            realm: {
                name: "realmName",
                slug: "realmSlug",
            },
            region: {
                name: "eu",
                slug: "eu",
            },
        },
    };
    const usCharacterResult = {
        type: "character",
        name: "usCharacter",
        data: {
            class: {
                name: "className",
                slug: "classSlug",
            },
            name: "usCharacter",
            realm: {
                name: "realmName",
                slug: "realmSlug",
            },
            region: {
                name: "us",
                slug: "us",
            },
        },
    };
    const results = [guildResult, euCharacterResult, usCharacterResult];
    const axiosMockResponse: AxiosResponse = {
        data: { matches: results },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
    };
    const expectedResult = new SearchResultDto({
        characterName: "euCharacter",
        realmName: "realmName",
        className: "className",
        guildName: "Not Implemented",
        characterLevel: 60,
    });

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HttpModule],
            providers: [SearchService],
        }).compile();

        searchService = moduleRef.get<SearchService>(SearchService);
        httpService = moduleRef.get<HttpService>(HttpService);
    });

    describe("search", () => {
        it("should return only character data from same region", async () => {
            jest.spyOn(httpService, "get").mockImplementation(() => of(axiosMockResponse));

            expect(await searchService.search(RegionName.eu, "doesnotmatter")).toStrictEqual([
                expectedResult,
            ]);
        });
    });
});
