<script lang="ts">
	import type { ShlinkSettings } from "../SettingsHelper";
	import {
		Button,
		Form,
		FormGroup,
		Grid,
		Row,
		TextInput,
	} from "carbon-components-svelte";
	import ConnectionTester from "../components/ConnectionTester.svelte";

	export let settings: ShlinkSettings;
	export let handleSave: (setting: ShlinkSettings) => Promise<void>;
	let { apiSecret, apiUrl } = settings;
	let unsaved: boolean = false;

	const createNewSettings = () => {
		return {
			apiSecret: apiSecret,
			apiUrl: apiUrl,
		};
	};

	const handleSaveButton = () => {
		const newSettings = createNewSettings();
		handleSave(newSettings)
			.then(() => {
				unsaved = false;
			})
			.catch(() => {
				unsaved = true;
			});
	};
</script>

<Grid>
	<Row>
		<h2>API options</h2>
	</Row>
	<Row>
		<Form>
			<FormGroup>
				<TextInput
					labelText="API key"
					placeholder="Enter api key..."
					helperText="You can find help with your api key here: https://shlink.io/documentation/api-docs/authentication/#managing-api-keys"
					bind:value={apiSecret}
					on:change={() => (unsaved = true)}
				/>
				<TextInput
					labelText="Server URL"
					placeholder="Enter server url..."
					helperText="This should be a fully qualified URL, including the protocol (http or https)"
					bind:value={apiUrl}
					on:change={() => (unsaved = true)}
				/>
			</FormGroup>
			<Button disabled={!unsaved} on:click={handleSaveButton}>Save</Button
			>
		</Form>
	</Row>
	<Row>
		<h2>Test</h2>
	</Row>
	<Row>
		<ConnectionTester {apiSecret} {apiUrl} />
	</Row>
</Grid>
