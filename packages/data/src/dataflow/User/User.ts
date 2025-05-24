export interface UserOptions {
    username: string;
    avatar: string;
    url: string;
    id: string;
    followers: number;
    following: number;
}

export class User {
    username: string;
    avatar: string;
    url: string;
    id: string;
    followers: number;
    following: number;

    constructor(opts: UserOptions) {
        this.username = opts.username;
        this.avatar = opts.avatar;
        this.url = opts.url;
        this.id = opts.id;
        this.followers = opts.followers;
        this.following = opts.following;
    }
}