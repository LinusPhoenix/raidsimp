import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { Raider } from "src/entities/raider.entity";
import { CreateRaiderDto } from "./dto/create-raider.dto";
import { v4 as uuidv4 } from "uuid";
import { RaidTeam } from "src/entities/raid-team.entity";
import { RaidTeamNotFoundException } from "src/commons/exceptions/raid-team-not-found.exception";
import { RaiderAlreadyInRaidTeamException } from "src/commons/exceptions/raider-already-in-raid-team.exception";
import { RaiderNotFoundException } from "src/commons/exceptions/raider-not-found.exception.";
import { NoSuchCharacterException } from "src/commons/exceptions/no-such-character.exception";
import { RaiderOverviewDto } from "./dto/raider-overview.dto";
import { RaiderDetailsDto } from "./dto/raider-details.dto";
import { BlizzardApi } from "src/commons/blizzard-api/blizzard-api";
import { MediaSummary } from "src/commons/blizzard-api/models/media-summary.model";
import { CharacterRaids } from "src/commons/blizzard-api/models/character-raids";
import { RaidLockoutHelper } from "./utils/raid-lockout-helper";
import { RaidLockout } from "./dto/lockout/raid-lockout.dto";
import { CharacterProfile } from "src/commons/blizzard-api/models/character-profile";
import { ValidationHelper } from "src/commons/validation-helper";
import { RaiderClass } from "src/commons/raider-classes";
import { ClassRoleMismatchException } from "src/commons/exceptions/class-role-mismatch.exception";
import { RaidTierConfiguration } from "src/commons/raid-tier-configuration";

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

        // Assert via blizz API that character exists.
        var blizzApi: BlizzardApi = new BlizzardApi(raidTeam.region);
        var characterProfile: CharacterProfile | undefined = await blizzApi.getCharacterId(
            createRaiderDto.characterName,
            createRaiderDto.realm,
        );
        if (!characterProfile) {
            throw new NoSuchCharacterException(
                `No character named ${createRaiderDto.characterName} on realm ${createRaiderDto.realm} exists.`,
            );
        }

        // Assert class can actually fulfill role (e.g., a warrior cannot be a healer).
        var _class: RaiderClass = characterProfile.character_class.name;
        if (!ValidationHelper.canClassFulfillRole(_class, createRaiderDto.role)) {
            throw new ClassRoleMismatchException(
                `Character of class ${_class} cannot fulfill the ${createRaiderDto.role} role.`,
            );
        }

        var createdRaider: Raider = this.raidersRepository.create({
            id: uuidv4(),
            raidTeam: raidTeam,
            characterId: characterProfile.id,
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

    async getOverview(raidTeamId: string, raiderId: string): Promise<RaiderOverviewDto> {
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

        var blizzApi: BlizzardApi = new BlizzardApi(raidTeam.region);
        var mediaSummary = await blizzApi.getMediaSummary(raider.characterName, raider.realm);
        var characterSummary = await blizzApi.getCharacterSummary(
            raider.characterName,
            raider.realm,
        );

        var characterRaids: CharacterRaids = await blizzApi.getCharacterRaids(
            raider.characterName,
            raider.realm,
        );
        var currentRaidTier: RaidTierConfiguration = await blizzApi.getCurrentRaidTier();
        var raidLockout: RaidLockout = RaidLockoutHelper.createRaidLockoutFromCharacterRaids(
            raidTeam.region,
            characterRaids,
            currentRaidTier
        );

        var raiderOverview: RaiderOverviewDto = new RaiderOverviewDto();
        raiderOverview.avatarUrl = mediaSummary.avatarUrl;
        raiderOverview.characterName = raider.characterName;
        raiderOverview.realm = raider.realm;
        raiderOverview.role = raider.role;
        raiderOverview.class = characterSummary._class;
        raiderOverview.spec = characterSummary.spec;
        raiderOverview.averageItemLevel = characterSummary.averageItemLevel;
        raiderOverview.covenant = characterSummary.covenant;
        raiderOverview.renown = characterSummary.renown;
        raiderOverview.currentLockout = raidLockout;

        return raiderOverview;
    }

    getDetails(raidTeamId: string, raiderId: string): Promise<RaiderDetailsDto> {
        // TODO: Implement this.
        return undefined;
    }
}
