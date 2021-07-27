import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
} from "@nestjs/common";
import {
    ApiConflictResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import { RaidersService } from "./raiders.service";
import { Raider } from "src/entities/raider.entity";
import { RaidTeamNotFoundException } from "src/commons/exceptions/raid-team-not-found.exception";
import { CreateRaiderDto } from "./dto/create-raider.dto";
import { RaiderAlreadyInRaidTeamException } from "src/commons/exceptions/raider-already-in-raid-team.exception";
import { BlizzAPI } from "blizzapi";
import { BlizzardRegion } from "src/commons/blizzard-regions";
import { RaiderNotFoundException } from "src/commons/exceptions/raider-not-found.exception.";
import { NoSuchCharacterException } from "src/commons/exceptions/no-such-character.exception";
import { RaiderOverviewDto } from "./dto/raider-overview.dto";
import { RaiderDetailsDto } from "./dto/raider-details.dto";

@ApiTags("raiders")
@Controller("raid-teams/:raidTeamId/raiders")
export class RaidersController {
    constructor(private readonly raidersService: RaidersService) {}

    @ApiOperation({ summary: "Add a raider to an existing raid team." })
    @ApiOkResponse({
        type: Raider,
        description: "The raider that was just added to the raid team with the given id.",
    })
    @ApiNotFoundResponse({
        description: "No raid team with the given id exists.",
    })
    @ApiConflictResponse({
        description: "This character is already in the raid team with the given id.",
    })
    @Post()
    async addRaiderToRaidTeam(
        @Param("raidTeamId") raidTeamId: string,
        @Body() createRaiderDto: CreateRaiderDto,
    ): Promise<Raider> {
        try {
            return await this.raidersService.add(raidTeamId, createRaiderDto);
        } catch (exception) {
            if (exception instanceof RaidTeamNotFoundException) {
                throw new NotFoundException(exception.message);
            } else if (exception instanceof RaiderAlreadyInRaidTeamException) {
                throw new ConflictException(exception.message);
            } else if (exception instanceof NoSuchCharacterException) {
                throw new BadRequestException(exception.message);
            } else {
                throw exception;
            }
        }
    }

    @ApiOperation({ summary: "Get all raiders of an existing raid team." })
    @ApiOkResponse({
        type: Raider,
        isArray: true,
        description: "All raiders of the raid team with the given id.",
    })
    @ApiNotFoundResponse({ description: "No raid team with the given id exists." })
    @Get()
    async GetRaiders(@Param("raidTeamId") raidTeamId: string): Promise<Raider[]> {
        try {
            return await this.raidersService.findAll(raidTeamId);
        } catch (exception) {
            if (exception instanceof RaidTeamNotFoundException) {
                throw new NotFoundException(exception.message);
            } else {
                throw exception;
            }
        }
    }

    @ApiOperation({ summary: "Get a specific raider of an existing raid team." })
    @ApiOkResponse({
        type: Raider,
        isArray: true,
        description: "All raiders of the raid team with the given id.",
    })
    @ApiNotFoundResponse({
        description: "No raid team with the given id or no raider with the given id exists.",
    })
    @Get(":raiderId")
    async GetRaider(
        @Param("raidTeamId") raidTeamId: string,
        @Param("raiderId") raiderId: string,
    ): Promise<Raider> {
        try {
            var raider: Raider = await this.raidersService.findOne(raidTeamId, raiderId);
            if (!raider) {
                throw new NotFoundException(
                    `No raider with id ${raiderId} exists in raid team ${raidTeamId}.`,
                );
            }
            return raider;
        } catch (exception) {
            if (exception instanceof RaidTeamNotFoundException) {
                throw new NotFoundException(exception.message);
            } else {
                throw exception;
            }
        }
    }

    @ApiOperation({ summary: "Remove a raider from an existing raid team." })
    @ApiOkResponse({ description: "Raider was successfully removed from the raid team." })
    @ApiNotFoundResponse({ description: "No raid team with the given id exists." })
    @Delete(":raiderId")
    async removeRaiderFromTeam(
        @Param("raidTeamId") raidTeamId: string,
        @Param("raiderId") raiderId: string,
    ): Promise<void> {
        try {
            await this.raidersService.remove(raidTeamId, raiderId);
        } catch (exception) {
            if (
                exception instanceof RaidTeamNotFoundException ||
                exception instanceof RaiderNotFoundException
            ) {
                throw new NotFoundException(exception.message);
            } else {
                throw exception;
            }
        }
    }

    @ApiOperation({ summary: "Get an overview of a raider's character." })
    @ApiOkResponse({
        type: RaiderOverviewDto,
        description: "An overview of the raider's character.",
    })
    @ApiNotFoundResponse({
        description: "No raid team with the given id or no raider with the given id exists.",
    })
    @Get(":raiderId/overview")
    async getOverview(
        @Param("raidTeamId") raidTeamId: string,
        @Param("raiderId") raiderId: string,
    ): Promise<RaiderOverviewDto> {
        try {
            return await this.raidersService.getOverview(raidTeamId, raiderId);
        } catch (exception) {
            if (
                exception instanceof RaidTeamNotFoundException ||
                exception instanceof RaiderNotFoundException
            ) {
                throw new NotFoundException(exception.message);
            } else {
                throw exception;
            }
        }
    }

    @ApiOperation({ summary: "Get a detailed view of a raider's character." })
    @ApiOkResponse({
        type: RaiderDetailsDto,
        description: "An overview of the raider's character.",
    })
    @ApiNotFoundResponse({
        description: "No raid team with the given id or no raider with the given id exists.",
    })
    @Get(":raiderId/details")
    async getDetails(
        @Param("raidTeamId") raidTeamId: string,
        @Param("raiderId") raiderId: string,
    ): Promise<RaiderDetailsDto> {
        try {
            return await this.raidersService.getDetails(raidTeamId, raiderId);
        } catch (exception) {
            if (
                exception instanceof RaidTeamNotFoundException ||
                exception instanceof RaiderNotFoundException
            ) {
                throw new NotFoundException(exception.message);
            } else {
                throw exception;
            }
        }
    }
}
