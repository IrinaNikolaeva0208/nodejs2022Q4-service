import { Injectable } from "@nestjs/common";
import { Artist } from "./interfaces/artist.interface";
import { v4 } from "uuid";
import { ArtistDto } from "./dto/artist.dto";

@Injectable()
export class ArtistService {
    private readonly artists: Artist[] = [];

    findAll() {
        return this.artists;
    }

    findOne(id: string) {
        return this.artists.find(artist => artist.id == id)
    }

    create(dto: ArtistDto) {
        const id = v4();
        let newArtist = {
            ...dto,
            id: id
        }
        this.artists.push(newArtist);
        return newArtist;
    }

    change(id: string, dto: ArtistDto) {
        let artistToUpdate = this.artists.find(artist => artist.id == id);
        if(artistToUpdate) artistToUpdate = {...dto, id};
        return artistToUpdate;
    }

    delete(id: string) {
        const userToDelete = this.artists.find(user => user.id == id);
        if(userToDelete) this.artists.splice(this.artists.indexOf(userToDelete), 1);
        return userToDelete;
    }
}