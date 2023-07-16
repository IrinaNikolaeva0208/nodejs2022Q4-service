import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1689404333859 implements MigrationInterface {
    name = 'Init1689404333859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "track" DROP CONSTRAINT "FK_1c2dd296653517481128de6e9b7"`);
        await queryRunner.query(`ALTER TABLE "artist" DROP CONSTRAINT "FK_0543d5bf80a954fa1f9843099ba"`);
        await queryRunner.query(`ALTER TABLE "album" DROP CONSTRAINT "FK_ab14ce767e68be5b2ab881db2c7"`);
        await queryRunner.query(`CREATE TABLE "favourites_tracks_track" ("favouritesId" uuid NOT NULL, "trackId" uuid NOT NULL, CONSTRAINT "PK_b4065f95a7f48d0474504b97443" PRIMARY KEY ("favouritesId", "trackId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7230bc569bf6a32fc22ce79148" ON "favourites_tracks_track" ("favouritesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_99f64435c305316669c854e335" ON "favourites_tracks_track" ("trackId") `);
        await queryRunner.query(`CREATE TABLE "favourites_artists_artist" ("favouritesId" uuid NOT NULL, "artistId" uuid NOT NULL, CONSTRAINT "PK_ce20e45e503a3ab6f039755f676" PRIMARY KEY ("favouritesId", "artistId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_941f4f9b345f78d3cef9ba5447" ON "favourites_artists_artist" ("favouritesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a1c16c965e0d1aff4b27efe88c" ON "favourites_artists_artist" ("artistId") `);
        await queryRunner.query(`CREATE TABLE "favourites_albums_album" ("favouritesId" uuid NOT NULL, "albumId" uuid NOT NULL, CONSTRAINT "PK_f9176bbfcda1adc7033a0123b4c" PRIMARY KEY ("favouritesId", "albumId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_862bf616e8f8397225d04f8f63" ON "favourites_albums_album" ("favouritesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4f3faa2a40616aa9932ac8d96d" ON "favourites_albums_album" ("albumId") `);
        await queryRunner.query(`ALTER TABLE "track" DROP COLUMN "favsId"`);
        await queryRunner.query(`ALTER TABLE "artist" DROP COLUMN "favsId"`);
        await queryRunner.query(`ALTER TABLE "album" DROP COLUMN "favsId"`);
        await queryRunner.query(`ALTER TABLE "favourites_tracks_track" ADD CONSTRAINT "FK_7230bc569bf6a32fc22ce791484" FOREIGN KEY ("favouritesId") REFERENCES "favourites"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favourites_tracks_track" ADD CONSTRAINT "FK_99f64435c305316669c854e335e" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favourites_artists_artist" ADD CONSTRAINT "FK_941f4f9b345f78d3cef9ba54471" FOREIGN KEY ("favouritesId") REFERENCES "favourites"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favourites_artists_artist" ADD CONSTRAINT "FK_a1c16c965e0d1aff4b27efe88c5" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favourites_albums_album" ADD CONSTRAINT "FK_862bf616e8f8397225d04f8f631" FOREIGN KEY ("favouritesId") REFERENCES "favourites"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favourites_albums_album" ADD CONSTRAINT "FK_4f3faa2a40616aa9932ac8d96d9" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favourites_albums_album" DROP CONSTRAINT "FK_4f3faa2a40616aa9932ac8d96d9"`);
        await queryRunner.query(`ALTER TABLE "favourites_albums_album" DROP CONSTRAINT "FK_862bf616e8f8397225d04f8f631"`);
        await queryRunner.query(`ALTER TABLE "favourites_artists_artist" DROP CONSTRAINT "FK_a1c16c965e0d1aff4b27efe88c5"`);
        await queryRunner.query(`ALTER TABLE "favourites_artists_artist" DROP CONSTRAINT "FK_941f4f9b345f78d3cef9ba54471"`);
        await queryRunner.query(`ALTER TABLE "favourites_tracks_track" DROP CONSTRAINT "FK_99f64435c305316669c854e335e"`);
        await queryRunner.query(`ALTER TABLE "favourites_tracks_track" DROP CONSTRAINT "FK_7230bc569bf6a32fc22ce791484"`);
        await queryRunner.query(`ALTER TABLE "album" ADD "favsId" uuid`);
        await queryRunner.query(`ALTER TABLE "artist" ADD "favsId" uuid`);
        await queryRunner.query(`ALTER TABLE "track" ADD "favsId" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f3faa2a40616aa9932ac8d96d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_862bf616e8f8397225d04f8f63"`);
        await queryRunner.query(`DROP TABLE "favourites_albums_album"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a1c16c965e0d1aff4b27efe88c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_941f4f9b345f78d3cef9ba5447"`);
        await queryRunner.query(`DROP TABLE "favourites_artists_artist"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_99f64435c305316669c854e335"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7230bc569bf6a32fc22ce79148"`);
        await queryRunner.query(`DROP TABLE "favourites_tracks_track"`);
        await queryRunner.query(`ALTER TABLE "album" ADD CONSTRAINT "FK_ab14ce767e68be5b2ab881db2c7" FOREIGN KEY ("favsId") REFERENCES "favourites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "artist" ADD CONSTRAINT "FK_0543d5bf80a954fa1f9843099ba" FOREIGN KEY ("favsId") REFERENCES "favourites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "track" ADD CONSTRAINT "FK_1c2dd296653517481128de6e9b7" FOREIGN KEY ("favsId") REFERENCES "favourites"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
