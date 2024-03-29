import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateInitialTables1643879197679 implements MigrationInterface {
    name = 'CreateInitialTables1643879197679'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("battletag" text PRIMARY KEY NOT NULL, "id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_cace4a159ff9f2512dd42373760" UNIQUE ("id"))`);
        await queryRunner.query(`CREATE TABLE "raid_team" ("id" varchar(32) PRIMARY KEY NOT NULL, "name" varchar(128) NOT NULL, "region" varchar(8) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ownerBattletag" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "raider" ("id" varchar(32) PRIMARY KEY NOT NULL, "characterId" integer NOT NULL, "characterName" varchar(16) NOT NULL, "realm" varchar(128) NOT NULL, "role" varchar(8) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32) NOT NULL, CONSTRAINT "UQ_7c79593431c035a14b2c88c7e11" UNIQUE ("characterId", "raidTeamId"))`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "REL_d78c590925f29582a22433e8cf" UNIQUE ("raiderId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_raid_team" ("id" varchar(32) PRIMARY KEY NOT NULL, "name" varchar(128) NOT NULL, "region" varchar(8) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ownerBattletag" text NOT NULL, CONSTRAINT "FK_6d69ce0492fc10f0bfebefd99c9" FOREIGN KEY ("ownerBattletag") REFERENCES "user" ("battletag") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_raid_team"("id", "name", "region", "createdAt", "updatedAt", "ownerBattletag") SELECT "id", "name", "region", "createdAt", "updatedAt", "ownerBattletag" FROM "raid_team"`);
        await queryRunner.query(`DROP TABLE "raid_team"`);
        await queryRunner.query(`ALTER TABLE "temporary_raid_team" RENAME TO "raid_team"`);
        await queryRunner.query(`CREATE TABLE "temporary_raider" ("id" varchar(32) PRIMARY KEY NOT NULL, "characterId" integer NOT NULL, "characterName" varchar(16) NOT NULL, "realm" varchar(128) NOT NULL, "role" varchar(8) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32) NOT NULL, CONSTRAINT "UQ_7c79593431c035a14b2c88c7e11" UNIQUE ("characterId", "raidTeamId"), CONSTRAINT "FK_bf6b7d3b1cb8de4d829324f7d6d" FOREIGN KEY ("raidTeamId") REFERENCES "raid_team" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_raider"("id", "characterId", "characterName", "realm", "role", "createdAt", "updatedAt", "raidTeamId") SELECT "id", "characterId", "characterName", "realm", "role", "createdAt", "updatedAt", "raidTeamId" FROM "raider"`);
        await queryRunner.query(`DROP TABLE "raider"`);
        await queryRunner.query(`ALTER TABLE "temporary_raider" RENAME TO "raider"`);
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "REL_d78c590925f29582a22433e8cf" UNIQUE ("raiderId"), CONSTRAINT "FK_d78c590925f29582a22433e8cfb" FOREIGN KEY ("raiderId") REFERENCES "raider" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "REL_d78c590925f29582a22433e8cf" UNIQUE ("raiderId"))`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
        await queryRunner.query(`ALTER TABLE "raider" RENAME TO "temporary_raider"`);
        await queryRunner.query(`CREATE TABLE "raider" ("id" varchar(32) PRIMARY KEY NOT NULL, "characterId" integer NOT NULL, "characterName" varchar(16) NOT NULL, "realm" varchar(128) NOT NULL, "role" varchar(8) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32) NOT NULL, CONSTRAINT "UQ_7c79593431c035a14b2c88c7e11" UNIQUE ("characterId", "raidTeamId"))`);
        await queryRunner.query(`INSERT INTO "raider"("id", "characterId", "characterName", "realm", "role", "createdAt", "updatedAt", "raidTeamId") SELECT "id", "characterId", "characterName", "realm", "role", "createdAt", "updatedAt", "raidTeamId" FROM "temporary_raider"`);
        await queryRunner.query(`DROP TABLE "temporary_raider"`);
        await queryRunner.query(`ALTER TABLE "raid_team" RENAME TO "temporary_raid_team"`);
        await queryRunner.query(`CREATE TABLE "raid_team" ("id" varchar(32) PRIMARY KEY NOT NULL, "name" varchar(128) NOT NULL, "region" varchar(8) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "ownerBattletag" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "raid_team"("id", "name", "region", "createdAt", "updatedAt", "ownerBattletag") SELECT "id", "name", "region", "createdAt", "updatedAt", "ownerBattletag" FROM "temporary_raid_team"`);
        await queryRunner.query(`DROP TABLE "temporary_raid_team"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`DROP TABLE "raider"`);
        await queryRunner.query(`DROP TABLE "raid_team"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
