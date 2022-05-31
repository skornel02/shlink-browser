import type { ShlinkSettings } from "./SettingsHelper";
import type { ShlinkItem } from "./ShlinkData";

export class ShlinkBackend {
	#settings: ShlinkSettings;
	#headers: HeadersInit;
	#baseUrl: string;

	constructor(settings) {
		this.#settings = settings;
		this.#headers = {
			"Content-Type": "application/json",
			"X-Api-Key": settings.apiSecret,
		};
		this.#baseUrl = settings.apiUrl + "/rest/v2";
	}

	async checkToken(): Promise<boolean> {
		try {
			const reponse = await fetch(`${this.#baseUrl}/visits`, {
				method: "GET",
				headers: this.#headers,
			});
			return reponse.status === 200;
		} catch (err) {
			return false;
		}
	}

	async createShort(url: string): Promise<ShlinkItem> {
		const reponse = await fetch(`${this.#baseUrl}/short-urls`, {
			method: "POST",
			headers: this.#headers,
			body: JSON.stringify({
				longUrl: url,
				findIfExists: true,
			}),
		});
		const json = await reponse.json();
		return json;
	}
}
