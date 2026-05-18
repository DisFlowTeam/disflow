import { createSingleton } from "..";
import { compress, type Compressed, decompress } from "compress-json";
import { Crypto, SudoMode } from "@disflow-team/utils";

export interface ApplicationSchema {
    name: string;
    id: string;
    avatar?: string;
    data: Compressed;
    commands: Map<string, {
        name: string;
        description: string;
        data: Compressed;
    }>,
    environment: {
        variables: Map<string, string> // must be an encrypted string
    },
    token: string;
}

export type ApplicationCreationOptions = Omit<ApplicationSchema, "commands" | "environment" | "data">;

const LOCKS = {
    COMMAND_PROCESSING: "COMMAND",
    ENV: "ENV_VAR"
} as const;

type LOCKS = (typeof LOCKS)[keyof typeof LOCKS];

export type Command = ExtractFromMap<ApplicationSchema['commands']>;

type ExtractFromMap<T> = T extends Map<unknown, infer R> ? R : never;

export class Application {
    private db = createSingleton();

    constructor(public schema: ApplicationSchema) { };

    static async get(id: string) {
        const db = createSingleton();
        const app = await db.applications.get(id);

        if(!app) return undefined;

        return new Application(app);
    }

    static async create(options: ApplicationCreationOptions) {
        const realSchema: ApplicationSchema = {
            ...options,
            commands: new Map(),
            environment: {
                variables: new Map()
            },
            data: compress({})
        }

        const database = createSingleton();
        const has = await database.applications.get(realSchema.id);
        if(has) return {
            created: false,
            app: new Application(has)
        }

        await database.applications.add(realSchema);

        return {
            created: true,
            app: new Application(realSchema)
        }
    }

    get id() {
        return this.schema.id;
    }

    get name() {
        return this.schema.name;
    }

    async changeToken(token: string) {
        if(!SudoMode.isSudo()) throw new Error("Enter SudoMode first.")
        const encrypted = await this.encryptString(token);

        this.db.applications.update(this.id, {
            token: encrypted
        })
    }

    async #grabAppDataOrThrow() {
        const appData = await this.db.applications.get(this.schema.id)

        if (!appData) throw new Error("Data not found. maybe it was deleted?");
        return appData;
    }

    // Command Processing
    async createCommand(data: Omit<Command, "data">) {
        await window.navigator.locks.request(LOCKS.COMMAND_PROCESSING, async () => {
            const appData = await this.#grabAppDataOrThrow();

            appData.commands.set(data.name, {
                name: data.name,
                description: data.description,
                data: compress({})
            })

            await this.db.applications.update(this.schema.id, {
                commands: appData.commands
            })
        }).catch(e => {
            throw e;
        });
    }

    async updateCommandData(name: string, data: object) {
        const appData = await this.#grabAppDataOrThrow();

        const command = appData.commands.get(name);

        if (!command) throw new Error("That command does not exists.");

        await navigator.locks.request(LOCKS.COMMAND_PROCESSING, async () => {
            command.data = compress(data);
            appData.commands.set(name, command);

            await this.db.applications.update(this.id, {
                commands: appData.commands
            })
        })
    }

    async getCommand(name: string) {
        const appData = await this.#grabAppDataOrThrow();
        const command = appData.commands.get(name);
        if (!command) return undefined;

        command.data = decompress(command.data);
    }

    async deleteCommand(name: string) {
        const appData = await this.#grabAppDataOrThrow();

        await navigator.locks.request(LOCKS.COMMAND_PROCESSING, async () => {
            const exists = appData.commands.delete(name);

            if (exists) {
                await this.db.applications.update(this.id, {
                    commands: appData.commands
                })
            }
        })
    }

    async bulkGetCommands() {
        const appData = await this.#grabAppDataOrThrow();

        return appData.commands.values().toArray();
    }

    // environment variables
    async encryptString(value: string) {
        if(!SudoMode.isSudo()) throw new Error("Not in sudo mode. Please enter it first.")

        const salt = crypto.getRandomValues(new Uint8Array(16));
        const encData = await Crypto.encryptData(value, await Crypto.keyFromArrayBuffer(SudoMode.masterKey));

        return Crypto.pack(new Uint8Array(encData.enc), salt, encData.iv);
    }

    async decryptString(encrypted: string) {
        if(!SudoMode.isSudo()) throw new Error("Not in sudo mode. Please enter it first.")
        
        const unpacked = Crypto.unpack(encrypted);
        const data = await Crypto.decryptData(unpacked.cipher.buffer, unpacked.iv, await Crypto.keyFromArrayBuffer(SudoMode.masterKey));

        const decoder = new TextDecoder();

        return decoder.decode(data);
    }

    async createVariable(name: string, value: string) {
        const encryptedString = await this.encryptString(value);
        const appData = await this.#grabAppDataOrThrow();

        navigator.locks.request(LOCKS.ENV, async () => {
            appData.environment.variables.set(name, encryptedString);

            await this.db.applications.update(this.id, {
                "environment.variables": appData.environment.variables
            })
        })
    }

    async deleteVariable(key: string) {
        const appData = await this.#grabAppDataOrThrow();

        navigator.locks.request(LOCKS.ENV, async () => {
            const exists = appData.environment.variables.delete(key);

            if (exists) {
                await this.db.applications.update(this.id, {
                    "environment.variables": appData.environment.variables
                })
            }
        })
    }

    async exportVariables() {
        const appData = await this.#grabAppDataOrThrow();

        const environmentEnteries = appData.environment.variables.entries();
        const final = await Promise.all(environmentEnteries.map(async ([k, v]) => {
            return `${k}=${JSON.stringify(await this.decryptString(v))}`
        }));

        return final.join("\n").trim();
    }
}