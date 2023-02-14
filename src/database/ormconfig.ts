import * as dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

dotenv.config();

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [User],
  synchronize: true,
};

export { options };
