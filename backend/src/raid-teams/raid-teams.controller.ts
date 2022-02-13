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
import { ReqUser } from "src/commons/user.decorator";
import { User } from "src/entities/user.entity";

@ApiTags("raid-teams")
@Controller("raid-teams")
export class RaidTeamsController {
    constructor(private readonly raidTeamsService: RaidTeamsService) {}

    @ApiOperation({ summary: "Create a new raid team." })
    @ApiBody({ type: CreateRaidTeamDto })
    @ApiCreatedResponse({ type: RaidTeam, description: "The newly created RaidTeam object." })
    @Post()
    async create(
        @ReqUser() user: User,
        @Body() createRaidTeamDto: CreateRaidTeamDto,
    ): Promise<RaidTeam> {
        try {
            return await this.raidTeamsService.create(user, createRaidTeamDto);
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
    getAll(@ReqUser() user: User): Promise<RaidTeam[]> {
        return this.raidTeamsService.findAll(user);
    }

    @ApiOperation({ summary: "Get a specific raid team." })
    @ApiOkResponse({ type: RaidTeam, description: "The RaidTeam object with the given id." })
    @ApiNotFoundResponse({ description: "No raid team with the given id exists." })
    @ApiForbiddenResponse({ description: "You do not have access to this raid team." })
    @Get(":id")
    async getOne(@ReqUser() user: User, @Param("id") id: string): Promise<RaidTeam> {
        const raidTeam = await this.raidTeamsService.findOne(user, id);
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
    @Patch(":id")
    async renameTeam(
        @ReqUser() user: User,
        @Param("id") id: string,
        @Body() renameRaidTeamDto: RenameRaidTeamDto,
    ): Promise<RaidTeam> {
        try {
            return await this.raidTeamsService.rename(user, id, renameRaidTeamDto.name);
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
    async remove(@ReqUser() user: User, @Param("id") id: string): Promise<void> {
        try {
            await this.raidTeamsService.remove(user, id);
        } catch (exception) {
            if (exception instanceof RaidTeamNotFoundException) {
                throw new NotFoundException(exception.message);
            } else {
                throw exception;
            }
        }
    }
}
