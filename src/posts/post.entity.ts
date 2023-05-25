import {User} from "../users/user.entity";


export class Post {
    constructor(private readonly _message: string,
                private readonly _user: User) {
    }

    get message(): string {
        return this._message;
    }

    get user(): any {
        return this._user;
    }
}