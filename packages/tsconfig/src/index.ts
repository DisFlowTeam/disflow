import type { UserConfig } from "tsdown";

export const DEFAULT_OPTIONS: UserConfig = {
	entry: ["./src/index.ts"],
	dts: true,
	format: ["cjs", "esm"],
	outDir: "./dist",
	deps: {
		skipNodeModulesBundle: true,
	},
};
