import { Role } from '../enums/roles.enum';

export interface UserPayload {
  sub: string;
  login: string;
  role: Role;
}
