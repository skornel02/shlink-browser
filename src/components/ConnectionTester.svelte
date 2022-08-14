<script lang="ts">
	import {
		Button,
		ButtonSet,
		CodeSnippet,
		Grid,
		InlineLoading,
		Row,
	} from "carbon-components-svelte";
	import Unknown from "carbon-icons-svelte/lib/Unknown.svelte";
	import { ShlinkV2Backend } from "../Backend";

	export let apiSecret: string;
	export let apiUrl: string;

	let connectionStatus: "unknown" | "loading" | "online" | "offline";
	let errorMessage = "";
	const statusMap: { [key: string]: "active" | "finished" | "error" } = {
		loading: "active",
		online: "finished",
		offline: "error",
	};
	const descriptionMap = {
		loading: "Checking...",
		online: "Connection checks out!",
		offline: "Error while communicating!",
	};

	$: {
		`${apiSecret} - ${apiUrl}`;
		connectionStatus = "unknown";
	}

	const checkConnection = () => {
		const backend = new ShlinkV2Backend({ apiSecret, apiUrl });
		connectionStatus = "loading";
		backend
			.checkToken()
			.then(({ valid, body }) => {
				connectionStatus = valid ? "online" : "offline";
				errorMessage = body;
			})
			.catch(() => {
				connectionStatus = "offline";
				errorMessage = "Unknown error";
			});
	};
</script>

<Grid id="connectionTester">
	<Row>
		{#if connectionStatus === "unknown"}
			<Button on:click={checkConnection} icon={Unknown} wrap="false">Check&nbsp;connection</Button
			>
		{:else}
			<InlineLoading
				status={statusMap[connectionStatus]}
				description={descriptionMap[connectionStatus]}
			/>
		{/if}
	</Row>
	<Row>
		{#if connectionStatus === "offline"}
			<CodeSnippet type="multi" code={errorMessage} />
		{/if}
	</Row>
</Grid>
