import {MigrationInterface, QueryRunner} from "typeorm";

export class ForeignKeysCacade1629134691849 implements MigrationInterface {
    name = 'ForeignKeysCacade1629134691849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_raider" ("id" varchar(32) PRIMARY KEY NOT NULL, "characterId" integer NOT NULL, "characterName" varchar(16) NOT NULL, "realm" varchar(128) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32), "role" varchar(8) NOT NULL, CONSTRAINT "UQ_7c79593431c035a14b2c88c7e11" UNIQUE ("characterId", "raidTeamId"))`);
        await queryRunner.query(`INSERT INTO "temporary_raider"("id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId", "role") SELECT "id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId", "role" FROM "raider"`);
        await queryRunner.query(`DROP TABLE "raider"`);
        await queryRunner.query(`ALTER TABLE "temporary_raider" RENAME TO "raider"`);
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "UQ_988c3c71b5a94e91fd8521bcad4" UNIQUE ("raiderId"))`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
        await queryRunner.query(`CREATE TABLE "temporary_raider" ("id" varchar(32) PRIMARY KEY NOT NULL, "characterId" integer NOT NULL, "characterName" varchar(16) NOT NULL, "realm" varchar(128) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32), "role" varchar(8) NOT NULL, CONSTRAINT "UQ_7c79593431c035a14b2c88c7e11" UNIQUE ("characterId", "raidTeamId"), CONSTRAINT "FK_bf6b7d3b1cb8de4d829324f7d6d" FOREIGN KEY ("raidTeamId") REFERENCES "raid_team" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_raider"("id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId", "role") SELECT "id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId", "role" FROM "raider"`);
        await queryRunner.query(`DROP TABLE "raider"`);
        await queryRunner.query(`ALTER TABLE "temporary_raider" RENAME TO "raider"`);
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "UQ_988c3c71b5a94e91fd8521bcad4" UNIQUE ("raiderId"), CONSTRAINT "FK_d78c590925f29582a22433e8cfb" FOREIGN KEY ("raiderId") REFERENCES "raider" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "UQ_988c3c71b5a94e91fd8521bcad4" UNIQUE ("raiderId"))`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
        await queryRunner.query(`ALTER TABLE "raider" RENAME TO "temporary_raider"`);
        await queryRunner.query(`CREATE TABLE "raider" ("id" varchar(32) PRIMARY KEY NOT NULL, "characterId" integer NOT NULL, "characterName" varchar(16) NOT NULL, "realm" varchar(128) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32), "role" varchar(8) NOT NULL, CONSTRAINT "UQ_7c79593431c035a14b2c88c7e11" UNIQUE ("characterId", "raidTeamId"))`);
        await queryRunner.query(`INSERT INTO "raider"("id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId", "role") SELECT "id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId", "role" FROM "temporary_raider"`);
        await queryRunner.query(`DROP TABLE "temporary_raider"`);
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "FK_d78c590925f29582a22433e8cfb" FOREIGN KEY ("raiderId") REFERENCES "raider" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
        await queryRunner.query(`ALTER TABLE "raider" RENAME TO "temporary_raider"`);
        await queryRunner.query(`CREATE TABLE "raider" ("id" varchar(32) PRIMARY KEY NOT NULL, "characterId" integer NOT NULL, "characterName" varchar(16) NOT NULL, "realm" varchar(128) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32), "role" varchar(8) NOT NULL, CONSTRAINT "UQ_7c79593431c035a14b2c88c7e11" UNIQUE ("characterId", "raidTeamId"), CONSTRAINT "FK_bf6b7d3b1cb8de4d829324f7d6d" FOREIGN KEY ("raidTeamId") REFERENCES "raid_team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "raider"("id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId", "role") SELECT "id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId", "role" FROM "temporary_raider"`);
        await queryRunner.query(`DROP TABLE "temporary_raider"`);
    }

}
