import { getGunUser } from "../MainGun.svelte";
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
        super(getGunUser().get(CommandNode.createNamespace(projectId, commandId)));

        this.projectId = projectId;
        this.commandId = commandId;
    }

    async graph(): Promise<string|undefined> {
        // @ts-expect-error
        return structuredClone(await this.chain.get("graph").get("main").then() as string | undefined);
    }

    static createNamespace(projectId: string, commandId: string) {
        return `${projectId}_${commandId}`;
    }

    static async createCommand(projectId: string, commandId: string) {
        const projectNode = new ProjectNode(projectId);
        
        return await projectNode.createCommand(commandId);
    }

    async saveGraph(graphData: object) {
        // @ts-expect-error
        await this.chain.get("graph").put({
            main: JSON.stringify(graphData)
        });
    }
}

export class ProjectNode extends GunNode {
    static async createProject(param: Project) {
        // @ts-expect-error
        await getGunUser().get("projects").get(param.id as never).put(param)
    }

    static async getProject(projectId: string) {
        return new ProjectNode(projectId);
    }

    static watchProjects(callback: (p: Project) => unknown) {
        // @ts-expect-error
        const ev = getGunUser().get("projects").map().on((v: Project | null) => {
            if(!v) return;
            callback(v);
        })

        return () => ev?.off();
    }

    id: string;

    constructor(projectId: string) {
        const chain = getGunUser().get("projects").get(projectId as never);
        
        super(chain);

        this.id = projectId
        this.chain = chain
    }

    command(id: string) {
        return new CommandNode(this.id, id)
    }

    async createCommand(id: string) {
        (this.chain.get("commands" as never) as any).get(id).put(Date.now());

        return new CommandNode(this.id, id);
    }

    async metadata(): Promise<Project> {
        // @ts-expect-error
        return await this.chain.then();
    }

    async saveGraph(graphData: object) {
        // @ts-expect-error
        await this.chain.get("graph").put({
            // Lazy load the graph data
            main: JSON.stringify(graphData)
        });
    }

    async graph(): Promise<string | void> {
        // @ts-expect-error
        return structuredClone(await this.chain.get("graph").get("main").then() as string | void);
    }

    watchCommands(fn: (cmd: { updatedAt: number, name: string }) => unknown) {
        // @ts-expect-error
        const ev = this.chain.get("commands" as never).map().on((val: number, key: string) => {
            fn({ updatedAt: val, name: key });
        })

        return () => {
            ev?.off();
        }
    }
}