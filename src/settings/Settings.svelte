<script lang="ts">
	import { ShlinkBackend } from "../Backend";
	import type { ShlinkSettings } from "../SettingsHelper";

	export let settings: ShlinkSettings;
	export let handleSave: (setting: ShlinkSettings) => Promise<void>;
	let { apiSecret, apiUrl } = settings;

    const createNewSettings = () => {
        return {
			apiSecret: apiSecret,
			apiUrl: apiUrl,

        };
    }

	const handleSaveButton = () => {
		const newSettings = createNewSettings();
		handleSave(newSettings);
	};

	const checkConnection = () => {
		const backend = new ShlinkBackend(createNewSettings());
		backend.checkToken().then((valid) => {
			alert(valid ? "Connection successful" : "Connection failed");
		});
	};
</script>

<main>
	<h1>Hello better dude!</h1>
	<p>
		Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
		how to build Svelte apps.
	</p>
	<p>
		API key: <input type="text" bind:value={apiSecret} />
	</p>
	<p>
		Server URL: <input type="text" bind:value={apiUrl} />
	</p>
	<button on:click={handleSaveButton}> Save </button>
	<button on:click={checkConnection}>Check connection</button>
</main>
