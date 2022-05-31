export interface ShlinkItem {
	shortCode: string;
	shortUrl: string;
	longUrl: string;
	dateCreated: string;
	visitsCount: number;
	tags: string[];
	title: string;
}

export interface ShlinkTagsResponse {
	shortUrls: {
		data: ShlinkItem[];
		pagination: unknown;
	};
}

export interface ShlinkVisitStats {
	visits: {
		visitsCount: number;
		orphanVisitsCount: number;
	};
}
