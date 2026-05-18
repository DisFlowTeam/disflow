import Dexie, { type EntityTable } from "dexie";
import { ApplicationSchema } from "./Schemas/Application";

type DexieWithApps = Dexie & {
    applications: EntityTable<ApplicationSchema, "id">
}

let db: DisflowDB | undefined = undefined;

class DisflowDB {
    db: DexieWithApps;

    constructor() {
        this.db = new Dexie("disflow-data") as DexieWithApps;
        this.db.version(1).stores({
            applications: "id, name, avatar, commands, environment"
        })
    }

    get applications() {
        return this.db.applications;
    }
}

export function createSingleton() {
    if(!db) db = new DisflowDB();

    return db;
}