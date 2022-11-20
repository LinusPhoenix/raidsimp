import { HttpException } from "@nestjs/common";
import { BlizzAPI, RegionName } from "blizzapi";
import { RaidTierConfiguration } from "../raid-tier-configuration";
import { CharacterProfile } from "./models/character-profile";
import { CharacterRaids } from "./models/character-raids";
import { CharacterSummary } from "./models/character-summary.model";
import { MediaSummary } from "./models/media-summary.model";
import { RealmIndex } from "./models/realm-index";

export class BlizzardApi {
    private readonly api: BlizzAPI;

    constructor(private readonly region: RegionName) {
        this.api = new BlizzAPI({
            region: region,
            clientId: process.env.BLIZZARD_API_CLIENT_ID,
            clientSecret: process.env.BLIZZARD_API_CLIENT_SECRET,
        });
    }

    async getRealmsOfRegion(): Promise<RealmIndex> {
        const endpoint = `/data/wow/realm/index?region=${this.region}&namespace=dynamic-${this.region}&locale=en_US`;

        try {
            const data: any = await this.api.query(endpoint);
            return data as RealmIndex;
        } catch (exception) {
            throw new HttpException(
                "Unexpected error from the Blizzard API",
                exception.response.status,
            );
        }
    }

    async getCurrentRaidTier(): Promise<RaidTierConfiguration> {
        try {
            // Look up the most recent expansion id using the journal expansion index endpoint.
            let endpoint = `/data/wow/journal-expansion/index?region=${this.region}&namespace=static-${this.region}&locale=en_US`;

            let data: any = await this.api.query(endpoint);
            const expansions = data.tiers;
            const currentExpansion = expansions[expansions.length - 2];

            // Look up the most recent raid of that expansion using the journal expansion endpoint.
            endpoint = `/data/wow/journal-expansion/${currentExpansion.id}?region=${this.region}&namespace=static-${this.region}&locale=en_US`;

            data = await this.api.query(endpoint);
            const raids = data.raids;
            const currentRaidTier = raids[raids.length - 1];

            return new RaidTierConfiguration({
                expansionName: currentExpansion.name,
                expansionId: currentExpansion.id,
                raidTierName: currentRaidTier.name,
                raidTierId: currentRaidTier.id,
            });
        } catch (exception) {
            throw new HttpException(
                "Unexpected error from the Blizzard API",
                exception.response.status,
            );
        }
    }

    async getCharacterId(
        characterName: string,
        realm: string,
    ): Promise<CharacterProfile | undefined> {
        characterName = this.formatCharacterName(characterName);
        realm = this.formatRealmName(realm);

        const endpoint = `/profile/wow/character/${realm}/${characterName}?namespace=profile-${this.region}&locale=en_US`;

        try {
            const data: any = await this.api.query(endpoint);
            return data as CharacterProfile;
        } catch (exception) {
            if (exception.response.status == 404) {
                return undefined;
            } else {
                throw new HttpException(
                    "Unexpected error from the Blizzard API",
                    exception.response.status,
                );
            }
        }
    }

    async getMediaSummary(characterName: string, realm: string): Promise<MediaSummary> {
        characterName = this.formatCharacterName(characterName);
        realm = this.formatRealmName(realm);

        const endpoint = `/profile/wow/character/${realm}/${characterName}/character-media?namespace=profile-${this.region}&locale=en_US`;

        const data: any = await this.api.query(endpoint);
        const assets = data.assets;
        const avatarUrl: string = assets.find(
            (asset: { key: string }) => asset.key === "avatar",
        ).value;
        return new MediaSummary(avatarUrl);
    }

    async getCharacterSummary(characterName: string, realm: string): Promise<CharacterSummary> {
        characterName = this.formatCharacterName(characterName);
        realm = this.formatRealmName(realm);

        const endpoint = `/profile/wow/character/${realm}/${characterName}?namespace=profile-${this.region}&locale=en_US`;

        const data: any = await this.api.query(endpoint);
        return new CharacterSummary(
            data.character_class.name,
            data.active_spec.name,
            data.average_item_level,
            data.covenant_progress?.chosen_covenant?.name,
            data.covenant_progress?.renown_level,
        );
    }

    async getCharacterRaids(characterName: string, realm: string): Promise<CharacterRaids> {
        characterName = this.formatCharacterName(characterName);
        realm = this.formatRealmName(realm);

        const endpoint = `/profile/wow/character/${realm}/${characterName}/encounters/raids?namespace=profile-${this.region}&locale=en_US`;

        return (await this.api.query(endpoint)) as CharacterRaids;
    }

    private formatRealmName(realm: string): string {
        // Replaces all whitespace sequences with a dash ('-'), then converts to lower case.
        return realm.replace(/\s+/g, "-").toLowerCase();
    }

    private formatCharacterName(characterName: string): string {
        // Replaces all whitespace sequences with a dash ('-'), then converts to lower case.
        return characterName.replace(/\s+/g, "-").toLowerCase();
    }
}
