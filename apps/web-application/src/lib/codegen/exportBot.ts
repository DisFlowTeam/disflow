import {
	type BaseNode,
	JavaScriptGenerator,
	OnProgramStartNode,
} from "@disflow-team/code-gen";
import type { Application, CommandOption } from "@disflow-team/local-data";
import { LGraph, LiteGraph } from "litegraph.js";
import * as Nodes from "$lib/Components/Editor/Nodes";
import { OnCommand } from "$lib/Components/Editor/Nodes/Events";
import {
	SUPPORTED_EVENTS,
	type SupportedEvent,
} from "$lib/Constants/SupportedEvents";

const IMPORT_START =
	"// ------------ START DISFLOW IMPORT STATEMENTS ------------";
const IMPORT_END = "// ------------ END DISFLOW IMPORT STATEMENTS ------------";

export interface GeneratedBotProject {
	files: Record<string, string>;
	eventCount: number;
	commandCount: number;
}

const ALL_NODES = [OnProgramStartNode, ...Object.values(Nodes)];

function registerLiteGraphNodes() {
	LiteGraph.clearRegisteredTypes();
	LiteGraph.registerNodeType("Events/Start", OnProgramStartNode);

	for (const Node of Object.values(Nodes)) {
		LiteGraph.registerNodeType(Node.buildReferenceName(), Node);
	}
}

function createEngine() {
	const engine = new JavaScriptGenerator();

	for (const Node of ALL_NODES) {
		Node.forEngine(engine);
	}

	return engine;
}

function extractImports(code: string) {
	const start = code.indexOf(IMPORT_START);
	const end = code.indexOf(IMPORT_END);

	if (start === -1 || end === -1 || end < start) return "";

	return code.slice(start + IMPORT_START.length, end).trim();
}

function graphHasNodes(data: unknown) {
	const nodes = (data as { nodes?: unknown[] } | undefined)?.nodes;
	return Array.isArray(nodes) && nodes.length > 0;
}

function commandFileName(name: string) {
	return name.replace(/[^a-z0-9_-]/gi, "-") || "command";
}

function commandVariableName(name: string, index: number) {
	return `cmd_${index}_${name.replace(/[^a-z0-9]/gi, "_")}`;
}

function lowerFirst(value: string) {
	return value.charAt(0).toLowerCase() + value.slice(1);
}

function eventFileName(event: SupportedEvent) {
	return lowerFirst(event.root.eventName);
}

function buildEventFile(event: SupportedEvent, body: string, imports: string) {
	const parameters = event.root.payload
		? `disflowClient, ${event.root.payload}`
		: "disflowClient";
	const importBlock = imports ? `${imports}\n` : "";

	return `import * as DisFlowDJS from "discord.js";\n${importBlock}\nexport const name = DisFlowDJS.Events.${event.root.eventName};\n\nexport async function execute(${parameters}) {\n${body.trimEnd()}\n}\n\nexport default { name, execute };\n`;
}

const OPTION_TYPE_NAMES: Record<CommandOption["type"], string> = {
	text: "String",
	integer: "Integer",
	number: "Number",
	boolean: "Boolean",
	user: "User",
	channel: "Channel",
	role: "Role",
	mentionable: "Mentionable",
	attachment: "Attachment",
	subcommand: "Subcommand",
	subcommand_group: "SubcommandGroup",
};

const CHANNEL_TYPE_NAMES: Record<
	NonNullable<CommandOption["channelTypes"]>[number],
	string[]
> = {
	text: ["GuildText"],
	voice: ["GuildVoice"],
	category: ["GuildCategory"],
	announcement: ["GuildAnnouncement"],
	stage: ["GuildStageVoice"],
	forum: ["GuildForum"],
	thread: ["PublicThread", "PrivateThread"],
	media: ["GuildMedia"],
};

function optionToCode(option: CommandOption, depth: number) {
	const pad = "\t".repeat(depth);
	const inner = "\t".repeat(depth + 1);
	const isContainer =
		option.type === "subcommand" || option.type === "subcommand_group";
	const fields = [
		`type: DisFlowDJS.ApplicationCommandOptionType.${OPTION_TYPE_NAMES[option.type]}`,
		`name: ${JSON.stringify(option.name)}`,
		`description: ${JSON.stringify(option.description)}`,
	];

	if (isContainer) {
		if (option.options?.length) {
			const nested = option.options
				.map(
					(child) =>
						`${"\t".repeat(depth + 2)}${optionToCode(child, depth + 2)}`,
				)
				.join(",\n");

			fields.push(`options: [\n${nested}\n${inner}]`);
		}
	} else {
		if (option.required) fields.push("required: true");
		if (option.autocomplete) fields.push("autocomplete: true");
		if (option.minLength !== undefined)
			fields.push(`min_length: ${option.minLength}`);
		if (option.maxLength !== undefined)
			fields.push(`max_length: ${option.maxLength}`);
		if (option.minValue !== undefined)
			fields.push(`min_value: ${option.minValue}`);
		if (option.maxValue !== undefined)
			fields.push(`max_value: ${option.maxValue}`);

		if (option.choices?.length) {
			const choices = option.choices.map((choice) => {
				const value =
					option.type === "text"
						? JSON.stringify(choice.value)
						: Number(choice.value);

				return `{ name: ${JSON.stringify(choice.name)}, value: ${value} }`;
			});

			fields.push(`choices: [${choices.join(", ")}]`);
		}

		if (option.channelTypes?.length) {
			const types = option.channelTypes.flatMap((type) =>
				CHANNEL_TYPE_NAMES[type].map(
					(name) => `DisFlowDJS.ChannelType.${name}`,
				),
			);

			fields.push(`channel_types: [${types.join(", ")}]`);
		}
	}

	return `{\n${fields.map((field) => `${inner}${field}`).join(",\n")}\n${pad}}`;
}

function buildCommandFile(
	command: {
		name: string;
		description: string;
		options?: CommandOption[];
	},
	body: string,
	imports: string,
) {
	const importBlock = imports ? `${imports}\n` : "";
	const optionsCode = command.options?.length
		? `\n\toptions: [\n${command.options
				.map((option) => `\t\t${optionToCode(option, 2)}`)
				.join(",\n")}\n\t],`
		: "";

	return `import * as DisFlowDJS from "discord.js";\n${importBlock}\nexport const data = {\n\tname: ${JSON.stringify(command.name)},\n\tdescription: ${JSON.stringify(command.description)},${optionsCode}\n};\n\nexport async function execute(disflowClient, disflowCtx) {\n${body.trimEnd()}\n}\n\nexport default { data, execute };\n`;
}

function buildIndexFile(
	imports: string[],
	registrations: string[],
	intents: string[],
	commandImports: string[],
	commandVariables: string[],
) {
	const lines = [
		'import * as DisFlowDJS from "discord.js";',
		...imports,
		...commandImports,
		"",
		'if (typeof process.loadEnvFile === "function") {',
		"\tprocess.loadEnvFile();",
		"}",
		"",
		"const token = process.env.DISCORD_TOKEN;",
		'if (!token) throw new Error("DISCORD_TOKEN is not set. Copy .env.example to .env and add your bot token.");',
		"",
		"const disflowClient = new DisFlowDJS.Client({",
		"\tintents: [",
		...intents.map((intent) => `\t\t${intent},`),
		"\t],",
		"});",
		"",
	];

	if (commandVariables.length > 0) {
		lines.push(
			`const disflowCommands = [${commandVariables.join(", ")}];`,
			"",
			"disflowClient.once(DisFlowDJS.Events.ClientReady, async () => {",
			"\tawait disflowClient.application.commands.set(disflowCommands.map((command) => command.data));",
			"});",
			"",
			"disflowClient.on(DisFlowDJS.Events.InteractionCreate, async (disflowCtx) => {",
			"\tif (!disflowCtx.isChatInputCommand()) return;",
			"",
			"\tconst command = disflowCommands.find((entry) => entry.data.name === disflowCtx.commandName);",
			"\tif (!command) return;",
			"",
			"\tawait command.execute(disflowClient, disflowCtx).catch(console.error);",
			"});",
			"",
		);
	}

	lines.push(...registrations, "", "await disflowClient.login(token);", "");

	return lines.join("\n");
}

function buildPackageJson(dependencies: Record<string, string>) {
	return `${JSON.stringify(
		{
			name: "disflow-discord-bot",
			version: "1.0.0",
			private: true,
			type: "module",
			main: "index.js",
			scripts: {
				start: "node index.js",
			},
			dependencies,
		},
		null,
		"\t",
	)}\n`;
}

const README = `# DisFlow Discord Bot

Generated with DisFlow.

## Setup

1. Install dependencies:

   \`\`\`bash
   npm install
   \`\`\`

2. Copy \`.env.example\` to \`.env\` and add your Discord bot token. On older Node
   versions, export \`DISCORD_TOKEN\` in your shell instead.

3. Start the bot:

   \`\`\`bash
   npm start
   \`\`\`

Event handlers in \`events/\` and slash commands in \`commands/\` are registered
automatically by \`index.js\`.
`;

export async function generateBotProject(
	app: Application,
): Promise<GeneratedBotProject> {
	registerLiteGraphNodes();

	const files: Record<string, string> = {};
	const enabledEvents = new Set(app.schema.events);
	const intents = new Set<string>();
	const dependencies: Record<string, string> = { "discord.js": "^14" };
	const eventImports: string[] = [];
	const registrations: string[] = [];
	const commandImports: string[] = [];
	const commandVariables: string[] = [];
	let eventCount = 0;
	let commandCount = 0;

	for (const event of SUPPORTED_EVENTS) {
		if (!enabledEvents.has(event.name)) continue;

		const data = await app.getEventGraph(event.name);
		if (!data) continue;

		const graph = new LGraph();
		graph.configure(data as Parameters<LGraph["configure"]>[0], false);

		const graphNodes = (graph as unknown as { _nodes: BaseNode[] })._nodes;
		const rootNode = graphNodes.find((node) => node instanceof event.root);

		if (!rootNode) {
			throw new Error(
				`The saved graph for "${event.name}" does not contain its event root.`,
			);
		}

		const engine = createEngine();
		let result: ReturnType<JavaScriptGenerator["graphToCode"]>;

		try {
			result = engine.graphToCode(graph);
		} catch (cause) {
			throw new Error(
				`Could not generate the "${event.name}" handler: ${
					cause instanceof Error ? cause.message : String(cause)
				}`,
			);
		}

		const body = engine.statementToCode(rootNode, 0);
		const imports = extractImports(result.code);
		const fileName = eventFileName(event);

		files[`events/${fileName}.js`] = buildEventFile(event, body, imports);

		for (const intent of result.intents) {
			const trimmed = intent.trim();
			if (trimmed) intents.add(trimmed);
		}

		const meta = JSON.parse(result.meta) as {
			dependencies?: Record<string, string>;
		};
		Object.assign(dependencies, meta.dependencies ?? {});

		eventImports.push(`import ${fileName} from "./events/${fileName}.js";`);
		registrations.push(
			`disflowClient.on(${fileName}.name, (...args) => ${fileName}.execute(disflowClient, ...args).catch(console.error));`,
		);
		eventCount++;
	}

	const commands = await app.bulkGetCommands();

	for (const command of commands) {
		const data = await app.getCommandGraph(command.name);
		if (!graphHasNodes(data)) continue;

		const graph = new LGraph();
		graph.configure(data as Parameters<LGraph["configure"]>[0], false);

		const graphNodes = (graph as unknown as { _nodes: BaseNode[] })._nodes;
		const rootNode = graphNodes.find((node) => node instanceof OnCommand);

		if (!rootNode) {
			throw new Error(
				`The saved graph for "/${command.name}" does not contain the On Command root.`,
			);
		}

		const engine = createEngine();
		let result: ReturnType<JavaScriptGenerator["graphToCode"]>;

		try {
			result = engine.graphToCode(graph);
		} catch (cause) {
			throw new Error(
				`Could not generate the "/${command.name}" handler: ${
					cause instanceof Error ? cause.message : String(cause)
				}`,
			);
		}

		const body = engine.statementToCode(rootNode, 0);
		const imports = extractImports(result.code);
		const fileName = commandFileName(command.name);
		const variableName = commandVariableName(command.name, commandCount);

		files[`commands/${fileName}.js`] = buildCommandFile(command, body, imports);

		for (const intent of result.intents) {
			const trimmed = intent.trim();
			if (trimmed) intents.add(trimmed);
		}

		const meta = JSON.parse(result.meta) as {
			dependencies?: Record<string, string>;
		};
		Object.assign(dependencies, meta.dependencies ?? {});

		commandImports.push(
			`import ${variableName} from "./commands/${fileName}.js";`,
		);
		commandVariables.push(variableName);
		commandCount++;
	}

	files["index.js"] = buildIndexFile(
		eventImports,
		registrations,
		[...intents].sort(),
		commandImports,
		commandVariables,
	);
	files["package.json"] = buildPackageJson(dependencies);
	files["README.md"] = README;
	files[".env.example"] = "DISCORD_TOKEN=\n";

	return { files, eventCount, commandCount };
}
