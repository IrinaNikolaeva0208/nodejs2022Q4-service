import { CreateUserDto } from './createUser.dto';
import * as dotenv from 'dotenv';

dotenv.config();

const adminDto: CreateUserDto = {
  login: process.env.ADMIN_LOGIN,
  password: process.env.ADMIN_PASSWORD,
};

export { adminDto };
