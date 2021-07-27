import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
} from "@nestjs/common";
import { ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { RaidersService } from "./raiders.service";
import { Raider } from "src/entities/raider.entity";
import { RaidTeamNotFoundException } from "src/commons/exceptions/raid-team-not-found.exception";
import { CreateRaiderDto } from "./dto/create-raider.dto";
import { RaiderAlreadyInRaidTeamException } from "src/commons/exceptions/raider-already-in-raid-team.exception";

@ApiTags("raiders")
@Controller("raid-teams/:raidTeamId/raiders")
export class RaidersController {
    constructor(private readonly raidersService: RaidersService) {}

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
            } else {
                throw exception;
            }
        }
    }

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
            if (exception instanceof RaidTeamNotFoundException) {
                throw new NotFoundException(exception.message);
            } else {
                throw exception;
            }
        }
    }
}
