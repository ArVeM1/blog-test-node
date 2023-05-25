import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {MongoService} from "../database/mongo.service";
import PostModel, {IPost} from "../models/Post";
import {IPostRepository} from "./post.repository.interface";
import {Post} from "./post.entity";


@injectable()
export class PostRepository implements IPostRepository {
    constructor(@inject(TYPES.MongoService) private mongoService: MongoService) {
    }

    async create({message, user}: Post): Promise<IPost> {
        return await PostModel.create({message, user})
    }

    async getAll(skip: number, limit: number): Promise<IPost[]> {
        return PostModel.find().skip(skip).limit(limit);
    }

    async find(id: string): Promise<any> {
        return PostModel.findById(id).populate("user");
    }

    async delete(postId: string): Promise<any | null> {
        return PostModel.findByIdAndDelete({_id: postId});
    }

    async update(message: string, postId: string): Promise<any> {
        return PostModel.findByIdAndUpdate(postId, {message})
    }


}