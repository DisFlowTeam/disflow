import { defineConfig as defineTsUpConfig, Options } from "tsup"

export function defineConfig(opts?: Options) {
    if(!opts) opts = {
        format: ["cjs", "esm"],
        dts: true,
        entry: ['./src/index.ts']
    }

    return defineTsUpConfig(opts)
}