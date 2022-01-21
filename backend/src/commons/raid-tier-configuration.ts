export class RaidTierConfiguration {
    public constructor(options?: RaidTierConfigurationOptions) {
        if (options) {
            this.expansionName = options.expansionName;
            this.expansionId = options.expansionId;
            this.raidTierName = options.raidTierName;
            this.raidTierId = options.raidTierId;
        }
    }

    expansionName: string;
    expansionId: number;
    raidTierName: string;
    raidTierId: number;
}

export interface RaidTierConfigurationOptions {
    expansionName: string;
    expansionId: number;
    raidTierName: string;
    raidTierId: number;
}
