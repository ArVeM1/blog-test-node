import { NextFunction, Request, Response } from 'express';
import {inject, injectable} from "inversify";
import {BaseController} from "../common/base.controller";
import {TYPES} from "../types";
import {ILogger} from "../logger/logger.interface";
import {IConfigService} from "../config/config.service.interface";
import {IPostsController} from "./post.controller.interface";
import {IPostService} from "./post.service.interface";
import {PostCreateDto} from "./dto/post-create.dto";
import {AuthGuard} from "../common/auth.guard";
import {IPost} from "../models/Post";
import {HTTPError} from "../errors/http-error.class";
import 'reflect-metadata';

@injectable()
export class PostController extends BaseController implements IPostsController {
    constructor(@inject(TYPES.ILogger) private loggerService: ILogger,
                @inject(TYPES.PostService) private postService: IPostService,
                @inject(TYPES.ConfigService) private configService: IConfigService) {
        super(loggerService);
        this.bindRoutes([
            {
                path: '/',
                method: 'post',
                func: this.create,
                middlewares: [new AuthGuard()],
            },
            {
                path: '/',
                method: 'get',
                func: this.getAll,
                middlewares: [],
            },
            {
                path: '/:id',
                method: 'delete',
                func: this.delete,
                middlewares: [new AuthGuard()],
            },
            {
                path: '/:id',
                method: 'get',
                func: this.getOne,
                middlewares: [],
            },
            {
                path: '/:id',
                method: 'patch',
                func: this.update,
                middlewares: [new AuthGuard()],
            },
        ]);
    }

    async create(req: Request<{}, {}, PostCreateDto>, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postService.createPost(req.body, req.userId);
            this.ok(res, { message: result.message })
        } catch (e) {
            return next(new HTTPError(400, 'неправильный, некорректный запрос'))
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<IPost[] | void> {
        // @ts-ignore
        const page = parseInt(req.query.page) || 1;
        // @ts-ignore
        const limit = parseInt(req.query.limit) || 20;

        const posts = await this.postService.getAllPost(page, limit);
        this.ok(res, posts)
    }

    async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.postService.getOne(req.params.id);
            this.ok(res, { post: {id: result.id, message: result.message} });
        } catch (e) {
            return next(new HTTPError(404, 'Такой статьи не существует'))
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const postId = req.params.id;
        const result = await this.postService.delete(postId, req.userId);
        if (!result) {
            return next(new HTTPError(404, 'Такой статьи не существует или у вас нету доступа'))
        }
        this.ok(res, { result: "Успешно удалено" });
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const result = await this.postService.updatePost(req.body, id, req.userId);
            this.ok(res, { result: "Пост обновлен" });
        } catch (e) {
            return next(new HTTPError(404, 'Такой статьи не существует или у вас нету доступа'))
        }
    }


}