<script lang="ts">
	import { ShlinkBackend } from "../Backend";

	import type { ShlinkSettings } from "../SettingsHelper";
	import { isSettingsValid } from "../SettingsHelper";
	import type { ShlinkItem, ShlinkTagsResponse } from "../ShlinkData";

	export let settings: ShlinkSettings;
	let settingsValid = isSettingsValid(settings);
	let shlinkItem: ShlinkItem | undefined;
	let currentUrl = "";
	let backend = new ShlinkBackend(settings);

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0];
		currentUrl = tab.url;
	});

	$: {
		if (settingsValid && currentUrl.length !== 0) {
			fetch(
				`${settings.apiUrl}/rest/v2/short-urls?searchTerm=${encodeURI(
					settings.apiUrl
				)}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"X-Api-Key": settings.apiSecret,
					},
				}
			)
				.then((response) => response.json())
				.then((data: ShlinkTagsResponse) => {
					shlinkItem = data.shortUrls.data.filter(
						(item) => item.longUrl === currentUrl
					)[0];
				});
		}
	}

	const createShortUrl = () => {
		backend.createShort(currentUrl)
			.then((data: ShlinkItem) => {
				shlinkItem = data;
			});
	};

	const deleteShortUrl = () => {
		fetch(`${settings.apiUrl}/rest/v2/short-urls/${shlinkItem.shortCode}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"X-Api-Key": settings.apiSecret,
			},
		}).then((response) => {
			if (response.ok) {
				shlinkItem = undefined;
			}
		});
	};
</script>

{#if settings === undefined}
	<div>
		<p>Loading...</p>
	</div>
{:else if !settingsValid}
	<div>
		<p>Invalid settings.</p>
	</div>
{:else}
	<main>
		<h1>Shlink</h1>
		<h2>Url: {currentUrl}</h2>
		{#if shlinkItem !== undefined}
			<code>{shlinkItem.shortUrl}</code>
			<button on:click={deleteShortUrl}> Remove </button>
		{:else}
			<button on:click={createShortUrl}> Create link! </button>
		{/if}
	</main>
{/if}

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
