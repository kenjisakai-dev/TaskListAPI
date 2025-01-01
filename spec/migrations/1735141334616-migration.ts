import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1735141334616 implements MigrationInterface {
    name = 'Migration1735141334616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "status" ("cod_status" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "description" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "task" ("cod_task" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "cod_user" integer NOT NULL, "cod_status" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("cod_user" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("cod_task" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "cod_user" integer NOT NULL, "cod_status" integer NOT NULL, CONSTRAINT "FK_5aedab2e9db5526a60b94ecf8cd" FOREIGN KEY ("cod_user") REFERENCES "user" ("cod_user") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_daf2f15bf91771e3661b4143c39" FOREIGN KEY ("cod_status") REFERENCES "status" ("cod_status") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("cod_task", "title", "description", "cod_user", "cod_status") SELECT "cod_task", "title", "description", "cod_user", "cod_status" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);

        await queryRunner.query(`INSERT INTO "status" ("description") VALUES ('New')`);
        await queryRunner.query(`INSERT INTO "status" ("description") VALUES ('Running')`);
        await queryRunner.query(`INSERT INTO "status" ("description") VALUES ('Done')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("cod_task" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" text NOT NULL, "cod_user" integer NOT NULL, "cod_status" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "task"("cod_task", "title", "description", "cod_user", "cod_status") SELECT "cod_task", "title", "description", "cod_user", "cod_status" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "status"`);
    }

}
