import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {IConfigService} from "../config/config.service.interface";
import {IPostService} from "./post.service.interface";
import {PostCreateDto} from "./dto/post-create.dto";
import {IPostRepository} from "./post.repository.interface";
import {PostUpdateDto} from "./dto/post-update.dto";
import {Post} from "./post.entity";
import {User} from "../users/user.entity";
import PostModel, {IPost} from "../models/Post";

@injectable()
export class PostService implements IPostService {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PostsRepository) private postsRepository: IPostRepository,
    ) {
    }

    async createPost({message}: PostCreateDto, user: User): Promise<any> {
        const post = new Post(message, user);
        return this.postsRepository.create(post);
    }

    async delete(postId: string, userId: string): Promise<any> {
        const findPost = await PostModel.findById(postId);
        if (!findPost) {
            return false;
        } else {
            const findPostId = findPost.user.toString();
            if (findPostId === userId) {
                return await this.postsRepository.delete(postId);
            } else {
                return false;
            }
        }
    }

    async getAllPost(page: number, limit: number): Promise<IPost[]> {
        const skip = (page - 1) * limit;
        return this.postsRepository.getAll(skip, limit);
    }

    async getOne(id: string): Promise<any> {
        const post = this.postsRepository.find(id);
        if (!post) {
            return false
        }
        return post;
    }

    async updatePost({message}: PostUpdateDto, postId: string, userId: string): Promise<any> {
        const findPost = await PostModel.findById(postId);
        if (!findPost) {
            return false;
        }
        const findPostId = findPost.user.toString();
        if (findPostId === userId) {
            return await this.postsRepository.update(message, postId);
        }
        return false;


    }


}