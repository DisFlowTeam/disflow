import { IPreviewProject, IProject, JsonPreviewProject, JsonProject } from "../../imple";

export class Project extends IProject {
    fetchCommand(name: string): { name: string; content: string; } | undefined {
        const projects = localStorage.getItem("projects")
        if(!projects) {
            localStorage.setItem("projects", "{}");
            return undefined;
        }

        const objectParsed = JSON.parse(projects) as JsonProject[];
        const proj = objectParsed.find(v => v.pid === this.pid);

        if(!proj) return undefined;

        return proj.commands.find(v => v.name === name);
    }

    toJSON(): JsonProject {
        const proj = localStorage.getItem("projects");
        if(!proj) throw new Error("Localstorage was cleared while tab was alive. Please refresh.")
        const { main, commands } = JSON.parse(proj) as JsonProject;

        return {
            likes: this.likes,
            name: this.name,
            files: this.files,
            pid: this.pid,
            commands,
            main
        }
    }
}

export class PreviewProject extends IPreviewProject {
    async fetchProject(): Promise<IProject | undefined> {
        const item = localStorage.getItem("projects");
        if(!item) return undefined;
        const proj = JSON.parse(item)[this.name];
        if(!proj) return undefined;
        
        return new Project(proj as JsonPreviewProject)
    }
}