import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Raider } from "src/entities/raider.entity";
import { CreateRaiderDto } from "./dto/create-raider.dto";
import { v4 as uuidv4 } from "uuid";
import { RaidTeam } from "src/entities/raid-team.entity";
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
import { CachedOverview } from "src/entities/cached-overview.entity";
import { Cron, CronExpression } from "@nestjs/schedule";
import { User } from "src/entities/user.entity";
import { RegionName } from "blizzapi";
import { AccessService } from "src/raid-teams/access.service";

@Injectable()
export class RaidersService implements OnModuleInit {
    private readonly logger = new Logger(RaidersService.name);
    private static CurrentRaidTier: RaidTierConfiguration;

    constructor(
        @InjectRepository(Raider) private raidersRepository: Repository<Raider>,
        @InjectRepository(CachedOverview) private overviewRepository: Repository<CachedOverview>,
        private readonly accessService: AccessService,
    ) {}

    @Cron(CronExpression.EVERY_12_HOURS)
    async updateRaiderOverviews() {
        /*try {
            const raidersCount: number = await this.raidersRepository.count();
            this.logger.log(`Refreshing raider overviews for ${raidersCount} raiders.`);
            const batchSize = 50;
            const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
            for (let i = 0; i < raidersCount; i += batchSize) {
                this.logger.log(`Refreshing overviews for raiders #${i} to ${i + batchSize}.`);
                const raiderBatch: Raider[] = await this.raidersRepository.find({
                    relations: ["raidTeam"],
                    skip: i,
                    take: batchSize,
                });

                for await (const raider of raiderBatch) {
                    await this.getOverview(raider.raidTeam.id, raider.id, false);
                    await delay(10);
                    this.logger.log(`Refreshed raider ${raider.id}`);
                }
            }
            this.logger.log(
                `Refreshed all raider overviews. Refreshing again at the next full 12 hours (12 am / pm).`,
            );
        } catch (e) {
            this.logger.log(
                "Refreshing raider overviews failed. Refreshing again at the next full 12 hours (12 am / pm).",
            );
            this.logger.log(e);
        }*/
    }

    async onModuleInit() {
        this.logger.log("Startup: Discovering the current raid tier through the Blizzard API.");
        const blizzApi: BlizzardApi = new BlizzardApi(RegionName.us);
        const currentRaidTier: RaidTierConfiguration = await blizzApi.getCurrentRaidTier();
        this.logger.log(
            `The current expansion is "${currentRaidTier.expansionName}" (${currentRaidTier.expansionId}).`,
        );
        this.logger.log(
            `The current raid tier is "${currentRaidTier.raidTierName}" (${currentRaidTier.raidTierId}).`,
        );
        RaidersService.CurrentRaidTier = currentRaidTier;

        this.updateRaiderOverviews();
    }

    async add(user: User, raidTeamId: string, createRaiderDto: CreateRaiderDto): Promise<Raider> {
        // Assert raid team exists.
        const raidTeam: RaidTeam = await this.accessService.assertUserCanEditRaidTeam(
            user,
            raidTeamId,
        );

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

    async findAll(user: User, raidTeamId: string): Promise<Raider[]> {
        await this.accessService.assertUserCanViewRaidTeam(user, raidTeamId);

        return await this.raidersRepository.find({
            where: {
                raidTeam: {
                    id: raidTeamId,
                },
            },
        });
    }

    async findOne(user: User, raidTeamId: string, raiderId: string): Promise<Raider> {
        await this.accessService.assertUserCanViewRaidTeam(user, raidTeamId);

        return await this.raidersRepository.findOne(raiderId, {
            where: {
                raidTeam: {
                    id: raidTeamId,
                },
            },
        });
    }

    async remove(user: User, raidTeamId: string, raiderId: string): Promise<void> {
        const raidTeam: RaidTeam = await this.accessService.assertUserCanEditRaidTeam(
            user,
            raidTeamId,
        );

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
        user: User,
        raidTeamId: string,
        raiderId: string,
        useCaching = true,
    ): Promise<RaiderOverviewDto> {
        const raidTeam: RaidTeam = await this.accessService.assertUserCanViewRaidTeam(
            user,
            raidTeamId,
        );

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
                this.logger.log(
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
