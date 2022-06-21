<script lang="ts">
	import { Button, Column, Row } from "carbon-components-svelte";
	import { ShlinkV2Backend } from "../Backend";
	import ShlinkItemTile from "../components/ShlinkItemTile.svelte";
import { openStatsForItem } from "../NavigationHelper";
	import type { ShlinkSettings } from "../SettingsHelper";
	import type { ShlinkItem, ShlinkTagsResponse } from "../ShlinkData";

	export let url: string;
	export let settings: ShlinkSettings;
	let backend = new ShlinkV2Backend(settings);
	let shlinkItems: ShlinkItem[] = [];

	const updateShlinkItems = () => {
		shlinkItems = [];
		backend
			.getShorts({ searchTerm: url })
			.then((data: ShlinkTagsResponse) => {
				console.log(data);
				shlinkItems = data.shortUrls.data;
			});
	};

	const createShortUrl = () => {
		backend
			.createShort({
				longUrl: url,
				findIfExists: true,
			})
			.then(() => {
				updateShlinkItems();
			});
	};

	const deleteShortUrl = ({
		detail,
	}: CustomEvent<{ shlinkItem: ShlinkItem }>) => {
		backend.deleteShort(detail.shlinkItem.shortCode).then(() => {
			updateShlinkItems();
		});
	};

	const viewStatsForShortUrl = ({
		detail,
	}: CustomEvent<{ shlinkItem: ShlinkItem }>) => {
		openStatsForItem(detail.shlinkItem.shortCode);
	};

	updateShlinkItems();
</script>

{#if shlinkItems.length === 0}
	<p>No short links found for this URL.</p>
{:else}
{#each shlinkItems as shlinkItem}
	<ShlinkItemTile {shlinkItem} on:delete={deleteShortUrl} on:stats={viewStatsForShortUrl} />
{/each}
{/if}
<Row>
	<Column>
		<Button on:click={createShortUrl}>Create link!</Button>
	</Column>
</Row>
