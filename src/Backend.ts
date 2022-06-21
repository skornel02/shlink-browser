import type { ShlinkSettings } from "./SettingsHelper";
import {
	convertShlinkItemParamsToQuery,
	ShlinkItem,
	ShlinkItemCreationOptions,
	ShlinkItemParams,
	ShlinkPaginationParams,
	ShlinkTagsResponse,
	ShlinkVisitData,
} from "./ShlinkData";

interface CheckResponse {
	valid: boolean;
	body?: string;
}

export class ShlinkV2Backend {
	#settings: ShlinkSettings;
	#headers: HeadersInit;
	#baseUrl: string;

	constructor(settings: ShlinkSettings) {
		this.#settings = settings;
		this.#headers = {
			"Content-Type": "application/json",
			"X-Api-Key": settings.apiSecret,
		};
		this.#baseUrl = settings.apiUrl + "/rest/v2";
	}

	async checkToken(): Promise<CheckResponse> {
		try {
			const reponse = await fetch(`${this.#baseUrl}/visits`, {
				method: "GET",
				headers: this.#headers,
			});
			return {
				valid: reponse.status === 200,
				body: await reponse.text(),
			};
		} catch (err) {
			return {
				valid: false,
				body: err.message,
			};
		}
	}

	async createShort(options: ShlinkItemCreationOptions): Promise<ShlinkItem> {
		const response = await fetch(`${this.#baseUrl}/short-urls`, {
			method: "POST",
			headers: this.#headers,
			body: JSON.stringify(options),
		});
		const json = await response.json();
		return json;
	}

	async deleteShort(shortCode: string, domain?: string): Promise<void> {
		await fetch(
			`${this.#baseUrl}/short-urls/${shortCode}` +
				(domain !== undefined ? `?domain=${domain}` : ""),
			{
				method: "DELETE",
				headers: this.#headers,
			}
		);
	}

	async getShorts(
		params: ShlinkItemParams = {}
	): Promise<ShlinkTagsResponse> {
		const response = await fetch(
			`${this.#baseUrl}/short-urls?${convertShlinkItemParamsToQuery(
				params
			).toString()}`,
			{
				method: "GET",
				headers: this.#headers,
			}
		);
		const data = await response.json();
		return data;
	}

	async getVisitsForShort(shortCode: string, pagination: ShlinkPaginationParams): Promise<ShlinkVisitData> {
		const response = await fetch(
			`${this.#baseUrl}/short-urls/${shortCode}/visits?${convertShlinkItemParamsToQuery(
				pagination
			).toString()}`,
			{
				method: "GET",
				headers: this.#headers,
			}
		);
		const data = await response.json();
		return data;
	}
}
