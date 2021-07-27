import { HttpException } from "@nestjs/common";
import { BlizzAPI } from "blizzapi";
import { BlizzardRegion } from "../blizzard-regions";
import { CharacterSummary } from "./models/character-summary.model";
import { MediaSummary } from "./models/media-summary.model";

export class BlizzardApi {
    private readonly api: BlizzAPI;

    constructor(private readonly region: BlizzardRegion) {
        this.api = new BlizzAPI({
            region: region,
            clientId: process.env.BLIZZARD_API_CLIENT_ID,
            clientSecret: process.env.BLIZZARD_API_CLIENT_SECRET,
        });
    }

    async getCharacterId(characterName: string, realm: string): Promise<number | undefined> {
        characterName = this.formatCharacterName(characterName);
        realm = this.formatRealmName(realm);

        var endpoint = `/profile/wow/character/${realm}/${characterName}/status?namespace=profile-${this.region}&locale=en_US`;

        try {
            var data: any = await this.api.query(endpoint);
            return data.id;
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

        var endpoint = `/profile/wow/character/${realm}/${characterName}/character-media?namespace=profile-${this.region}&locale=en_US`;

        var data: any = await this.api.query(endpoint);
        var assets = data.assets;
        var avatarUrl: string = assets.find(
            (asset: { key: string }) => asset.key === "avatar",
        ).value;
        return new MediaSummary(avatarUrl);
    }

    async getCharacterSummary(characterName: string, realm: string): Promise<CharacterSummary> {
        characterName = this.formatCharacterName(characterName);
        realm = this.formatRealmName(realm);

        var endpoint = `/profile/wow/character/${realm}/${characterName}?namespace=profile-${this.region}&locale=en_US`;

        var data: any = await this.api.query(endpoint);
        return new CharacterSummary(
            data.character_class.name,
            data.active_spec.name,
            data.average_item_level,
            data.covenant_progress?.chosen_covenant?.name,
            data.covenant_progress?.renown_level,
        );
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
