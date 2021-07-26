import { Body, ConflictException, Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Res } from '@nestjs/common';
import { RaidTeam } from 'src/entities/raid-team.entity';
import { RaidTeamsService } from './raid-teams.service';
import { Response } from 'express';
import { CreateRaidTeamDto } from './dto/CreateRaidTeamDto';
import { NameConflictException } from 'src/commons/exceptions/name-conflict.exception';

@Controller('raid-teams')
export class RaidTeamsController {
    constructor(private readonly raidTeamsService: RaidTeamsService) { }

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

    @Get()
    getAll(): Promise<RaidTeam[]> {
        return this.raidTeamsService.findAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string, @Res() response: Response): Promise<void> {
        var raidTeam = await this.raidTeamsService.findOne(id);
        if (raidTeam) {
            response.status(HttpStatus.OK).send(raidTeam);
        } else {
            throw new NotFoundException(`No raid team with id ${id} exists.`);
        }
    }
}
