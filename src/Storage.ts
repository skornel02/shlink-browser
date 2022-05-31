import { storage } from "@extend-chrome/storage";
import type { ShlinkSettings } from "./SettingsHelper";

const defaultSettings: ShlinkSettings = {
	apiSecret: "",
	apiUrl: "",
};

export const loadSettings = async (): Promise<ShlinkSettings | undefined> => {
	console.log("Loading settings...");
	const { settings } = await storage.sync.get("settings");
	if (settings === undefined) {
		console.warn("No settings found! Creating a new one...");
		return { ...defaultSettings };
	}
	return settings;
};

export const saveSettings = async (settings: ShlinkSettings): Promise<void> => {
	await storage.sync.set({ settings });
};
