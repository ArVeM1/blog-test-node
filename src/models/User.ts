import mongoose from "mongoose";

export interface IUser {
    _id: string;
    email: string;
    name: string;
    password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

export default mongoose.model<IUser>('User', UserSchema)
