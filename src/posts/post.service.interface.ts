import {PostCreateDto} from "./dto/post-create.dto";
import {PostUpdateDto} from "./dto/post-update.dto";

export interface IPostService {
    createPost: (dto: PostCreateDto, user: any) => Promise<any>;
    getAllPost: (page: number, limit: number) => Promise<any>;
    getOne: (id: string) => Promise<any>;
    delete: (postId: string, userId: string) => Promise<any>;
    updatePost: (dto: PostUpdateDto, postId: string, userId: string) => Promise<any>;
}