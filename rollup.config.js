import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import {
	chromeExtension,
	simpleReloader,
} from "rollup-plugin-chrome-extension";
import zip from "rollup-plugin-zip";
import json from "@rollup/plugin-json";
import { optimizeImports } from "carbon-preprocess-svelte";
import { emptyDir } from "rollup-plugin-empty-dir";

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		input: "src/manifest.json.ts",
		output: {
			dir: "dist",
			format: "esm",
		},
		plugins: [
			chromeExtension(),
			simpleReloader({ unregisterServiceWorkers: true }),
			emptyDir(),
			svelte({
				preprocess: [
					sveltePreprocess({ sourceMap: !production }),
					optimizeImports(),
				],
				compilerOptions: {
					dev: !production,
				},
			}),
			css(),
			json(),
			typescript({ sourceMap: !production }),

			resolve({
				dedupe: ["svelte"],
			}),
			commonjs(),
			typescript({
				sourceMap: !production,
				inlineSources: !production,
			}),

			production && terser(),
			production && zip({ file: "../releases/shlink-browser.zip" }),
		],
		watch: {
			clearScreen: false,
		},
	},
];
