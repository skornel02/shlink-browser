<script lang="ts">
	import {
		Button,
		CodeSnippet,
		Grid,
		Row,
		Tag,
	} from "carbon-components-svelte";

	import { ShlinkV2Backend } from "../Backend";
	import type { ShlinkSettings } from "../SettingsHelper";
	import { isSettingsValid } from "../SettingsHelper";
	import type { ShlinkItem, ShlinkTagsResponse } from "../ShlinkData";
	import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
	import { getActiveTab } from "../TabsHelper";

	export let settings: ShlinkSettings;
	let settingsValid = isSettingsValid(settings);
	let shlinkItem: ShlinkItem | undefined;
	let currentUrl = "";
	let backend = new ShlinkV2Backend(settings);

	getActiveTab((tab) => {
		currentUrl = tab.url ?? "";
	});

	$: {
		if (settingsValid && currentUrl.length !== 0) {
			console.log(currentUrl);
			backend
				.getShorts({ searchTerm: currentUrl })
				.then((data: ShlinkTagsResponse) => {
					console.log(data);
					shlinkItem = data.shortUrls.data.filter(
						(item) => item.longUrl === currentUrl
					)[0];
				});
		}
	}

	const createShortUrl = () => {
		backend
			.createShort({
				longUrl: currentUrl,
				findIfExists: true,
			})
			.then((data: ShlinkItem) => {
				shlinkItem = data;
			});
	};

	const deleteShortUrl = () => {
		backend.deleteShort(shlinkItem.shortCode).then(() => {
			shlinkItem = undefined;
		});
	};
</script>

<Grid id="main">
	{#if !settingsValid}
		<div>
			<p>Invalid settings.</p>
		</div>
	{:else}
		{#if shlinkItem !== undefined}
			<Row>
				<CodeSnippet code={shlinkItem.shortUrl} />
			</Row>
			<Row>
				<Button
					kind="danger-tertiary"
					iconDescription="Delete"
					icon={TrashCan}
					on:click={deleteShortUrl}
				/>
			</Row>
		{:else}
			<Row>
				<Button on:click={createShortUrl}>Create link!</Button>
			</Row>
		{/if}
	{/if}
</Grid>

<style>
	:global(#main) {
		text-align: center;
		padding: 1em;
		max-width: 300px;
		min-width: 200px;
		margin: 0 auto;
	}
</style>
