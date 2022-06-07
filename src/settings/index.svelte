<script lang="ts">
	import { Content, Header, Loading, SkipToContent } from "carbon-components-svelte";

	import "carbon-components-svelte/css/white.css";
	import type { ShlinkSettings } from "../SettingsHelper";
	import { loadSettings, saveSettings } from "../Storage";
	import Settings from "./Settings.svelte";

	let settingsPromise: Promise<ShlinkSettings> = loadSettings().then(
		(settings) => {
			console.log("Settings loaded!", settings);
			return settings;
		}
	);

	const handleSave = async (settings: ShlinkSettings): Promise<void> => {
		await saveSettings(settings);
		console.log("Settings saved!", settings);
	};
</script>

<Header company="Shlink Browser" platformName="Options">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
</Header>

<Content>
	{#await settingsPromise}
		<Loading withOverlay={false} description="Loading your settings"/>
	{:then settings}
		<Settings {settings} {handleSave} />
	{/await}
</Content>
