<script lang="ts">
	import "carbon-components-svelte/css/white.css";
	import type { ShlinkSettings } from "../SettingsHelper";
	import { loadSettings } from "../Storage";
	import Popup from "./Popup.svelte";
	import {
		Content,
		Header,
		HeaderGlobalAction,
		HeaderUtilities,
		Loading,
		SkipToContent,
	} from "carbon-components-svelte";
	import SettingsAdjust from "carbon-icons-svelte/lib/SettingsAdjust.svelte";
	import Table from "carbon-icons-svelte/lib/Table.svelte";
import { openDashboard, openSettings } from "../NavigationHelper";

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
	<HeaderUtilities>
		<HeaderGlobalAction
			aria-label="Dashboard"
			icon={Table}
			on:click={openDashboard}
		/>
		<HeaderGlobalAction
			aria-label="Settings"
			icon={SettingsAdjust}
			on:click={openSettings}
		/>
	</HeaderUtilities>
</Header>

<Content id="popupContainer">
	{#await settingsPromise}
		<Loading withOverlay={false} description="Loading your settings" />
	{:then settings}
		<Popup {settings} />
	{/await}
</Content>

<style>
	:global(#popupContainer) {
		text-align: center;
		padding: 1em;
		width: 300px;
		margin: inherit auto 0 auto;
	}
</style>
