import {Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, HttpException} from "@nestjs/common";
import { validate } from "uuid";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdatePasswordDto } from "./dto/updatePassword.dto";
import { User } from "./interfaces/user.interface";
import { UserService } from "./users.service";

@Controller("user")
export class UsersController {
    constructor(private userService: UserService) {}

    @Get()
    async getAllUsers() {
       return this.userService.findAll();
    }


    @Get(":id")
    async getUserById(@Param() params) {
        if(!validate(params.id)) throw new HttpException("Invalid ID", HttpStatus.BAD_REQUEST);
        const userToGet = this.userService.findOne(params.id);
        if(!userToGet) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        return userToGet;
    }

    @Post()
    createUser(@Body() createUserDto) {
        const dtoKeys = Object.keys(createUserDto);
        if(!["login", "password"].every(field => dtoKeys.includes(field)) || dtoKeys.length != 2) throw new HttpException("Invalid data", HttpStatus.BAD_REQUEST);
        return this.userService.create(createUserDto);
    }

    @Put(":id")
    updatePassword(@Body() updatePasswordDto, @Param() params) {
        const dtoKeys = Object.keys(updatePasswordDto);
        if(!["oldPassword", "newPassword"].every(field => dtoKeys.includes(field)) || dtoKeys.length != 2) throw new HttpException("Invalid data", HttpStatus.BAD_REQUEST);
        if(!validate(params.id)) throw new HttpException("Invalid ID", HttpStatus.BAD_REQUEST);
        let userToUpdate;
        try {
            userToUpdate =  this.userService.change(params.id, updatePasswordDto);
        }
        catch(err) {
            throw new HttpException("Forbidden: Wrong password", HttpStatus.FORBIDDEN);
        }
        if(!userToUpdate) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        return userToUpdate;
    }

   
    @Delete(":id")
    @HttpCode(204)
    async deleteUser(@Param() params) {
        if(!validate(params.id)) throw new HttpException("Invalid ID", HttpStatus.BAD_REQUEST);
        const userToDelete = this.userService.delete(params.id);
        if(!userToDelete) throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
}