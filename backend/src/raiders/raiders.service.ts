import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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
import { CharacterRaids } from "src/commons/blizzard-api/models/character-raids";
import { RaidLockoutHelper } from "./utils/raid-lockout-helper";
import { RaidLockout } from "./dto/lockout/raid-lockout.dto";
import { CharacterProfile } from "src/commons/blizzard-api/models/character-profile";
import { ValidationHelper } from "src/commons/validation-helper";
import { RaiderClass } from "src/commons/raider-classes";
import { ClassRoleMismatchException } from "src/commons/exceptions/class-role-mismatch.exception";
import { RaidTierConfiguration } from "src/commons/raid-tier-configuration";
import { BlizzardRegion } from "src/commons/blizzard-regions";
import { CachedOverview } from "src/entities/cached-overview.entity";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class RaidersService implements OnModuleInit {
    private static CurrentRaidTier: RaidTierConfiguration;

    constructor(
        @InjectRepository(Raider) private raidersRepository: Repository<Raider>,
        @InjectRepository(RaidTeam) private raidTeamsRepository: Repository<RaidTeam>,
        @InjectRepository(CachedOverview) private overviewRepository: Repository<CachedOverview>,
    ) {}

    @Cron(CronExpression.EVERY_12_HOURS)
    async updateRaiderOverviews() {
        /*try {
            const raidersCount: number = await this.raidersRepository.count();
            console.log(`Refreshing raider overviews for ${raidersCount} raiders.`);
            const batchSize = 50;
            const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
            for (let i = 0; i < raidersCount; i += batchSize) {
                console.log(`Refreshing overviews for raiders #${i} to ${i + batchSize}.`);
                const raiderBatch: Raider[] = await this.raidersRepository.find({
                    relations: ["raidTeam"],
                    skip: i,
                    take: batchSize,
                });

                for await (const raider of raiderBatch) {
                    await this.getOverview(raider.raidTeam.id, raider.id, false);
                    await delay(10);
                    console.log(`Refreshed raider ${raider.id}`);
                }
            }
            console.log(
                `Refreshed all raider overviews. Refreshing again at the next full 12 hours (12 am / pm).`,
            );
        } catch (e) {
            console.log(
                "Refreshing raider overviews failed. Refreshing again at the next full 12 hours (12 am / pm).",
            );
            console.log(e);
        }*/
    }

    async onModuleInit() {
        console.log("Startup: Discovering the current raid tier through the Blizzard API.");
        const blizzApi: BlizzardApi = new BlizzardApi(BlizzardRegion.US);
        const currentRaidTier: RaidTierConfiguration = await blizzApi.getCurrentRaidTier();
        console.log(
            `The current expansion is "${currentRaidTier.expansionName}" (${currentRaidTier.expansionId}).`,
        );
        console.log(
            `The current raid tier is "${currentRaidTier.raidTierName}" (${currentRaidTier.raidTierId}).`,
        );
        RaidersService.CurrentRaidTier = currentRaidTier;

        this.updateRaiderOverviews();
    }

    async add(raidTeamId: string, createRaiderDto: CreateRaiderDto): Promise<Raider> {
        // Assert raid team exists.
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        // Assert character is not already in raid team.
        const conflictingRaider: Raider = await this.raidersRepository.findOne({
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
        const blizzApi: BlizzardApi = new BlizzardApi(raidTeam.region);
        const characterProfile: CharacterProfile | undefined = await blizzApi.getCharacterId(
            createRaiderDto.characterName,
            createRaiderDto.realm,
        );
        if (!characterProfile) {
            throw new NoSuchCharacterException(
                `No character named ${createRaiderDto.characterName} on realm ${createRaiderDto.realm} exists.`,
            );
        }

        // Assert class can actually fulfill role (e.g., a warrior cannot be a healer).
        const _class: RaiderClass = characterProfile.character_class.name;
        if (!ValidationHelper.canClassFulfillRole(_class, createRaiderDto.role)) {
            throw new ClassRoleMismatchException(
                `Character of class ${_class} cannot fulfill the ${createRaiderDto.role} role.`,
            );
        }

        const createdRaider: Raider = this.raidersRepository.create({
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
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
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
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
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
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        const raider: Raider = await this.raidersRepository.findOne({
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

    async getOverview(
        raidTeamId: string,
        raiderId: string,
        useCaching = true,
    ): Promise<RaiderOverviewDto> {
        const raidTeam: RaidTeam = await this.raidTeamsRepository.findOne(raidTeamId);
        if (!raidTeam) {
            throw new RaidTeamNotFoundException(`No raid team with id ${raidTeamId} exists.`);
        }

        const raider: Raider = await this.raidersRepository.findOne({
            id: raiderId,
            raidTeam: raidTeam,
        });
        if (!raider) {
            throw new RaiderNotFoundException(
                `No raider with id ${raiderId} exists in raid team ${raidTeamId}.`,
            );
        }

        if (useCaching) {
            const cachedOverview: CachedOverview = await this.overviewRepository.findOne({
                raider: raider,
            });
            const twelveHours = 12 * 60 * 60 * 1000;
            const isOverviewFresh = Date.now() - cachedOverview?.updatedAt?.getTime() < twelveHours;
            if (cachedOverview && isOverviewFresh) {
                return JSON.parse(cachedOverview.cachedOverview);
            } else {
                console.log(
                    `None or outdated cached overview for raider ${raiderId}. Refreshing data from blizzard API.`,
                );
            }
        }

        const blizzApi: BlizzardApi = new BlizzardApi(raidTeam.region);
        const mediaSummary = await blizzApi.getMediaSummary(raider.characterName, raider.realm);
        const characterSummary = await blizzApi.getCharacterSummary(
            raider.characterName,
            raider.realm,
        );

        const characterRaids: CharacterRaids = await blizzApi.getCharacterRaids(
            raider.characterName,
            raider.realm,
        );
        const raidLockout: RaidLockout = RaidLockoutHelper.createRaidLockoutFromCharacterRaids(
            raidTeam.region,
            characterRaids,
            RaidersService.CurrentRaidTier,
        );

        const raiderOverview: RaiderOverviewDto = new RaiderOverviewDto();
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

        const updatedAt = new Date();
        // Include the update timestamp in the returned overview.
        raiderOverview.refreshedAt = updatedAt;
        this.overviewRepository.save({
            raider: raider,
            cachedOverview: JSON.stringify(raiderOverview),
            // Manually setting updatedAt here so it still refreshes even if the overview did not change.
            updatedAt: updatedAt,
        });

        return raiderOverview;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getDetails(raidTeamId: string, raiderId: string): Promise<RaiderDetailsDto> {
        // TODO: Implement this.
        return undefined;
    }
}
