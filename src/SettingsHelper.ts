import { ShlinkV2Backend } from "./Backend";
import { loadLastValidated, saveLastValidated } from "./Storage";

export interface ShlinkSettings {
	apiSecret: string;
	apiUrl: string;
}

export const isSettingsValid = async (
	settings: ShlinkSettings
): Promise<boolean> => {
	// Check empty
	if (settings.apiSecret.length === 0) {
		return false;
	}
	// Check empty
	if (settings.apiUrl.length === 0) {
		return false;
	}
	try {
		// Check valid url
		const url = new URL(settings.apiUrl);
		console.trace("url", url);
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			return false;
		}

		// Check connection
		const backend = new ShlinkV2Backend(settings);
		const result = await backend.checkToken();

		return result.valid;
	} catch (e) {
		return false;
	}
};

export const isSettingsValidCached = async (
	settings: ShlinkSettings
): Promise<boolean> => {
	const lastValidated = await loadLastValidated();

	if (lastValidated !== undefined) {
		const lastDate = new Date(lastValidated);
		const acceptable = new Date(Date.now() - 1000 * 60 * 60);
		console.log(lastDate, acceptable, lastDate > acceptable);
		if (lastDate > acceptable) {
			return true;
		}
	} else {
		console.log("No last validation found");
	}
	const valid = await isSettingsValid(settings);
	if (valid) {
		await saveLastValidated(new Date().toISOString());
	}
	console.log("Settings validated! ", valid, settings);
	return valid;
};
