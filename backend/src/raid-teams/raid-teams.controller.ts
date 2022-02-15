import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put,
} from "@nestjs/common";
import { RaidTeam } from "src/entities/raid-team.entity";
import { RaidTeamsService } from "./raid-teams.service";
import { CreateRaidTeamDto } from "./dto/create-raid-team.dto";
import {
    ApiBadRequestResponse,
    ApiBody,
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
import { CollaboratorsService } from "./collaborators.service";
import { Collaborator } from "src/entities/collaborator.entity";
import { CollaboratorDto } from "./dto/collaborator.dto";

@ApiTags("raid-teams")
@Controller("raid-teams")
export class RaidTeamsController {
    constructor(
        private readonly raidTeamsService: RaidTeamsService,
        private readonly collaboratorsService: CollaboratorsService,
    ) {}

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
            if (exception instanceof ForbiddenException) {
                throw exception;
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
    @ApiForbiddenResponse({
        description: "You must be able to edit the raid team to rename it.",
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
            } else if (exception instanceof ForbiddenException) {
                throw exception;
            } else {
                throw exception;
            }
        }
    }

    @ApiOperation({ summary: "Delete a raid team." })
    @ApiForbiddenResponse({
        description: "You must own the raid team to be able to delete it.",
    })
    @Delete(":id")
    async remove(@ReqUser() user: User, @Param("id") id: string): Promise<void> {
        try {
            await this.raidTeamsService.remove(user, id);
        } catch (exception) {
            if (exception instanceof RaidTeamNotFoundException) {
                throw new NotFoundException(exception.message);
            } else if (exception instanceof ForbiddenException) {
                throw exception;
            } else {
                throw exception;
            }
        }
    }

    @ApiOperation({
        summary: "Get a raid team's collaborators. Owner of the raid team only.",
    })
    @ApiOkResponse({
        type: Collaborator,
        isArray: true,
        description: "The raid team's collaborators.",
    })
    @ApiNotFoundResponse({ description: "No raid team with the given id exists." })
    @ApiForbiddenResponse({ description: "You are not the owner of the raid team." })
    @Get(":id/collaborators")
    async getCollaborators(
        @ReqUser() user: User,
        @Param("id") id: string,
    ): Promise<Collaborator[]> {
        try {
            return await this.collaboratorsService.findByRaidTeam(user, id);
        } catch (exception) {
            if (exception instanceof RaidTeamNotFoundException) {
                throw new NotFoundException(exception.message);
            } else if (exception instanceof ForbiddenException) {
                throw exception;
            } else {
                throw exception;
            }
        }
    }

    @ApiOperation({
        summary: "Add or update a raid team's collaborator. Owner of the raid team only.",
    })
    @ApiBody({ type: CollaboratorDto })
    @ApiOkResponse({
        type: Collaborator,
        description: "The created or updated collaborator.",
    })
    @ApiBadRequestResponse({
        description: "Unknown role or you tried to add yourself as a collaborator.",
    })
    @ApiNotFoundResponse({ description: "No raid team with the given id exists." })
    @ApiForbiddenResponse({ description: "You are not the owner of the raid team." })
    @Put(":id/collaborators/:battletag")
    async putCollaborator(
        @ReqUser() user: User,
        @Param("id") id: string,
        @Param("battletag") battletag: string,
        @Body() collaboratorDto: CollaboratorDto,
    ): Promise<Collaborator> {
        if (user.battletag === battletag) {
            throw new BadRequestException(
                "You cannot add yourself as a collaborator to a raid team you own.",
            );
        }
        try {
            return await this.collaboratorsService.addOrUpdate(
                user,
                id,
                battletag,
                collaboratorDto.role,
            );
        } catch (exception) {
            if (exception instanceof RaidTeamNotFoundException) {
                throw new NotFoundException(exception.message);
            } else if (exception instanceof ForbiddenException) {
                throw exception;
            } else {
                throw exception;
            }
        }
    }

    @ApiOperation({
        summary: "Delete a raid team's collaborator. Owner of the raid team only.",
    })
    @ApiOkResponse({
        description: "Deletion successful.",
    })
    @ApiNotFoundResponse({ description: "No raid team with the given id exists." })
    @ApiForbiddenResponse({ description: "You are not the owner of the raid team." })
    @Delete(":id/collaborators/:battletag")
    async deleteCollaborator(
        @ReqUser() user: User,
        @Param("id") id: string,
        @Param("battletag") battletag: string,
    ): Promise<void> {
        try {
            return await this.collaboratorsService.delete(user, id, battletag);
        } catch (exception) {
            if (exception instanceof RaidTeamNotFoundException) {
                throw new NotFoundException(exception.message);
            } else if (exception instanceof ForbiddenException) {
                throw exception;
            } else {
                throw exception;
            }
        }
    }
}
