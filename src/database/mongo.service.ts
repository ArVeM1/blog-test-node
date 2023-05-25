import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { connect, disconnect } from "mongoose";

@injectable()
export class MongoService {

  constructor(@inject(TYPES.ILogger) private logger: ILogger) {
  }

  async connect(): Promise<void> {
    try {
      await connect('mongodb+srv://admin:wwwwww@cluster0.wezw4.mongodb.net/blog-test?retryWrites=true&w=majority');
      this.logger.log('[MongoService] Успешно подключились к БД');
    } catch (e) {
      if (e instanceof Error) {
        this.logger.error('[MongoService] ошибка подключения к БД' + e.message);
      }
    }
  }

  async disconnect(): Promise<void> {
    await disconnect();
  }
}
