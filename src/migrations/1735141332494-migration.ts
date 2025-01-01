import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1735141332494 implements MigrationInterface {
    name = 'Migration1735141332494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`status\` (\`cod_status\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`cod_status\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`task\` (\`cod_task\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`cod_user\` int NOT NULL, \`cod_status\` int NOT NULL, PRIMARY KEY (\`cod_task\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`cod_user\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`cod_user\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_5aedab2e9db5526a60b94ecf8cd\` FOREIGN KEY (\`cod_user\`) REFERENCES \`user\`(\`cod_user\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_daf2f15bf91771e3661b4143c39\` FOREIGN KEY (\`cod_status\`) REFERENCES \`status\`(\`cod_status\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`INSERT INTO \`status\` (\`description\`) VALUES ('New')`);
        await queryRunner.query(`INSERT INTO \`status\` (\`description\`) VALUES ('Running')`);
        await queryRunner.query(`INSERT INTO \`status\` (\`description\`) VALUES ('Done')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_daf2f15bf91771e3661b4143c39\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_5aedab2e9db5526a60b94ecf8cd\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`task\``);
        await queryRunner.query(`DROP TABLE \`status\``);
    }

}
