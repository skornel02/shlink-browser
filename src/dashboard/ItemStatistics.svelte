<script lang="ts">
	import {
		DataTable,
		DataTableSkeleton,
		Pagination,
		Row,
	} from "carbon-components-svelte";
	import { ShlinkV2Backend } from "../Backend";
	import type { ShlinkSettings } from "../SettingsHelper";

	export let settings: ShlinkSettings;
	export let shortCode: string;
	const backend = new ShlinkV2Backend(settings);

	interface ShlinkStatisticsData {
        id: string;
		date: string;
		country: string;
		referer: string;
	}

	let pageNumber = 1;
	let totalPageNumbers = 1;
	let itemsPerPage = 10;
	let totalItems = 0;

	let statisticsData: Promise<ShlinkStatisticsData[]>;
	const headers = [
		{ key: "date", value: "Date" },
		{ key: "country", value: "Country" },
		{ key: "referer", value: "Referer" },
	];

	$: {
		statisticsData = backend
			.getVisitsForShort(shortCode, { page: pageNumber })
			.then((data) => {
                pageNumber = data.visits.pagination.currentPage;
                totalPageNumbers = data.visits.pagination.pagesCount;
                itemsPerPage = data.visits.pagination.itemsPerPage;
                totalItems = data.visits.pagination.totalItems;
				return data.visits.data.map((item) => {
					const diff: ShlinkStatisticsData = {
                        id: `${item.date}-${item.visitLocation.countryName}`,
						country: item.visitLocation.countryName,
						date: item.date,
						referer: item.referer,
					};
					return diff;
				});
			});
	}
</script>

<Row>
	<h1>Item statistics</h1>
</Row>
<Row>
	{#await statisticsData}
		<DataTableSkeleton {headers} />
	{:then rows}
		<DataTable {headers} {rows} />
	{/await}
</Row>
<Row>
	<Pagination {totalItems} pageSize={itemsPerPage} pageSizeInputDisabled />
</Row>
