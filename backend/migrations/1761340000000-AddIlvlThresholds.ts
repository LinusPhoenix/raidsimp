import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIlvlThresholds1761340000000 implements MigrationInterface {
    name = "AddIlvlThresholds1761340000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "ilvl_threshold" ("ilvl" integer PRIMARY KEY NOT NULL, "color" varchar(7) NOT NULL, "rarity" varchar(32) NOT NULL DEFAULT (''), "description" varchar(256) NOT NULL DEFAULT (''))`,
        );
        await queryRunner.query(
            `INSERT INTO "ilvl_threshold"("ilvl", "color", "rarity", "description") VALUES (0, '#9d9d9d', 'Poor', 'Always 0'), (243, '#1eff00', 'Uncommon', 'Highest LFR'), (256, '#0070dd', 'Rare', 'Highest Normal'), (269, '#a335ee', 'Epic', 'Highest Heroic'), (279, '#ff8000', 'Legendary', 'Average Mythic'), (289, '#e6cc80', 'Artifact', 'Highest Mythic')`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ilvl_threshold"`);
    }
}
