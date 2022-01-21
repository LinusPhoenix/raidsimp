import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
} from "@nestjs/common";
import { RaidTeam } from "src/entities/raid-team.entity";
import { RaidTeamsService } from "./raid-teams.service";
import { CreateRaidTeamDto } from "./dto/create-raid-team.dto";
import { NameConflictException } from "src/commons/exceptions/name-conflict.exception";
import {
    ApiBody,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from "@nestjs/swagger";
import { RenameRaidTeamDto } from "./dto/rename-raid-team.dto";
import { RaidTeamNotFoundException } from "src/commons/exceptions/raid-team-not-found.exception";

@ApiTags("raid-teams")
@Controller("raid-teams")
export class RaidTeamsController {
    constructor(private readonly raidTeamsService: RaidTeamsService) {}

    @ApiOperation({ summary: "Create a new raid team." })
    @ApiBody({ type: CreateRaidTeamDto })
    @ApiCreatedResponse({ type: RaidTeam, description: "The newly created RaidTeam object." })
    @ApiConflictResponse({ description: "A raid team with the given name already exists." })
    @Post()
    async create(@Body() createRaidTeamDto: CreateRaidTeamDto): Promise<RaidTeam> {
        try {
            return await this.raidTeamsService.create(createRaidTeamDto);
        } catch (exception) {
            if (exception instanceof NameConflictException) {
                throw new ConflictException(exception.message);
            } else {
                throw exception;
            }
        }
    }

    @ApiOperation({ summary: "Get all existing raid teams." })
    @ApiOkResponse({ type: RaidTeam, isArray: true, description: "All existing RaidTeam objects." })
    @Get()
    getAll(): Promise<RaidTeam[]> {
        return this.raidTeamsService.findAll();
    }

    @ApiOperation({ summary: "Get a specific raid team." })
    @ApiOkResponse({ type: RaidTeam, description: "The RaidTeam object with the given id." })
    @ApiNotFoundResponse({ description: "No raid team with the given id exists." })
    @ApiForbiddenResponse({ description: "You do not have access to this raid team." })
    @Get(":id")
    async getOne(@Param("id") id: string): Promise<RaidTeam> {
        const raidTeam = await this.raidTeamsService.findOne(id);
        if (raidTeam) {
            return raidTeam;
        } else {
            throw new NotFoundException(`No raid team with id ${id} exists.`);
        }
    }

    @ApiOperation({ summary: "Rename an existing raid team." })
    @ApiOkResponse({
        type: RaidTeam,
        description: "The renamed RaidTeam object with the given id.",
    })
    @ApiNotFoundResponse({ description: "No raid team with the given id exists." })
    @ApiConflictResponse({ description: "A raid team with the given name already exists." })
    @Patch(":id")
    async renameTeam(
        @Param("id") id: string,
        @Body() renameRaidTeamDto: RenameRaidTeamDto,
    ): Promise<RaidTeam> {
        try {
            return await this.raidTeamsService.rename(id, renameRaidTeamDto.name);
        } catch (exception) {
            if (exception instanceof RaidTeamNotFoundException) {
                throw new NotFoundException(exception.message);
            } else if (exception instanceof NameConflictException) {
                throw new ConflictException(exception.message);
            } else {
                throw exception;
            }
        }
    }

    @ApiOperation({ summary: "Delete a raid team." })
    @Delete(":id")
    async remove(@Param("id") id: string): Promise<void> {
        try {
            await this.raidTeamsService.remove(id);
        } catch (exception) {
            if (exception instanceof RaidTeamNotFoundException) {
                throw new NotFoundException(exception.message);
            } else {
                throw exception;
            }
        }
    }
}
