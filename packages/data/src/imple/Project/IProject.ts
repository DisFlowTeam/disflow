export interface JsonProject extends JsonPreviewProject {
    main: string;
    commands: { name: string, content: string }[];
}

export interface JsonPreviewProject {
    likes: number;
    name: string;
    files: number;
    pid: string;
}

export abstract class IPreviewProject {
    likes: number;
    name: string;
    files: number;
    pid: string;

    constructor(json: JsonPreviewProject) {
        this.likes = json.likes;
        this.name = json.name;
        this.files = json.files;
        this.pid = json.pid;
    }

    abstract fetchProject(): Promise<IProject | undefined>;

    toJSON(): JsonPreviewProject {
        return {
            likes: this.likes,
            name: this.name,
            files: this.files,
            pid: this.pid
        }
    }
}

export abstract class IProject extends IPreviewProject {
    abstract fetchCommand(name: string): { name: string, content: string } | undefined;

    async fetchProject(): Promise<IProject | undefined> {
        return this;
    }

    abstract toJSON(): JsonProject;
}