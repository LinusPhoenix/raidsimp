import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCachedOverview1628876851979 implements MigrationInterface {
    name = 'AddCachedOverview1628876851979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "REL_d78c590925f29582a22433e8cf" UNIQUE ("raiderId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "REL_d78c590925f29582a22433e8cf" UNIQUE ("raiderId"), CONSTRAINT "FK_d78c590925f29582a22433e8cfb" FOREIGN KEY ("raiderId") REFERENCES "raider" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "REL_d78c590925f29582a22433e8cf" UNIQUE ("raiderId"))`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
    }

}
