import mongoose from "mongoose";

export interface IPost {
    message: string;
    user: any;
}

const PostSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},
    {
        timestamps: true
    });

export default mongoose.model('Post', PostSchema)