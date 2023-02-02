import { Injectable, HttpCode } from "@nestjs/common";
import { User } from "./interfaces/user.interface";
import { v4 } from "uuid";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdatePasswordDto } from "./dto/updatePassword.dto";

@Injectable()
export class UserService {
    private readonly users: User[] = [];

    findAll() {
        return this.users;
    }

    findOne(id: string) {
        const userToGet = this.users.find(user => user.id == id);
        if(userToGet) {
            return {
                id: id,
                login: userToGet.login,
                version: userToGet.version,
                createdAt: userToGet.createdAt,
                updatedAt: userToGet.updatedAt
            }
        }
        return userToGet;
    }

    create(dto: CreateUserDto) {
        const timestamp = +new Date();
        const id = v4();
        const version = 1;
        let newUser : User = {
            ...dto,
            id: id,
            version: version,
            createdAt: timestamp,
            updatedAt: timestamp
        }
        this.users.push(newUser);
        return {
            id: id,
            login: newUser.login,
            version: version,
            createdAt: timestamp,
            updatedAt: timestamp
        };
    }

    change(id: string, dto: UpdatePasswordDto) {
        const userToUpdate = this.users.find(user => user.id == id);
        if(userToUpdate) {
            if (userToUpdate.password != dto.oldPassword) throw new Error();
            userToUpdate.password = dto.newPassword;
            userToUpdate.updatedAt = +new Date();
            userToUpdate.version++;
            return {
                id: id,
                login: userToUpdate.login,
                version: userToUpdate.version,
                createdAt: userToUpdate.createdAt,
                updatedAt: userToUpdate.updatedAt
            }
        }
        return userToUpdate;
    }

    delete(id: string) {
        const userToDelete = this.users.find(user => user.id == id);
        if(userToDelete) this.users.splice(this.users.indexOf(userToDelete), 1);
        return userToDelete;
    }
}