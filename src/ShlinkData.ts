export interface ShlinkItemCreationOptions {
	longUrl: string;
	validSince?: string;
	validUntil?: string;
	maxVisits?: number;
	validateUrl?: boolean;
	tags?: string[];
	title?: string;
	crawlable?: boolean;
	forwardQuery?: boolean;
	customSlug?: string;
	findIfExists?: boolean;
	domain?: string;
	shortCodeLength?: number;
}

export type OrderByRules = 'longUrl-ASC' | 'longUrl-DESC' | " shortCode-ASC" | 'shortCode-DESC' | 'dateCreated-ASC' | 'dateCreated-DESC' | 'visits-ASC' | 'visits-DESC' | 'title-ASC' | 'title-DESC';

export interface ShlinkItemParams {
	page?: number;
	itemsPerPage?: number;
	searchTerm?: string;
	tags?: string[];
	tagsMode?: 'any' | 'all';
	orderBy?: OrderByRules;
	startDate?: string;
	endDate?: string;
}
export const convertShlinkItemParamsToQuery = (params: ShlinkItemParams): URLSearchParams => {
	const searchParams = new URLSearchParams();
	if (params.page !== undefined) {
		searchParams.append('page', String(params.page));
	}
	if (params.itemsPerPage !== undefined) {
		searchParams.append('itemsPerPage', String(params.itemsPerPage));
	}
	if (params.searchTerm !== undefined) {
		searchParams.append('searchTerm', params.searchTerm);
	}
	if (params.tags !== undefined) {
		params.tags.forEach(tag => searchParams.append('tags', tag));		
	}
	if (params.tagsMode !== undefined) {
		searchParams.append('tagsMode', params.tagsMode);
	}
	if (params.orderBy !== undefined) {
		searchParams.append('orderBy', params.orderBy);
	}
	if (params.startDate !== undefined) {
		searchParams.append('startDate', params.startDate);
	}
	if (params.endDate !== undefined) {
		searchParams.append('endDate', params.endDate);
	}
	return searchParams;
}

export interface ShlinkItem {
	shortCode: string;
	shortUrl: string;
	longUrl: string;
	dateCreated: string;
	visitsCount: number;
	tags: string[];
	meta: {
		validSince?: string;
		validUntil?: string;
		maxVisits?: number;
	}
	domain?: string;
	title?: string;
	crawlable?: boolean;
	forwardQuery?: boolean;
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
