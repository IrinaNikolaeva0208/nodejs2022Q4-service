import {Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, HttpException} from "@nestjs/common";
import { validate } from "uuid";
import { AlbumService } from "./albums.service";

@Controller("Album")
export class AlbumsController {
    constructor(private albumService: AlbumService) {}

    @Get()
    async getAllAlbums() {
       return this.albumService.findAll();
    }

    @Get(":id")
    async getAlbumById(@Param() params) {
        if(!validate(params.id)) throw new HttpException("Invalid ID", HttpStatus.BAD_REQUEST);
        const albumToGet = this.albumService.findOne(params.id);
        if(!albumToGet) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        return albumToGet;
    }

    @Post()
    async createAlbum(@Body() createAlbumDto) {
        const dtoKeys = Object.keys(createAlbumDto);
        if(!["login", "password"].every(field => dtoKeys.includes(field)) || dtoKeys.length != 2) throw new HttpException("Invalid data", HttpStatus.BAD_REQUEST);
        return this.albumService.create(createAlbumDto);
    }

    @Put(":id")
    async updateAlbum(@Body() updateAlbumDto, @Param() params) {
        const dtoKeys = Object.keys(updateAlbumDto);
        if(!["oldPassword", "newPassword"].every(field => dtoKeys.includes(field)) || dtoKeys.length != 2) throw new HttpException("Invalid data", HttpStatus.BAD_REQUEST);
        if(!validate(params.id)) throw new HttpException("Invalid ID", HttpStatus.BAD_REQUEST);
        const albumToUpdate =  this.albumService.change(params.id, updateAlbumDto);
        if(!albumToUpdate) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        return albumToUpdate;
    }

    @Delete(":id")
    @HttpCode(204)
    async deleteAlbum(@Param() params) {
        if(!validate(params.id)) throw new HttpException("Invalid ID", HttpStatus.BAD_REQUEST);
        const albumToDelete = this.albumService.delete(params.id);
        if(!albumToDelete) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
}