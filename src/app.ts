import express, { Express } from 'express';
import { Server } from 'http';
import { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import {UserController} from "./users/users.controller";
import {IExeptionFilter} from "./errors/exeption.filter.interface";
import {AuthMiddleware} from "./common/auth.middleware";
import {IConfigService} from "./config/config.service.interface";
import {MongoService} from "./database/mongo.service";
import {PostController} from "./posts/post.controller";

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;
    constructor(@inject(TYPES.ILogger) private logger: ILogger,
                @inject(TYPES.UserController) private userController: UserController,
                @inject(TYPES.PostController) private postController: PostController,
                @inject(TYPES.ExeptionFilter) private exeptionFilter: IExeptionFilter,
                @inject(TYPES.ConfigService) private configService: IConfigService,
                @inject(TYPES.MongoService) private mongoService: MongoService,
    ) {
        this.app = express();
        this.port = 8000;
    }

    useMiddleware(): void {
        this.app.use(express.json());
        const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
        this.app.use('/posts', this.postController.router);
    }

    useExeptionFilters(): void {
        this.app.use(this.exeptionFilter.catch.bind(this.exeptionFilter));
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useRoutes();
        this.useExeptionFilters();
        await this.mongoService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server started on http://localhost:${this.port}`);
    }
}