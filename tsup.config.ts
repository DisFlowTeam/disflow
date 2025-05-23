import { defineConfig as defineTsUpConfig, Options } from "tsup"

const DEFAULT_OPTIONS: Options = {
    format: ["cjs", "esm"],
    dts: true,
    entry: ['./src/index.ts'],
    outDir: "./dist"
} as const

export function defineConfig(opts: Options) {
    if(!opts) opts = DEFAULT_OPTIONS

    opts = {
        ...DEFAULT_OPTIONS,
        ...opts
    }
    
    return defineTsUpConfig(opts)
}