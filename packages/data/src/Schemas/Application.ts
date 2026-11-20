import { Crypto, SudoMode } from "@disflow-team/utils";
import { type Compressed, compress, decompress } from "compress-json";
import { createSingleton } from "..";

/**
 * `compress-json` rejects `undefined` (and some non-finite numbers).
 * Litegraph serialization can contain `undefined` slots, so normalize the
 * payload before compressing it.
 */
function cleanForCompression(value: unknown): unknown {
	if (value === undefined) return undefined;

	if (typeof value === "function" || typeof value === "symbol") {
		return undefined;
	}

	if (value === null || typeof value !== "object") {
		if (typeof value === "number" && !Number.isFinite(value)) return null;
		return value;
	}

	if (Array.isArray(value)) {
		return value.map((item) => {
			const cleaned = cleanForCompression(item);
			return cleaned === undefined ? null : cleaned;
		});
	}

	const result: Record<string, unknown> = {};

	for (const [key, item] of Object.entries(value)) {
		if (item === undefined) continue;

		const cleaned = cleanForCompression(item);
		if (cleaned !== undefined) result[key] = cleaned;
	}

	return result;
}

export type CommandOptionType =
	| "text"
	| "integer"
	| "number"
	| "boolean"
	| "user"
	| "channel"
	| "role"
	| "mentionable"
	| "attachment"
	| "subcommand"
	| "subcommand_group";

export type CommandOptionChannelType =
	| "text"
	| "voice"
	| "category"
	| "announcement"
	| "stage"
	| "forum"
	| "thread"
	| "media";

export interface CommandOptionChoice {
	name: string;
	value: string;
}

export interface CommandOption {
	name: string;
	description: string;
	type: CommandOptionType;
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	minValue?: number;
	maxValue?: number;
	autocomplete?: boolean;
	choices?: CommandOptionChoice[];
	channelTypes?: CommandOptionChannelType[];
	options?: CommandOption[];
}

function normalizeCommandOptions(options: CommandOption[]) {
	for (const option of options) {
		if (
			option.type === "subcommand" ||
			option.type === "subcommand_group"
		) {
			option.options ??= [];
			normalizeCommandOptions(option.options);
		}
	}
}

export interface ApplicationSchema {
	name: string;
	id: string;
	avatar?: string;
	description?: string;
	data: Compressed;
	commands: Map<
		string,
		{
			name: string;
			description: string;
			options: CommandOption[];
			data: Compressed;
		}
	>;
	/**
	 * Names of the Discord events that currently have an enabled handler.
	 */
	events: string[];
	/**
	 * Serialized litegraph data for each event handler, keyed by event name.
	 */
	eventData: Map<string, Compressed>;
	environment: {
		variables: Map<string, string>; // must be an encrypted string
	};
	token: string;
	lastModified: Date;
}

export type ApplicationCreationOptions = Omit<
	ApplicationSchema,
	"commands" | "events" | "eventData" | "environment" | "data" | "lastModified"
>;

const LOCKS = {
	COMMAND_PROCESSING: "COMMAND",
	ENV: "ENV_VAR",
	EVENT_DATA: "EVENT_DATA",
} as const;

export type LOCKS = (typeof LOCKS)[keyof typeof LOCKS];

export type Command = ExtractFromMap<ApplicationSchema["commands"]>;

type ExtractFromMap<T> = T extends Map<unknown, infer R> ? R : never;

export class Application {
	private db = createSingleton();

	constructor(public schema: ApplicationSchema) {
		// Applications created before event support do not have these fields.
		this.schema.events ??= [];
		this.schema.eventData ??= new Map();

		// Commands created before option support do not have this field.
		for (const command of this.schema.commands.values()) {
			command.options ??= [];
			normalizeCommandOptions(command.options);
		}
	}

	static async get(id: string) {
		const db = createSingleton();
		const app = await db.applications.get(id);

		if (!app) return undefined;

		return new Application(app);
	}

	static async create(options: ApplicationCreationOptions) {
		if (!SudoMode.isSudo()) throw new Error("Must be in Sudo mode");

		const encryptedToken = await Application.encryptString(options.token);
		options.token = encryptedToken;

		const realSchema: ApplicationSchema = {
			...options,
			commands: new Map(),
			events: [],
			eventData: new Map(),
			environment: {
				variables: new Map(),
			},
			data: compress({}),
			lastModified: new Date(),
		};

		const database = createSingleton();
		const has = await database.applications.get(realSchema.id);
		if (has)
			return {
				created: false,
				app: new Application(has),
			};

		await database.applications.add(realSchema);

		return {
			created: true,
			app: new Application(realSchema),
		};
	}

	get id() {
		return this.schema.id;
	}

	get name() {
		return this.schema.name;
	}

	async changeToken(token: string) {
		if (!SudoMode.isSudo()) throw new Error("Enter SudoMode first.");
		const encrypted = await Application.encryptString(token);

		this.db.applications.update(this.id, {
			token: encrypted,
		});
	}

	async #grabAppDataOrThrow() {
		const appData = await this.db.applications.get(this.schema.id);

		if (!appData) throw new Error("Data not found. maybe it was deleted?");

		// Normalize rows created before these fields existed.
		appData.events ??= [];
		appData.eventData ??= new Map();

		for (const command of appData.commands.values()) {
			command.options ??= [];
			normalizeCommandOptions(command.options);
		}

		return appData;
	}

	// Command Processing
	async createCommand(data: Pick<Command, "name" | "description">) {
		await window.navigator.locks
			.request(LOCKS.COMMAND_PROCESSING, async () => {
				const appData = await this.#grabAppDataOrThrow();

				appData.commands.set(data.name, {
					name: data.name,
					description: data.description,
					options: [],
					data: compress({}),
				});

				await this.db.applications.update(this.schema.id, {
					commands: appData.commands,
				});
				this.schema.commands = appData.commands;
			})
			.catch((e) => {
				throw e;
			});
	}

	async updateCommandOptions(
		name: string,
		options: CommandOption[],
	) {
		await navigator.locks.request(
			LOCKS.COMMAND_PROCESSING,
			async () => {
				const appData = await this.#grabAppDataOrThrow();
				const command = appData.commands.get(name);

				if (!command) throw new Error("That command does not exist.");

				command.options = options;
				appData.commands.set(name, command);

				await this.db.applications.update(this.id, {
					commands: appData.commands,
				});
				this.schema.commands = appData.commands;
			},
		);
	}

	async updateCommandData(name: string, data: object) {
		const appData = await this.#grabAppDataOrThrow();

		const command = appData.commands.get(name);

		if (!command) throw new Error("That command does not exists.");

		await navigator.locks.request(LOCKS.COMMAND_PROCESSING, async () => {
			try {
				command.data = compress(cleanForCompression(data) as object);
			} catch (cause) {
				throw new Error(
					`Unable to save the command graph: ${
						cause instanceof Error ? cause.message : String(cause)
					}`,
				);
			}
			appData.commands.set(name, command);

			await this.db.applications.update(this.id, {
				commands: appData.commands,
			});
		});
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
					commands: appData.commands,
				});
			}
		});
	}

	async bulkGetCommands() {
		const appData = await this.#grabAppDataOrThrow();

		return appData.commands.values().toArray();
	}

	async getCommandGraph(name: string) {
		const appData = await this.#grabAppDataOrThrow();
		const command = appData.commands.get(name);

		if (!command) return undefined;

		// Support legacy rows that stored a raw serialized graph instead of a
		// compressed value.
		const raw = command.data as unknown;
		if (
			raw &&
			typeof raw === "object" &&
			!Array.isArray(raw) &&
			"nodes" in raw
		) {
			return raw as object;
		}

		try {
			return decompress(command.data);
		} catch (cause) {
			console.warn(
				`[DISFLOW DATA]: Could not decompress the graph for /${name}.`,
				cause,
			);
			return undefined;
		}
	}

	// Event handlers
	get enabledEvents() {
		return this.schema.events;
	}

	async setEventEnabled(name: string, enabled: boolean) {
		const appData = await this.#grabAppDataOrThrow();
		const events = new Set(appData.events ?? []);

		if (enabled) events.add(name);
		else events.delete(name);

		const nextEvents = [...events];

		await this.db.applications.update(this.id, { events: nextEvents });
		this.schema.events = nextEvents;
	}

	async getEventGraph(name: string) {
		const appData = await this.#grabAppDataOrThrow();
		const data = appData.eventData?.get(name);

		if (!data) return undefined;

		const raw = data as unknown;
		if (
			raw &&
			typeof raw === "object" &&
			!Array.isArray(raw) &&
			"nodes" in raw
		) {
			return raw as object;
		}

		try {
			return decompress(data);
		} catch (cause) {
			console.warn(
				`[DISFLOW DATA]: Could not decompress the graph for ${name}.`,
				cause,
			);
			return undefined;
		}
	}

	async updateEventGraph(name: string, data: object) {
		await navigator.locks.request(LOCKS.EVENT_DATA, async () => {
			const appData = await this.#grabAppDataOrThrow();
			const eventData = appData.eventData ?? new Map();

			try {
				eventData.set(name, compress(cleanForCompression(data) as object));
			} catch (cause) {
				throw new Error(
					`Unable to save the event graph: ${
						cause instanceof Error ? cause.message : String(cause)
					}`,
				);
			}

			await this.db.applications.update(this.id, {
				eventData,
			});
			this.schema.eventData = eventData;
		});
	}

	// environment variables
	static async encryptString(value: string) {
		if (!SudoMode.isSudo())
			throw new Error("Not in sudo mode. Please enter it first.");

		const salt = crypto.getRandomValues(new Uint8Array(16));
		const encData = await Crypto.encryptData(
			value,
			await Crypto.keyFromArrayBuffer(SudoMode.masterKey),
		);

		return Crypto.pack(new Uint8Array(encData.enc), salt, encData.iv);
	}

	static async decryptString(encrypted: string) {
		if (!SudoMode.isSudo())
			throw new Error("Not in sudo mode. Please enter it first.");

		const unpacked = Crypto.unpack(encrypted);
		const data = await Crypto.decryptData(
			unpacked.cipher.buffer,
			unpacked.iv,
			await Crypto.keyFromArrayBuffer(SudoMode.masterKey),
		);

		const decoder = new TextDecoder();

		return decoder.decode(data);
	}

	async createVariable(name: string, value: string) {
		const encryptedString = await Application.encryptString(value);

		await navigator.locks.request(LOCKS.ENV, async () => {
			const appData = await this.#grabAppDataOrThrow();

			appData.environment.variables.set(name, encryptedString);

			await this.db.applications.update(this.id, {
				"environment.variables": appData.environment.variables,
			});
			this.schema.environment.variables = appData.environment.variables;
		});
	}

	async deleteVariable(key: string) {
		await navigator.locks.request(LOCKS.ENV, async () => {
			const appData = await this.#grabAppDataOrThrow();
			const exists = appData.environment.variables.delete(key);

			if (exists) {
				await this.db.applications.update(this.id, {
					"environment.variables": appData.environment.variables,
				});
			}

			this.schema.environment.variables = appData.environment.variables;
		});
	}

	async exportVariables() {
		const appData = await this.#grabAppDataOrThrow();

		const environmentEnteries = appData.environment.variables.entries();
		const final = await Promise.all(
			environmentEnteries.map(async ([k, v]) => {
				return `${k}=${JSON.stringify(await Application.decryptString(v))}`;
			}),
		);

		return final.join("\n").trim();
	}
}
