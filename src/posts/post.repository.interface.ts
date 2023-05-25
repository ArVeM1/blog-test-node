import {IPost} from "../models/Post";
import {Post} from "./post.entity";

export interface IPostRepository {
    getAll(skip: number, limit: number): Promise<IPost[]>;
    create(post: Post): Promise<IPost>;
    find(id: string): Promise<IPost>;
    update(post: any, userId: string): Promise<any>;
    delete(postId: string): Promise<any>;

}