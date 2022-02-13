import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RegionName } from "blizzapi";
import { RealmDto } from "./dto/realm.dto";
import { RealmsService } from "./realms.service";

@ApiTags("realms")
@Controller("realms")
export class RealmsController {
    constructor(private readonly realmsService: RealmsService) {}

    @ApiOperation({ summary: "Get a list of realms in a region." })
    @ApiOkResponse({ type: RealmDto, isArray: true, description: "Realms of the given region." })
    @ApiBadRequestResponse({ description: "No such region exists." })
    @Get()
    async getAll(@Query("region") region: string): Promise<RealmDto[]> {
        if (!region) {
            throw new BadRequestException("Region query parameter not set.");
        }

        const blizzRegion = RegionName[region.toUpperCase()];
        if (!blizzRegion) {
            throw new BadRequestException(`Unknown region: ${region}.`);
        }

        return this.realmsService.findAll(blizzRegion);
    }
}
