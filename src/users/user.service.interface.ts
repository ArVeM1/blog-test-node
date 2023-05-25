import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import {IUser} from "../models/User";

export interface IUserService {
  createUser: (dto: UserRegisterDto) => Promise<IUser | null>;
  validateUser: (dto: UserLoginDto) => Promise<boolean>;
  getUserInfo: (email: string) => Promise<IUser | null>;
}
