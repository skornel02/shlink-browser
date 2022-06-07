<script lang="ts">
	import "carbon-components-svelte/css/white.css";
	import type { ShlinkSettings } from "../SettingsHelper";
	import { loadSettings } from "../Storage";
	import Popup from "./Popup.svelte";
	import { Content, Header, Loading, SkipToContent } from "carbon-components-svelte";

	let settingsPromise: Promise<ShlinkSettings> = loadSettings().then(
		(settings) => {
			console.log("Settings loaded!", settings);
			return settings;
		}
	);
</script>

<Header company="Shlink Browser" platformName="Popup">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
</Header>

<Content>
	{#await settingsPromise}
		<Loading withOverlay={false} description="Loading your settings"/>
	{:then settings}
		<Popup {settings} />
	{/await}
</Content>
