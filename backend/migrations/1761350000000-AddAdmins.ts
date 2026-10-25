import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdmins1761350000000 implements MigrationInterface {
    name = "AddAdmins1761350000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin" ("battletag" text PRIMARY KEY NOT NULL)`);
        await queryRunner.query(`INSERT INTO "admin"("battletag") VALUES ('PhoenixFlame#2150')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "admin"`);
    }
}
