import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RaidTeam } from "src/entities/raid-team.entity";
import { Repository } from "typeorm";
import { CreateRaidTeamDto } from "./dto/create-raid-team.dto";
import { v4 as uuidv4 } from "uuid";
import { NameConflictException } from "src/commons/exceptions/name-conflict.exception";
import { RaidTeamNotFoundException } from "src/commons/exceptions/raid-team-not-found.exception";

@Injectable()
export class RaidTeamsService {
    constructor(@InjectRepository(RaidTeam) private raidTeamsRepository: Repository<RaidTeam>) {}

    async create(raidTeam: CreateRaidTeamDto): Promise<RaidTeam> {
        var conflictingRaidTeam: RaidTeam = await this.raidTeamsRepository.findOne({
            where: {
                name: raidTeam.name,
            },
        });
        if (conflictingRaidTeam) {
            throw new NameConflictException(
                `A raid team with the name ${raidTeam.name} already exists.`,
            );
        }

        var createdRaidTeam: RaidTeam = this.raidTeamsRepository.create({
            id: uuidv4(),
            name: raidTeam.name,
            region: raidTeam.region,
        });

        return this.raidTeamsRepository.save(createdRaidTeam);
    }

    findAll(): Promise<RaidTeam[]> {
        return this.raidTeamsRepository.find({
            relations: ["raiders"],
        });
    }

    findOne(id: string): Promise<RaidTeam> {
        return this.raidTeamsRepository.findOne(id, {
            relations: ["raiders"],
        });
    }

    async rename(id: string, newName: string): Promise<RaidTeam> {
        var raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(id);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${id} exists.`);
        }

        var conflictingRaidTeam: RaidTeam = await this.raidTeamsRepository.findOne({
            where: {
                name: newName,
            },
        });
        if (conflictingRaidTeam) {
            throw new NameConflictException(
                `A raid team with the name ${raidTeam.name} already exists.`,
            );
        }

        raidTeam.name = newName;

        return this.raidTeamsRepository.save(raidTeam);
    }

    async remove(id: string): Promise<void> {
        var raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(id);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${id} exists.`);
        }

        await this.raidTeamsRepository.delete(id);
    }
}
