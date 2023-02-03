import { Module } from "@nestjs/common";
import { AlbumsController } from "./albums.controller";
import { AlbumService } from "./albums.service";

@Module({
    controllers: [AlbumsController],
    providers: [AlbumService],
})
export class AlbumsModule{}