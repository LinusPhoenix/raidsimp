import {
    Body,
    ConflictException,
    Controller,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Res,
} from "@nestjs/common";
import { RaidTeam } from "src/entities/raid-team.entity";
import { RaidTeamsService } from "./raid-teams.service";
import { Response } from "express";
import { CreateRaidTeamDto } from "./dto/CreateRaidTeamDto";
import { NameConflictException } from "src/commons/exceptions/name-conflict.exception";
import {
    ApiBody,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from "@nestjs/swagger";

@ApiTags("raid-teams")
@Controller("raid-teams")
export class RaidTeamsController {
    constructor(private readonly raidTeamsService: RaidTeamsService) {}

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

    @ApiOkResponse({ type: RaidTeam, isArray: true, description: "All existing RaidTeam objects." })
    @Get()
    getAll(): Promise<RaidTeam[]> {
        return this.raidTeamsService.findAll();
    }

    @ApiOkResponse({ type: RaidTeam, description: "The RaidTeam object with the given id." })
    @ApiNotFoundResponse({ description: "No raid team with the given id exists." })
    @ApiForbiddenResponse({ description: "You do not have access to this raid team." })
    @Get(":id")
    async getOne(@Param("id") id: string, @Res() response: Response): Promise<void> {
        var raidTeam = await this.raidTeamsService.findOne(id);
        if (raidTeam) {
            response.status(HttpStatus.OK).send(raidTeam);
        } else {
            throw new NotFoundException(`No raid team with id ${id} exists.`);
        }
    }
}
