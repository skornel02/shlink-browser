export interface ShlinkSettings {
    apiSecret: string;
    apiUrl: string;
}

export const isSettingsValid = (settings: ShlinkSettings): boolean => {
    // Check empty
    if (settings.apiSecret.length === 0) {
        return false;
    }
    // Check empty
    if (settings.apiUrl.length === 0) {
        return false;
    }
    // Check valid url
    try {
        const url = new URL(settings.apiUrl);
        console.trace("url", url)
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return false;
        }
    } catch (e) {
        return false;
    }

    return true;
}