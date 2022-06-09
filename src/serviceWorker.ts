import { ShlinkV2Backend } from "./Backend";
import { isSettingsValidCached } from "./SettingsHelper";
import type { ShlinkItem } from "./ShlinkData";
import { loadSettings } from "./Storage";

const copyTextGenerator = (text: string) => {
	navigator.clipboard.writeText(text).then(() => {
		alert("Short link copied to clipboard!");
	});
};

const displayError = (error: string) => {
	alert("Error: " + error);
};

const handleContextMenu = (info: any, tab?: chrome.tabs.Tab) => {
	console.log(info, tab);
	if (tab !== undefined && tab.url !== undefined) {
		const url = tab.url;
		loadSettings().then(async (settings) => {
			const valid = await isSettingsValidCached(settings);
			if (valid) {
				const backend = new ShlinkV2Backend(settings);
				const shlinkItem = await backend.createShort({
					longUrl: url,
					findIfExists: true,
				});
				console.log("CONTEXT SHORT LINK: ", shlinkItem.shortUrl);
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					func: copyTextGenerator,
					args: [shlinkItem.shortUrl],
				});
			} else {
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					func: displayError,
					args: ["Your settings are not valid!"],
				});
			}
		});
	}
};

chrome.contextMenus.create({
	title: "Shorten URL",
	id: "SHLINK_BROWSER",
	documentUrlPatterns: ["http://*/*", "https://*/*"],
	contexts: ["page"],
});

chrome.contextMenus.onClicked.addListener(handleContextMenu);

console.log("Context menu created!");

export {};
