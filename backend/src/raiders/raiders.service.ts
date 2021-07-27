import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { Raider } from "src/entities/raider.entity";
import { CreateRaiderDto } from "./dto/create-raider.dto";
import { v4 as uuidv4 } from "uuid";
import { RaidTeam } from "src/entities/raid-team.entity";
import { RaidTeamNotFoundException } from "src/commons/exceptions/raid-team-not-found.exception";
import { RaiderAlreadyInRaidTeamException } from "src/commons/exceptions/raider-already-in-raid-team.exception";
import { BlizzardApi } from "src/commons/blizz-api-helper";
import { RaiderNotFoundException } from "src/commons/exceptions/raider-not-found.exception.";

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
        var conflictingRaider: Raider = await this.raidersRepository.findOne({
            raidTeam: raidTeam,
            characterName: createRaiderDto.characterName,
            realm: createRaiderDto.realm,
        });
        if (conflictingRaider) {
            throw new RaiderAlreadyInRaidTeamException(
                `Character ${conflictingRaider.characterName} from realm ${conflictingRaider.realm} is already in raid team ${raidTeam.id}`,
            );
        }

        // TODO: Assert via blizz API that character exists.
        var blizzApi: BlizzardApi = new BlizzardApi(raidTeam.region);
        //blizzApi.doesCharacterExist(createRaiderDto.characterName, createRaiderDto.realm);

        var createdRaider: Raider = this.raidersRepository.create({
            id: uuidv4(),
            raidTeam: raidTeam,
            characterId: Math.floor(Math.random() * 100), // TODO: This is still mocked
            characterName: createRaiderDto.characterName,
            realm: createRaiderDto.realm,
            role: createRaiderDto.role,
        });

        return this.raidersRepository.save(createdRaider);
    }

    async findAll(raidTeamId: string): Promise<Raider[]> {
        var raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        return await this.raidersRepository.find({
            where: {
                raidTeam: {
                    id: raidTeamId,
                },
            },
        });
    }

    async findOne(raidTeamId: string, raiderId: string): Promise<Raider> {
        var raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        return await this.raidersRepository.findOne(raiderId, {
            where: {
                raidTeam: {
                    id: raidTeamId,
                },
            },
        });
    }

    async remove(raidTeamId: string, raiderId: string): Promise<void> {
        var raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        var raider: Raider = await this.raidersRepository.findOne({
            id: raiderId,
            raidTeam: raidTeam,
        });
        if (!raider) {
            throw new RaiderNotFoundException(
                `No raider with id ${raiderId} exists in raid team ${raidTeamId}.`,
            );
        }
        await this.raidersRepository.delete(raider.id);
    }

    getOverview(raidTeamId: string, raiderId: string): Promise<void> {
        return undefined;
    }

    getDetails(raidTeamId: string, raiderId: string): Promise<void> {
        return undefined;
    }
}
