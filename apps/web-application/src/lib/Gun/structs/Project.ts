import { user } from "../MainGun.svelte";
import { GunNode } from "./GunNode";

export interface Project {
    id: string;
    icon: string;
    name: string;
    version: string;
}

// Follow a flatted graph structure
export class CommandNode extends GunNode {
    projectId: string;
    commandId: string;

    constructor(projectId: string, commandId: string) {
        super(user.get(CommandNode.createNamespace(projectId, commandId)));

        this.projectId = projectId;
        this.commandId = commandId;
    }

    static createNamespace(projectId: string, commandId: string) {
        return `${projectId}_${commandId}`;
    }

    static async createCommand(projectId: string, commandId: string) {
        const projectNode = new ProjectNode(projectId);
        
        return await projectNode.createCommand(commandId);
    }
}

export class ProjectNode extends GunNode {
    static async createProject(param: Project) {
        // @ts-expect-error
        await user.get("projects").get(param.id as never).put(param)
    }

    static async getProject(projectId: string) {
        return new ProjectNode(projectId);
    }

    static watchProjects(callback: (p: Project) => unknown) {
        // @ts-expect-error
        const ev = user.get("projects").map().on((v: Project | null) => {
            if(!v) return;
            callback(v);
        })

        return () => ev?.off();
    }

    id: string;

    constructor(projectId: string) {
        const chain = user.get("projects").get(projectId as never);
        
        super(chain);

        this.id = projectId
        this.chain = chain
    }

    command(id: string) {
        return new CommandNode(this.id, id)
    }

    async createCommand(id: string) {
        (this.chain.get("commands" as never) as any).get(id).put(1);

        return new CommandNode(this.id, id);
    }

    metadata() {
        return new Promise<Project>((resolve) => {
            this.chain.once((v) => resolve(v as unknown as Project));
        });
    }
}