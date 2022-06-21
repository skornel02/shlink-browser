export const openSettings = () => {
    if (chrome !== undefined && chrome.runtime !== undefined) {
        if (chrome.runtime.openOptionsPage !== undefined) {
            chrome.runtime.openOptionsPage();
        } else if (chrome.runtime.getURL !== undefined) {
            window.open(chrome.runtime.getURL("options.html"));
        }
    }
};
export const openDashboard = () => {
    if (chrome !== undefined && chrome.runtime !== undefined) {
        window.open(chrome.runtime.getURL("dashboard/index.html"));
    }
};

export const openStatsForItem = (shortCode: string) => {
    console.log("sajt");
    if (chrome !== undefined && chrome.runtime !== undefined) {
        window.open(chrome.runtime.getURL(`dashboard/index.html?shortCode=${shortCode}`));
    }    
}

export const openSite = () => {
    window.open('https://github.com/skornel02/shlink-browser', '_blank');
}