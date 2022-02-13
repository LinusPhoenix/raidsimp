import { Injectable } from "@nestjs/common";
import { BlizzardApi } from "src/commons/blizzard-api/blizzard-api";
import { BlizzardRegion } from "src/commons/blizzard-regions";
import { RealmDto } from "./dto/realm.dto";

@Injectable()
export class RealmsService {
    async findAll(region: BlizzardRegion): Promise<RealmDto[]> {
        const blizzApi: BlizzardApi = new BlizzardApi(region);
        const realmIndex = await blizzApi.getRealmsOfRegion();

        const realms = [];
        realmIndex.realms.forEach((realm) =>
            realms.push(
                new RealmDto({
                    name: realm.name,
                    id: realm.id,
                    slug: realm.slug,
                }),
            ),
        );

        return realms;
    }
}
