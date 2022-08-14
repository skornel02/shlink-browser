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
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default [
	{
		context: 'window',
		input: "src/manifest.json.ts",
		output: {
			dir: "dist",
			format: "esm",
		},
		plugins: [
			chromeExtension(),
			simpleReloader({ unregisterServiceWorkers: true }),
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
			production && emptyDir(),
			replace({
				preventAssignment: true,
				'process.env.NODE_ENV': JSON.stringify('production'),
			}),
		],
		watch: {
			clearScreen: false,
		},
		onwarn: (warning, warn) => {
			// omit circular dependency warnings emitted from
			// "d3-*" packages and "@carbon/charts"
			if (
				warning.code === 'CIRCULAR_DEPENDENCY' &&
				/^node_modules\/(d3-|@carbon\/charts)/.test(warning.importer)
			) {
				return;
			}

			// preserve all other warnings
			warn(warning);
		}
	}
];
