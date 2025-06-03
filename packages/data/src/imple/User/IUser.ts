import { IPreviewProject } from "../Project/IProject";

export interface JsonUser {
    name: string;
    avatar: string;
    uid: string;
    projects: string[];
    previewProjects: IPreviewProject[];
}

export abstract class IUser {
    name: string;
    avatar: string;
    uid: string;
    projects: string[];
    previewProjects: IPreviewProject[];

    constructor(user: JsonUser) {
        this.name = user.name;
        this.avatar = user.avatar;
        this.uid = user.uid;
        this.projects = user.projects;
        this.previewProjects = user.previewProjects;
    }
}
