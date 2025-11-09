import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddLocaleToUserIdentitySqlite1762480864895 implements MigrationInterface {
    name = 'AddLocaleToUserIdentitySqlite1762480864895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_identity"
            ADD COLUMN "locale" varchar
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_user_identity" (
                "id" varchar(21) PRIMARY KEY NOT NULL,
                "created" datetime NOT NULL DEFAULT (datetime('now')),
                "updated" datetime NOT NULL DEFAULT (datetime('now')),
                "email" varchar NOT NULL,
                "password" varchar NOT NULL,
                "trackEvents" boolean,
                "newsLetter" boolean,
                "verified" boolean NOT NULL DEFAULT (0),
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "tokenVersion" varchar,
                "provider" varchar NOT NULL,
                CONSTRAINT "UQ_7ad44f9fcbfc95e0a8436bbb029" UNIQUE ("email")
            )
        `)
        
        await queryRunner.query(`
            INSERT INTO "temporary_user_identity" 
            SELECT "id", "created", "updated", "email", "password", "trackEvents", 
                   "newsLetter", "verified", "firstName", "lastName", "tokenVersion", "provider"
            FROM "user_identity"
        `)
        
        await queryRunner.query(`DROP TABLE "user_identity"`)
        
        await queryRunner.query(`ALTER TABLE "temporary_user_identity" RENAME TO "user_identity"`)
        
        await queryRunner.query(`
            CREATE UNIQUE INDEX "idx_user_identity_email" ON "user_identity" ("email")
        `)
    }
}

