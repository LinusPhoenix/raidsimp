import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateInitialTables1627298518002 implements MigrationInterface {
    name = 'CreateInitialTables1627298518002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "raider" ("id" varchar(32) PRIMARY KEY NOT NULL, "characterId" integer NOT NULL, "characterName" varchar(16) NOT NULL, "realm" varchar(128) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32), CONSTRAINT "UQ_d50a11d0d175e7d581c2e70fdd5" UNIQUE ("characterName", "realm", "raidTeamId"))`);
        await queryRunner.query(`CREATE TABLE "raid_team" ("id" varchar(32) PRIMARY KEY NOT NULL, "name" varchar(128) NOT NULL, "region" varchar(8) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_9baa03661511c56d72e92d0814e" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "temporary_raider" ("id" varchar(32) PRIMARY KEY NOT NULL, "characterId" integer NOT NULL, "characterName" varchar(16) NOT NULL, "realm" varchar(128) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32), CONSTRAINT "UQ_d50a11d0d175e7d581c2e70fdd5" UNIQUE ("characterName", "realm", "raidTeamId"), CONSTRAINT "FK_bf6b7d3b1cb8de4d829324f7d6d" FOREIGN KEY ("raidTeamId") REFERENCES "raid_team" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_raider"("id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId") SELECT "id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId" FROM "raider"`);
        await queryRunner.query(`DROP TABLE "raider"`);
        await queryRunner.query(`ALTER TABLE "temporary_raider" RENAME TO "raider"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "raider" RENAME TO "temporary_raider"`);
        await queryRunner.query(`CREATE TABLE "raider" ("id" varchar(32) PRIMARY KEY NOT NULL, "characterId" integer NOT NULL, "characterName" varchar(16) NOT NULL, "realm" varchar(128) NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "raidTeamId" varchar(32), CONSTRAINT "UQ_d50a11d0d175e7d581c2e70fdd5" UNIQUE ("characterName", "realm", "raidTeamId"))`);
        await queryRunner.query(`INSERT INTO "raider"("id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId") SELECT "id", "characterId", "characterName", "realm", "createdAt", "updatedAt", "raidTeamId" FROM "temporary_raider"`);
        await queryRunner.query(`DROP TABLE "temporary_raider"`);
        await queryRunner.query(`DROP TABLE "raid_team"`);
        await queryRunner.query(`DROP TABLE "raider"`);
    }

}
