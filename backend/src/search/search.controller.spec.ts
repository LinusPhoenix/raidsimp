import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { Test } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { SearchResultDto } from "./dto/search-result.dto";

describe("SearchController", () => {
    let searchController: SearchController;
    let searchService: SearchService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HttpModule],
            controllers: [SearchController],
            providers: [SearchService],
        }).compile();

        searchService = moduleRef.get<SearchService>(SearchService);
        searchController = moduleRef.get<SearchController>(SearchController);
    });

    describe("search", () => {
        it("should throw BadRequestException if query parameter 'region' is not set", async () => {
            await expect(searchController.search(null, "characterName")).rejects.toThrow(
                BadRequestException,
            );
        });
        it("should throw BadRequestException if query parameter 'characterName' is not set", async () => {
            await expect(searchController.search("eu", null)).rejects.toThrow(BadRequestException);
        });
        it("should throw BadRequestException if region is not a valid value", async () => {
            await expect(searchController.search("region", null)).rejects.toThrow(
                BadRequestException,
            );
        });
        it("should return the list of search results", async () => {
            const results = [
                new SearchResultDto({
                    characterName: "characterName",
                    realmName: "realmName",
                    className: "className",
                    guildName: "guildName",
                    characterLevel: 60,
                }),
            ];
            jest.spyOn(searchService, "search").mockImplementation(async () => results);

            expect(await searchController.search("eu", "characterName")).toBe(results);
        });
    });
});
