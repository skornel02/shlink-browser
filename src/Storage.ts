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

export const loadLastValidated = async (): Promise<string | undefined> => {
	const { lastValidated } = await storage.sync.get("lastValidated");
	return typeof lastValidated === "string" ? lastValidated : undefined;
};

export const saveLastValidated = async (
	lastValidated: string
): Promise<void> => {
	await storage.sync.set({ lastValidated });
};

export const clearLastValidated = async (): Promise<void> => {
	console.log("Clearing last validated...");
	await storage.sync.remove("lastValidated");
};
