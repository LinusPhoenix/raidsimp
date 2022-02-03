import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RaidTeam } from "src/entities/raid-team.entity";
import { Repository } from "typeorm";
import { CreateRaidTeamDto } from "./dto/create-raid-team.dto";
import { v4 as uuidv4 } from "uuid";
import { NameConflictException } from "src/commons/exceptions/name-conflict.exception";
import { RaidTeamNotFoundException } from "src/commons/exceptions/raid-team-not-found.exception";
import { User } from "src/entities/user.entity";

@Injectable()
export class RaidTeamsService {
    constructor(@InjectRepository(RaidTeam) private raidTeamsRepository: Repository<RaidTeam>) {}

    async create(user: User, raidTeam: CreateRaidTeamDto): Promise<RaidTeam> {
        const createdRaidTeam: RaidTeam = this.raidTeamsRepository.create({
            id: uuidv4(),
            owner: user,
            name: raidTeam.name,
            region: raidTeam.region,
            // This is necessary because by default raiders will be undefined, breaking the API contract.
            raiders: [],
        });

        return this.raidTeamsRepository.save(createdRaidTeam);
    }

    findAll(user: User): Promise<RaidTeam[]> {
        return this.raidTeamsRepository.find({
            where: {
                owner: user,
            },
            relations: ["raiders"],
        });
    }

    findOne(user: User, id: string): Promise<RaidTeam> {
        return this.raidTeamsRepository.findOne(id, {
            where: {
                owner: user,
            },
            relations: ["raiders"],
        });
    }

    async rename(user: User, id: string, newName: string): Promise<RaidTeam> {
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(id, {
            where: {
                owner: user,
            },
        });
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${id} exists.`);
        }

        raidTeam.name = newName;

        await this.raidTeamsRepository.save(raidTeam);

        return this.findOne(user, id);
    }

    async remove(user: User, id: string): Promise<void> {
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(id, {
            where: {
                owner: user,
            },
        });
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${id} exists.`);
        }

        await this.raidTeamsRepository.delete(id);
    }
}
