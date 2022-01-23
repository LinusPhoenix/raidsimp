import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserEntity1642963634876 implements MigrationInterface {
    name = 'AddUserEntity1642963634876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "FK_d78c590925f29582a22433e8cfb" FOREIGN KEY ("raiderId") REFERENCES "raider" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
        await queryRunner.query(`CREATE TABLE "user" ("battletag" text PRIMARY KEY NOT NULL, "id" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_cace4a159ff9f2512dd42373760" UNIQUE ("id"))`);
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
        await queryRunner.query(`CREATE TABLE "temporary_cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "UQ_988c3c71b5a94e91fd8521bcad4" UNIQUE ("raiderId"))`);
        await queryRunner.query(`INSERT INTO "temporary_cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "cached_overview"`);
        await queryRunner.query(`DROP TABLE "cached_overview"`);
        await queryRunner.query(`ALTER TABLE "temporary_cached_overview" RENAME TO "cached_overview"`);
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
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "FK_d78c590925f29582a22433e8cfb" FOREIGN KEY ("raiderId") REFERENCES "raider" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "cached_overview" RENAME TO "temporary_cached_overview"`);
        await queryRunner.query(`CREATE TABLE "cached_overview" ("updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "cachedOverview" varchar NOT NULL, "raiderId" varchar(32) PRIMARY KEY NOT NULL, CONSTRAINT "FK_d78c590925f29582a22433e8cfb" FOREIGN KEY ("raiderId") REFERENCES "raider" ("id") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "cached_overview"("updatedAt", "cachedOverview", "raiderId") SELECT "updatedAt", "cachedOverview", "raiderId" FROM "temporary_cached_overview"`);
        await queryRunner.query(`DROP TABLE "temporary_cached_overview"`);
    }

}
