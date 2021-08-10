import { BlizzardApi } from "src/commons/blizzard-api/blizzard-api";
import { CharacterRaids } from "src/commons/blizzard-api/models/character-raids";
import { BlizzardRegion } from "src/commons/blizzard-regions";
import { RaidDifficulty } from "src/commons/raid-difficulties";
import { RaidTierConfiguration } from "src/commons/raid-tier-configuration";
import { RaidDifficultyLockout } from "../dto/lockout/raid-difficulty-lockout.dto";
import { RaidLockout } from "../dto/lockout/raid-lockout.dto";

export class RaidLockoutHelper {
    static createRaidLockoutFromCharacterRaids(
        region: BlizzardRegion,
        characterRaids: CharacterRaids,
        currentRaidTier: RaidTierConfiguration
    ): RaidLockout {

        var currentExpansion = characterRaids.expansions.find(
            (expansion) => expansion.expansion.id === currentRaidTier.expansionId,
        );
        if (!currentExpansion) {
            return undefined;
        }

        var currentRaidTierLockout = currentExpansion.instances.find(
            (instance) => instance.instance.id === currentRaidTier.raidTierId,
        );
        if (!currentRaidTier) {
            return undefined;
        }

        var lastResetDate = this.getLastLockoutResetDate(region);

        var difficultyLockouts: RaidDifficultyLockout[] = [];
        Object.values(RaidDifficulty).forEach((difficulty) => {
            var difficultyMode = currentRaidTierLockout.modes.find(
                (mode) => mode.difficulty.name === difficulty,
            );
            if (difficultyMode) {
                difficultyLockouts.push(
                    RaidLockoutHelper.createRaidDifficultyLockout(
                        lastResetDate,
                        difficulty,
                        difficultyMode.progress,
                    ),
                );
            }
        });

        var raidLockout: RaidLockout = new RaidLockout();
        raidLockout.id = currentRaidTierLockout.instance.id;
        raidLockout.name = currentRaidTierLockout.instance.name;
        raidLockout.lockouts = difficultyLockouts;

        return raidLockout;
    }

    private static createRaidDifficultyLockout(
        lastResetDate: Date,
        difficulty: RaidDifficulty,
        progress: any,
    ): RaidDifficultyLockout {
        var bossesKilled = 0;
        var bossesTotal = progress.total_count;

        progress.encounters.forEach((encounter: any) => {
            var lastKillTimeStamp = encounter.last_kill_timestamp;
            if (lastKillTimeStamp > lastResetDate.getUTCDate()) {
                bossesKilled++;
            }
        });

        var difficultyLockout = new RaidDifficultyLockout();
        difficultyLockout.difficulty = difficulty;
        difficultyLockout.bossesTotal = bossesTotal;
        difficultyLockout.bossesKilled = bossesKilled;

        return difficultyLockout;
    }

    private static getLastLockoutResetDate(region: BlizzardRegion): Date {
        var now: Date = new Date();
        var lastResetDate: Date = new Date();
        if (region === BlizzardRegion.US) {
            // Set to 7:00 am UTC, the reset time.
            lastResetDate.setUTCHours(7, 0, 0, 0);
            // Subtract a number of days so that the date ends again at Wednesday.
            lastResetDate.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 4) % 7));
        } else {
            // Set to 3:00 pm UTC, the reset time.
            lastResetDate.setUTCHours(15, 0, 0, 0);
            // Subtract a number of days so that the date ends again at Tuesday.
            lastResetDate.setUTCDate(now.getUTCDate() - ((now.getUTCDay() + 5) % 7));
        }
        return lastResetDate;
    }
}
