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
    data: Compressed;
    commands: Map<string, {
        name: string;
        description: string;
        data: Compressed;
    }>,
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
export type ApplicationCreationOptions = Omit<ApplicationSchema, "commands" | "environment" | "data" | "lastModified">;

class ApplicationManager {
    create(option: ApplicationCreationOptions): Promise<Application>;
    get(id: string): Promise<Application>;
    getAll(): Promise<Application[]>;
    delete(id: string): Promise<boolean>; // returns true if the key existed
}
```

# Developing DisFlow data - Rulesets

- ALWAYS ENCRYPT sensitive information. Items like environment variables and tokens
- ALWAYS COMPRESS litegraph serialized data
- NEVER STORE data that could be relating to the user. DisFlow is a local first application. We DO NOT need any user data