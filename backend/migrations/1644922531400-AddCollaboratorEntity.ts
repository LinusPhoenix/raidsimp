import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCollaboratorEntity1644922531400 implements MigrationInterface {
    name = 'AddCollaboratorEntity1644922531400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "FK_d78c590925f29582a22433e8cfb" FOREIGN KEY ("raiderId") REFERENCES "raider" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
        await queryRunner.query(`CREATE TABLE "collaborator" ("battletag" varchar(32) NOT NULL, "role" varchar(32) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32) NOT NULL, PRIMARY KEY ("battletag", "raidTeamId"))`);
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "UQ_988c3c71b5a94e91fd8521bcad4" UNIQUE ("raiderId"))`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
        await queryRunner.query(`CREATE TABLE "temporary_collaborator" ("battletag" varchar(32) NOT NULL, "role" varchar(32) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32) NOT NULL, CONSTRAINT "FK_b74cbde443c6a1f9575c36c3fa7" FOREIGN KEY ("raidTeamId") REFERENCES "raid_team" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("battletag", "raidTeamId"))`);
        await queryRunner.query(`INSERT INTO "temporary_collaborator"("battletag", "role", "createdAt", "updatedAt", "raidTeamId") SELECT "battletag", "role", "createdAt", "updatedAt", "raidTeamId" FROM "collaborator"`);
        await queryRunner.query(`DROP TABLE "collaborator"`);
        await queryRunner.query(`ALTER TABLE "temporary_collaborator" RENAME TO "collaborator"`);
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
        await queryRunner.query(`ALTER TABLE "collaborator" RENAME TO "temporary_collaborator"`);
        await queryRunner.query(`CREATE TABLE "collaborator" ("battletag" varchar(32) NOT NULL, "role" varchar(32) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32) NOT NULL, PRIMARY KEY ("battletag", "raidTeamId"))`);
        await queryRunner.query(`INSERT INTO "collaborator"("battletag", "role", "createdAt", "updatedAt", "raidTeamId") SELECT "battletag", "role", "createdAt", "updatedAt", "raidTeamId" FROM "temporary_collaborator"`);
        await queryRunner.query(`DROP TABLE "temporary_collaborator"`);
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "FK_d78c590925f29582a22433e8cfb" FOREIGN KEY ("raiderId") REFERENCES "raider" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "collaborator"`);
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "FK_d78c590925f29582a22433e8cfb" FOREIGN KEY ("raiderId") REFERENCES "raider" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
    }

}
