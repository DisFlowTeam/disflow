import Dexie, { type EntityTable } from "dexie";
import {
	Application,
	type ApplicationCreationOptions,
	type ApplicationSchema,
} from "./Schemas/Application";

type DexieWithApps = Dexie & {
	applications: EntityTable<ApplicationSchema, "id">;
};

let db: DisflowDB | undefined;

class ApplicationManager {
	async create(option: ApplicationCreationOptions) {
		return Application.create(option);
	}

	async get(id: string) {
		return Application.get(id);
	}

	async getAll() {
		const db = createSingleton();
		return (await db.applications.toArray()).map((v) => new Application(v));
	}

	async delete(id: string) {
		const db = createSingleton();
		if (await db.applications.get(id)) {
			await db.applications.delete(id);
			return true;
		}
		return false;
	}
}

class DisflowDB {
	db: DexieWithApps;
	appManager = new ApplicationManager();

	constructor() {
		this.db = new Dexie("disflow-data") as DexieWithApps;
		this.db.version(1).stores({
			applications:
				"id, name, avatar, commands, environment, token, lastModified",
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

export * from "./Schemas/Application";
