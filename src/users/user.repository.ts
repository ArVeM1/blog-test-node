import { IUserRepository } from './user.repository.interface';
import { User } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import {MongoService} from '../database/mongo.service';
import UserModel, {IUser} from '../models/User';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(TYPES.MongoService) private mongoService: MongoService) {
  }

  async create({ email, password, name }: User): Promise<IUser> {
    return await UserModel.create({email, name, password});
  }

  async find(email: string): Promise<IUser | null> {
    return UserModel.where({ email: email }).findOne();
  }
}
