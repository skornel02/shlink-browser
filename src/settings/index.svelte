<script lang="ts">
	import "carbon-components-svelte/css/white.css";
	import {
		Content,
		Header,
		HeaderGlobalAction,
		HeaderUtilities,
		Loading,
		SkipToContent,
	} from "carbon-components-svelte";
	import LogoGithub from "carbon-icons-svelte/lib/LogoGithub.svelte";
	import type { ShlinkSettings } from "../SettingsHelper";
	import { loadSettings, saveSettings } from "../Storage";
	import Settings from "./Settings.svelte";
	import { openDashboard, openSite } from "../NavigationHelper";
	import { Table } from "carbon-icons-svelte";

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
	<HeaderUtilities>
		<HeaderGlobalAction
			aria-label="Dashboard"
			icon={Table}
			on:click={openDashboard}
		/>
		<HeaderGlobalAction
			aria-label="Settings"
			icon={LogoGithub}
			on:click={openSite}
		/>
	</HeaderUtilities>
</Header>

<Content>
	{#await settingsPromise}
		<Loading withOverlay={false} description="Loading your settings" />
	{:then settings}
		<Settings {settings} {handleSave} />
	{/await}
</Content>
