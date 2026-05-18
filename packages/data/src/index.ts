import Dexie, { type EntityTable } from "dexie";
import { Application, ApplicationCreationOptions, ApplicationSchema } from "./Schemas/Application";

type DexieWithApps = Dexie & {
    applications: EntityTable<ApplicationSchema, "id">
}

let db: DisflowDB | undefined = undefined;

class ApplicationManager {
    async create(option: ApplicationCreationOptions) {
        return Application.create(option);
    }

    async get(id: string) {
        return Application.get(id);
    }
}

class DisflowDB {
    db: DexieWithApps;
    appManager = new ApplicationManager();

    constructor() {
        this.db = new Dexie("disflow-data") as DexieWithApps;
        this.db.version(1).stores({
            applications: "id, name, avatar, commands, environment, token"
        });
    }

    get applications() {
        return this.db.applications;
    }
}

export function createSingleton() {
    if (!db) db = new DisflowDB();

    return db;
}