import { Injectable } from "@nestjs/common";
import { Album } from "./intefaces/album.interface";
import { v4 } from "uuid";
import { AlbumDto } from "./dto/album.dto"

@Injectable()
export class AlbumService {
    private readonly albums: Album[] = [];

    findAll() {
        return this.albums
    }

    findOne(id: string) {
        return this.albums.find(album => album.id == id);
    }

    create(dto: AlbumDto) {
        const id = v4();
        let newAlbum = {id: id, ...dto}
        this.albums.push(newAlbum);
        return newAlbum;
    }

    change(id: string, dto: AlbumDto) {
        let albumToUpdate = this.albums.find(album => album.id == id);
        if(albumToUpdate) albumToUpdate = {id: id, ...dto};
        return albumToUpdate;
    }

    delete(id: string) {
        const albumToDelete = this.albums.find(user => user.id == id);
        if(albumToDelete) this.albums.splice(this.albums.indexOf(albumToDelete), 1);
        return albumToDelete;
    }
}