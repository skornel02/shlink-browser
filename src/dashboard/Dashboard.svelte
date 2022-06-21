<script lang="ts">
	import { Grid, Loading, Row } from "carbon-components-svelte";
	import LinkSection from "../popup/LinkSection.svelte";

	import { isSettingsValidCached, ShlinkSettings } from "../SettingsHelper";
import ItemStatistics from "./ItemStatistics.svelte";

	export let settings: ShlinkSettings;
	let settingsValidation: Promise<boolean>;

	const urlSearchParams = new URLSearchParams(window.location.search);
	const params = Object.fromEntries(urlSearchParams.entries());
    console.log(`params: `, params);

	$: {
		settingsValidation = isSettingsValidCached(settings);
	}
</script>

{#await settingsValidation}
	<Loading withOverlay={false} description="Validating your settings" />
{:then valid}
	<Grid id="main">
		{#if valid}
            {#if params["shortCode"] !== undefined}
                <ItemStatistics {settings} shortCode={params["shortCode"]}/>
            {:else}
			<LinkSection {settings} url={"https://skornel02.hu"} />
            {/if}
		{:else}
			<Row>
				<p>Invalid settings.</p>
			</Row>
		{/if}
	</Grid>
{/await}
