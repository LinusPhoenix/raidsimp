import { HttpException } from "@nestjs/common";
import { BlizzAPI } from "blizzapi";
import { BlizzardRegion } from "./blizzard-regions";

export class BlizzardApi {
    private readonly api: BlizzAPI;

    constructor(private readonly region: BlizzardRegion) {
        this.api = new BlizzAPI({
            region: region,
            clientId: process.env.BLIZZARD_API_CLIENT_ID,
            clientSecret: process.env.BLIZZARD_API_CLIENT_SECRET,
        });
    }

    async doesCharacterExist(characterName: string, realm: string): Promise<boolean> {
        characterName = this.formatCharacterName(characterName);
        realm = this.formatRealmName(realm);

        var endpoint = `/profile/wow/character/${realm}/${characterName}?namespace=profile-${this.region}&locale=en_US`;

        try {
            await this.api.query(endpoint);
            return true;
        } catch (exception) {
            if (exception.response.status == 404) {
                return false;
            } else {
                throw new HttpException(
                    "Unexpected error from the Blizzard API",
                    exception.response.status,
                );
            }
        }
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
