import { IProject } from "./Project/IProject";
import { IUser } from "./User/IUser";

export abstract class IDataManager {
    abstract dataMode: "local" | "remote";
    abstract signIn(username: string, password: string): Promise<IUser>;
    abstract signOut(): Promise<boolean>;
    abstract getCurrentUser(): Promise<IUser | undefined>;
    abstract getProject(pId: string): Promise<IProject | undefined>;
    abstract getUser(uid: string): Promise<IUser | undefined>;
}