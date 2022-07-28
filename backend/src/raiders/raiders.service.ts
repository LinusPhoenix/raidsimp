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
import { RegionNameEnum } from "blizzapi";
import { AccessService } from "src/raid-teams/access.service";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

@Injectable()
export class RaidersService implements OnModuleInit {
    private readonly logger = new Logger(RaidersService.name);
    private static CurrentRaidTier: RaidTierConfiguration;

    constructor(
        @InjectRepository(Raider) private raidersRepository: Repository<Raider>,
        @InjectRepository(CachedOverview) private overviewRepository: Repository<CachedOverview>,
        private readonly accessService: AccessService,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async updateRaiderOverviews() {
        try {
            this.logger.log("Refreshing raider overviews via cronjob...");
            const overviewsToRefresh = await this.overviewRepository.find({
                relations: ["raider", "raider.raidTeam"],
                order: {
                    updatedAt: "ASC",
                },
                take: 10,
            });
            this.logger.log(
                `Refreshing ${overviewsToRefresh.length} overviews as part of the cronjob...`,
            );
            for (const overview of overviewsToRefresh) {
                // Wait some time here so we don't run into any API limits.
                await delay(1000);
                await this.generateRaiderOverview(overview.raider);
                this.logger.log(`Refreshed overview for raider ${overview.raider.id}.`);
            }
            this.logger.log(
                "Refreshing overviews via cronjob complete. Refreshing more at the next full minute.",
            );
        } catch (e) {
            this.logger.error(
                "Refreshing raider overviews failed. Refreshing again at the next full minute.",
            );
            this.logger.error(e);
        }
    }

    async onModuleInit() {
        this.logger.log("Startup: Discovering the current raid tier through the Blizzard API.");
        const blizzApi: BlizzardApi = new BlizzardApi(RegionNameEnum.us);
        const currentRaidTier: RaidTierConfiguration = await blizzApi.getCurrentRaidTier();
        this.logger.log(
            `The current expansion is "${currentRaidTier.expansionName}" (${currentRaidTier.expansionId}).`,
        );
        this.logger.log(
            `The current raid tier is "${currentRaidTier.raidTierName}" (${currentRaidTier.raidTierId}).`,
        );
        RaidersService.CurrentRaidTier = currentRaidTier;
    }

    async add(user: User, raidTeamId: string, createRaiderDto: CreateRaiderDto): Promise<Raider> {
        // Assert raid team exists.
        const raidTeam: RaidTeam = await this.accessService.assertUserCanEditRaidTeam(
            user,
            raidTeamId,
        );

        // Assert character is not already in raid team.
        const conflictingRaider: Raider = await this.raidersRepository.findOneBy({
            raidTeam: {
                id: raidTeam.id,
            },
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

        return await this.raidersRepository.findOneBy({
            id: raiderId,
            raidTeam: {
                id: raidTeamId,
            },
        });
    }

    async remove(user: User, raidTeamId: string, raiderId: string): Promise<void> {
        const raidTeam: RaidTeam = await this.accessService.assertUserCanEditRaidTeam(
            user,
            raidTeamId,
        );

        const raider: Raider = await this.raidersRepository.findOneBy({
            id: raiderId,
            raidTeam: {
                id: raidTeam.id,
            },
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
            where: {
                id: raiderId,
                raidTeam: {
                    id: raidTeam.id,
                },
            },
            relations: ["raidTeam"],
        });
        if (!raider) {
            throw new RaiderNotFoundException(
                `No raider with id ${raiderId} exists in raid team ${raidTeamId}.`,
            );
        }

        if (useCaching) {
            const cachedOverview: CachedOverview = await this.overviewRepository.findOneBy({
                raider: {
                    id: raider.id,
                },
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
        } else {
            this.logger.log(
                `Cache invalidated by ${user.battletag}. Team=${raidTeamId}, Raider=${raiderId}`,
            );
        }

        return this.generateRaiderOverview(raider);
    }

    private async generateRaiderOverview(raider: Raider): Promise<RaiderOverviewDto> {
        const blizzApi: BlizzardApi = new BlizzardApi(raider.raidTeam.region);
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
            raider.raidTeam.region,
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
            raiderId: raider.id,
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
