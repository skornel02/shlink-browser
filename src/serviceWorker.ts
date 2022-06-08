import { ShlinkV2Backend } from "./Backend";
import type { ShlinkItem } from "./ShlinkData";
import { loadSettings } from "./Storage";

const copyTextGenerator = (text: string) => {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert("Short link copied to clipboard!");
        });
}

const handleContextMenu = (info: any, tab?: chrome.tabs.Tab) => {
    console.log(info, tab);
    if (tab !== undefined && tab.url !== undefined) {
        const url = tab.url;
        loadSettings()
            .then(settings => {
                const backend = new ShlinkV2Backend(settings);
                backend
                    .createShort({
                        longUrl: url,
                        findIfExists: true,
                    })
                    .then((data: ShlinkItem) => {
                        console.log("SHORT LINK: ", data.shortUrl);
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: copyTextGenerator,
                            args: [data.shortUrl],
                        })
                    });
            })
    }
};

chrome.contextMenus.create({
    title: "Shorten URL",
    id: "SHLINK_BROWSER",
    documentUrlPatterns: ["http://*/*", "https://*/*"],
    contexts: ["page"],
})

chrome.contextMenus.onClicked.addListener(handleContextMenu);

console.log("Context menu created!");

export { };