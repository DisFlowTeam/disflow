import { defineConfig, type UserConfig } from "tsdown";

const DEFAULT_OPTIONS: UserConfig = {
	entry: ["./src/index.ts"],
	dts: true,
	format: ["cjs", "esm"],
	outDir: "./dist",
	deps: {
		skipNodeModulesBundle: true,
	},
};

export default defineConfig(DEFAULT_OPTIONS);
