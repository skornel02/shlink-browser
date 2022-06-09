import type { ManifestV3 } from "rollup-plugin-chrome-extension";

const manifest: ManifestV3 = {
	manifest_version: 3,
	name: "Shlink browser",
	version: process.env.npm_package_version,
	permissions: ["activeTab", "storage", "contextMenus", "scripting"],
	optional_permissions: ["clipboardWrite"],
	action: {
		default_popup: "popup/index.html",
	},
	options_ui: {
		page: "settings/index.html",
		open_in_tab: true,
	},
	background: {
		service_worker: "serviceWorker.ts",
		type: "module",
	},
	web_accessible_resources: [
		{
			resources: ["test.html"],
			matches: ["https://skornel02.hu/*"],
		},
	],
	homepage_url: "https://github.com/skornel02/shlink-browser",
	offline_enabled: false,
};

export default manifest;
