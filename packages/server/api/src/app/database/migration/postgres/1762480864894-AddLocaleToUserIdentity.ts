import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddLocaleToUserIdentity1762480864894 implements MigrationInterface {
    name = 'AddLocaleToUserIdentity1762480864894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_identity"
            ADD "locale" character varying
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_identity" DROP COLUMN "locale"
        `)
    }
}

