export const getActiveTab = (tabHandler: (tab: chrome.tabs.Tab) => void) => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0];
		tabHandler(tab);
	});
};
