import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
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

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require("child_process").spawn(
				"npm",
				["run", "start", "--", "--dev"],
				{
					stdio: ["ignore", "inherit", "inherit"],
					shell: true,
				}
			);

			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		},
	};
}

export default [
	{
		input: "src/manifest.json",
		output: {
			dir: "dist",
			format: "esm",
		},
		plugins: [
			chromeExtension(),
			simpleReloader(),
			svelte({
				preprocess: sveltePreprocess({ sourceMap: !production }),
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

			!production && serve(),

			!production && livereload("public"),

			production && terser(),
			production && zip({ dir: "releases" }),
		],
		watch: {
			clearScreen: false,
		},
	},
];
