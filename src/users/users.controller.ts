import {
  Controller,
  Put,
  Body,
  Get,
  Post,
  Delete,
  Param,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { Role } from 'src/auth/enums/roles.enum';
import { Roles } from 'src/auth/decorators/roles';
import { Public } from 'src/auth/decorators/public';
import { adminDto } from './dto/createAdmin.dto';
import { User } from './entities/user.entity';
import {
  ApiTags,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('user')
export class UsersController {
  constructor(private service: UserService) {}

  @ApiCreatedResponse({ description: 'Successfully created', type: User })
  @Public()
  @Post('admin')
  async createAdmin(): Promise<
    Omit<User, 'favourites' | 'toResponse' | 'password'>
  > {
    return await this.service.create(adminDto, Role.Admin);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successful operation', type: [User] })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.Admin)
  @Get()
  async getAllUsers(): Promise<
    Omit<User, 'favourites' | 'toResponse' | 'password'>[]
  > {
    return await this.service.findAll();
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successful operation', type: User })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.Admin)
  @Get(':id')
  async getUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Omit<User, 'favourites' | 'toResponse' | 'password'>> {
    return await this.service.findOneById(id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Successfully updated', type: User })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id or dto' })
  @ApiNotFoundResponse({ description: 'Track not found' })
  @Put(':id')
  async updateUser(
    @Body() updateDto: UpdatePasswordDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Omit<User, 'favourites' | 'toResponse' | 'password'>> {
    return await this.service.update(id, updateDto);
  }

  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Successfully deleted' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Invalid id' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Operation forbidden' })
  @Roles(Role.Admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.service.delete(id);
  }
}
