import {Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpCode, HttpException} from "@nestjs/common";
import {validate} from "uuid";
import { ArtistService } from "./artists.service";

@Controller("artist")
export class ArtistsController {
    constructor(private artistService: ArtistService) {}

    @Get()
    async getAllArtits() {
        return this.artistService.findAll();
    }

    @Get(":id")
    async getArtistById(@Param() params) {
        if(!validate(params.id)) throw new HttpException("Invalid ID", HttpStatus.BAD_REQUEST);
        const artistToGet = this.artistService.findOne(params.id);
        if(!artistToGet) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        return artistToGet;
    }

    @Post()
    async createArtist(@Body() createArtistDto) {
        const dtoKeys = Object.keys(createArtistDto);
        if(!["name", "grammy"].every(field => dtoKeys.includes(field)) || dtoKeys.length != 2) throw new HttpException("Invalid data", HttpStatus.BAD_REQUEST);
        return this.artistService.create(createArtistDto);
    }

    @Put(":id")
    async updatePassword(@Body() updateArtistDto, @Param() params) {
        const dtoKeys = Object.keys(updateArtistDto);
        if(!["name", "grammy"].every(field => dtoKeys.includes(field)) || dtoKeys.length != 2) throw new HttpException("Invalid data", HttpStatus.BAD_REQUEST);
        if(!validate(params.id)) throw new HttpException("Invalid ID", HttpStatus.BAD_REQUEST);
        const artistToUpdate =  this.artistService.change(params.id, updateArtistDto);
        if(!artistToUpdate) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        return artistToUpdate;
    }
 
    @Delete(":id")
    @HttpCode(204)
    async deleteUser(@Param() params) {
        if(!validate(params.id)) throw new HttpException("Invalid ID", HttpStatus.BAD_REQUEST);
        const artistToDelete = this.artistService.delete(params.id);
        if(!artistToDelete) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
}