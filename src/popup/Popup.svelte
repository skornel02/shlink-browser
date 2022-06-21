<script lang="ts">
	import { Grid, Loading, Row } from "carbon-components-svelte";
	import { isSettingsValidCached, ShlinkSettings } from "../SettingsHelper";
	import { getActiveTab } from "../TabsHelper";
	import LinkSection from "./LinkSection.svelte";

	export let settings: ShlinkSettings;
	let settingsValidation: Promise<boolean>;
	let currentUrl = "";

	$: {
		settingsValidation = isSettingsValidCached(settings);
	}

	getActiveTab((tab) => {
		currentUrl = tab.url ?? "";
	});
</script>

{#if currentUrl.length === 0}
	<Loading withOverlay={false} description="Loading your settings" />
{:else}
	{#await settingsValidation}
		<Loading withOverlay={false} description="Validating your settings" />
	{:then valid}
		<Grid id="main">
			{#if valid}
				<LinkSection {settings} url={currentUrl} />
			{:else}
				<Row>
					<p>Invalid settings.</p>
				</Row>
			{/if}
		</Grid>
	{/await}
{/if}
