<script lang="ts">
	import "carbon-components-svelte/css/white.css";
	import type { ShlinkSettings } from "../SettingsHelper";
	import { loadSettings } from "../Storage";
	import {
		Content,
		Header,
		HeaderGlobalAction,
		HeaderUtilities,
		Loading,
		SkipToContent,
	} from "carbon-components-svelte";
	import SettingsAdjust from "carbon-icons-svelte/lib/SettingsAdjust.svelte";
import Dashboard from "./Dashboard.svelte";

	let settingsPromise: Promise<ShlinkSettings> = loadSettings().then(
		(settings) => {
			console.log("Settings loaded!", settings);
			return settings;
		}
	);

	const openSettings = () => {
		if (chrome !== undefined && chrome.runtime !== undefined) {
			if (chrome.runtime.openOptionsPage !== undefined) {
				chrome.runtime.openOptionsPage();
			} else if (chrome.runtime.getURL !== undefined) {
				window.open(chrome.runtime.getURL("options.html"));
			}
		}
	};
</script>

<Header company="Shlink Browser" platformName="Popup">
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderUtilities>
		<HeaderGlobalAction
			aria-label="Settings"
			icon={SettingsAdjust}
			on:click={openSettings}
		/>
	</HeaderUtilities>
</Header>

<Content id="dashboardContainer">
	{#await settingsPromise}
		<Loading withOverlay={false} description="Loading your settings" />
	{:then settings}
		<Dashboard {settings}/>
	{/await}
</Content>
