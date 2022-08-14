<script lang="ts">
	import {
		Column,
		DataTable,
		DataTableSkeleton,
		Pagination,
		Row,
	} from "carbon-components-svelte";
	import { PieChart, WordCloudChart } from "@carbon/charts-svelte";
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
	const countryStatistics: { [key: string]: {amount: number, cities: {[key: string]: number}} } = {};
	const pieChartData: { group: string; value: number }[] = [];
	const wordCloudData: { group: string; word: string; value: number }[] = [];

	const updateStatistics = () => {
		statisticsData = backend
			.getVisitsForShort(shortCode, { page: pageNumber })
			.then((data) => {
				pageNumber = data.visits.pagination.currentPage;
				totalPageNumbers = data.visits.pagination.pagesCount;
				itemsPerPage = data.visits.pagination.itemsPerPage;
				totalItems = data.visits.pagination.totalItems;
				return data.visits.data.map((item, i) => {
					const country = item.visitLocation.countryName;
					const city = item.visitLocation.cityName;
					if (!(country in countryStatistics)) {
						countryStatistics[country] = {
							amount: 0,
							cities: {},
						};
					} 
					if (!(city in countryStatistics[country].cities)) {
						countryStatistics[country].cities[city] = 0;
					}
					countryStatistics[country].amount++;
					countryStatistics[country].cities[city]++;

					const diff: ShlinkStatisticsData = {
						id: `${item.date}-${item.visitLocation.countryName}-${i}`,
						country: country,
						date: item.date,
						referer: item.referer,
					};
					return diff;
				});
			})
			.then((data) => {
				delete countryStatistics[""];
				Object.keys(countryStatistics).forEach((country) => {
					pieChartData.push({
						group: country,
						value: countryStatistics[country].amount,
					});
				delete countryStatistics[country].cities[""];
					Object.keys(countryStatistics[country].cities).forEach((city) => {
						wordCloudData.push({
							group: country,
							word: city,
							value: countryStatistics[country].cities[city],
						});
					} );
				});
				return data;
			});
	};

	updateStatistics();
</script>

<Row>
	<h1>Item statistics</h1>
</Row>
<Row>
	{#await statisticsData}
		<Column>
			<PieChart
				title="Country distribution"
				options={{ data: { loading: true } }}
			/>
		</Column>
		<Column>
			<WordCloudChart
				title="Cities"
				options={{ data: { loading: true } }}
			/>
		</Column>
	{:then rows}
		<Column>
			<PieChart
				title="Country distribution"
				data={pieChartData}
				options={{ resizable: false }}
			/>
		</Column>
		<Column>
			<WordCloudChart
				title="Cities"
				data={wordCloudData}
				options={{ resizable: false }}
			/>
		</Column>
	{/await}
</Row>
<Row>
	{#await statisticsData}
		<DataTableSkeleton title="Items" {headers} width="100vw" />
	{:then rows}
		<DataTable title="Items" {headers} {rows}  width="100vw" />
	{/await}
</Row>
<Row>
	<Pagination {totalItems} pageSize={itemsPerPage} pageSizeInputDisabled />
</Row>

<style>
	:global(.cds--overflow-menu) :global(button[aria-label="Show as table"]) {
		display: none;
	}
</style>
