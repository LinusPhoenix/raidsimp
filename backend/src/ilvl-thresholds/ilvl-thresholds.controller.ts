import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/public.decorator";
import { IlvlThresholdDto } from "./dto/ilvl-threshold.dto";
import { IlvlThresholdsService } from "./ilvl-thresholds.service";

@ApiTags("ilvl-thresholds")
@Controller("ilvl-thresholds")
export class IlvlThresholdsController {
    constructor(private readonly ilvlThresholdsService: IlvlThresholdsService) {}

    @ApiOperation({ summary: "Get the item level color thresholds, sorted by item level." })
    @ApiOkResponse({ type: IlvlThresholdDto, isArray: true, description: "All thresholds." })
    @Public()
    @Get()
    async getAll(): Promise<IlvlThresholdDto[]> {
        return this.ilvlThresholdsService.findAll();
    }
}
