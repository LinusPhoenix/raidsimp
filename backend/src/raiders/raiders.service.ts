import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Raider } from "src/entities/raider.entity";
import { CreateRaiderDto } from "./dto/create-raider.dto";
import { v4 as uuidv4 } from "uuid";
import { RaidTeam } from "src/entities/raid-team.entity";
import { RaidTeamNotFoundException } from "src/commons/exceptions/raid-team-not-found.exception";
import { RaiderAlreadyInRaidTeamException } from "src/commons/exceptions/raider-already-in-raid-team.exception";

@Injectable()
export class RaidersService {
    constructor(
        @InjectRepository(Raider) private raidersRepository: Repository<Raider>,
        @InjectRepository(RaidTeam) private raidTeamsRepository: Repository<RaidTeam>,
    ) {}

    async add(raidTeamId: string, createRaiderDto: CreateRaiderDto): Promise<Raider> {
        // Assert raid team exists.
        var raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        // Assert character is not already in raid team.
        var conflictingRaider: Raider = raidTeam.raiders?.find(
            (raider) =>
                raidTeam.id === raider.raidTeam.id &&
                raider.characterName === createRaiderDto.characterName &&
                raider.realm === createRaiderDto.realm,
        );
        if (conflictingRaider) {
            throw new RaiderAlreadyInRaidTeamException(
                `Character ${conflictingRaider.characterName} from realm ${conflictingRaider.realm} is already in raid team ${raidTeam.id}`,
            );
        }

        // TODO: Assert via blizz API that character exists.

        var createdRaider: Raider = this.raidersRepository.create({
            id: uuidv4(),
            raidTeam: raidTeam,
            characterId: 1, // TODO: This is still mocked
            characterName: createRaiderDto.characterName,
            realm: createRaiderDto.realm,
        });

        return this.raidersRepository.save(createdRaider);
    }

    async findAll(raidTeamId: string): Promise<Raider[]> {
        var raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        // raiders will be null if there are no raiders yet, so we explicitly return an empty list in that case.
        return raidTeam.raiders ?? [];
    }

    async findOne(raidTeamId: string, raiderId: string): Promise<Raider> {
        var raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        return await this.raidersRepository.findOne(raiderId);
    }

    async remove(raidTeamId: string, raiderId: string): Promise<void> {
        var raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        await this.raidersRepository.delete(raiderId);
    }

    getOverview(raidTeamId: string, raiderId: string): Promise<void> {
        return undefined;
    }

    getDetails(raidTeamId: string, raiderId: string): Promise<void> {
        return undefined;
    }
}
