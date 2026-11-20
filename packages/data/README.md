# @disflow-team/local-data

`@disflow-team/local-data` acts as an IndexedDB adapter for data from disflow.

# Usage

The package exposes a function named `createSingleton` which creates an instance of Dexie database wrapper for indexeddb.

```ts
import { createSingleton } from "@disflow-team/local-data";
```

# Applications

Each DisFlow application has the following schema.

```ts
export interface ApplicationSchema {
    name: string;
    id: string;
    avatar?: string;
    description?: string;
    data: Compressed;
    commands: Map<string, {
        name: string;
        description: string;
        options: CommandOption[];
        data: Compressed;
    }>,
    events: string[]; // names of enabled Discord events
    eventData: Map<string, Compressed>; // serialized graph per event handler
    environment: {
        variables: Map<string, string>;
    },
    token: string;
    lastModified: Date;
}
```

> [!danger]
> Do not be alarmed! DisFlow encrypts all the environment variables and the token.

# Modifying applications

Applications can be managed via the `appManager` property of the return type of `createSingleton`. This instance has the following methods.

```ts
export type ApplicationCreationOptions = Omit<ApplicationSchema, "commands" | "events" | "eventData" | "environment" | "data" | "lastModified">;

class ApplicationManager {
    create(option: ApplicationCreationOptions): Promise<Application>;
    get(id: string): Promise<Application>;
    getAll(): Promise<Application[]>;
    delete(id: string): Promise<boolean>; // returns true if the key existed
}
```

# Command options

Each command stores simple option metadata alongside its graph:

```ts
type CommandOptionType =
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

interface CommandOption {
    name: string;
    description: string;
    type: CommandOptionType;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    autocomplete?: boolean;
    choices?: { name: string; value: string }[];
    channelTypes?: string[];
    options?: CommandOption[];
}
```

Update them with `Application.updateCommandOptions(name, options)`.

Discord structure rules are enforced by the UI/validator:

- top-level arguments and subcommands cannot be mixed
- subcommand groups can only contain subcommands
- subcommands can only contain simple arguments
- groups are top-level only
- every level supports at most 25 options

# Developing DisFlow data - Rulesets

- ALWAYS ENCRYPT sensitive information. Items like environment variables and tokens
- ALWAYS COMPRESS litegraph serialized data
- NEVER STORE data that could be relating to the user. DisFlow is a local first application. We DO NOT need any user data