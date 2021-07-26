import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RaidTeam } from "src/entities/raid-team.entity";
import { Repository } from "typeorm";
import { CreateRaidTeamDto } from "./dto/CreateRaidTeamDto";
import { v4 as uuidv4 } from "uuid";
import { NameConflictException } from "src/commons/exceptions/name-conflict.exception";

@Injectable()
export class RaidTeamsService {

    constructor(@InjectRepository(RaidTeam) private raidTeamsRepository: Repository<RaidTeam>) { }

    async create(raidTeam: CreateRaidTeamDto): Promise<RaidTeam> {
        var conflictingRaidTeam: RaidTeam = await this.raidTeamsRepository.findOne({
            where: {
                name: raidTeam.name
            }
        });
        if (conflictingRaidTeam) {
            throw new NameConflictException(`A raid team with the name ${raidTeam.name} already exists.`);
        }

        var createdEntity: RaidTeam = this.raidTeamsRepository.create({
            id: uuidv4(),
            name: raidTeam.name,
            region: raidTeam.region
        });

        return this.raidTeamsRepository.save(createdEntity);
    }

    findAll(): Promise<RaidTeam[]> {
        return this.raidTeamsRepository.find();
    }

    findOne(id: string): Promise<RaidTeam> {
        return this.raidTeamsRepository.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.raidTeamsRepository.delete(id);
    }
}