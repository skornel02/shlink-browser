<script lang="ts">
	import {
		Button,
		ButtonSet,
		CodeSnippet,
		Column,
		Grid,
		Row,
		Tile,
		Truncate,
	} from "carbon-components-svelte";
	import type { ShlinkItem } from "../ShlinkData";
	import TrashCan from "carbon-icons-svelte/lib/TrashCan.svelte";
	import View from "carbon-icons-svelte/lib/View.svelte";
	import ChartLineData from "carbon-icons-svelte/lib/ChartLineData.svelte";
	import { createEventDispatcher } from "svelte";

	export let shlinkItem: ShlinkItem;
	const dispatch = createEventDispatcher<{
		delete: { shlinkItem: ShlinkItem };
		stats: { shlinkItem: ShlinkItem};
	}>();

	const deleteShortUrl = () => {
		dispatch("delete", {
			shlinkItem,
		});
	};

	const statsForShortUrl = () => {
		dispatch("stats", {
			shlinkItem,
		});
	};
</script>

<Tile>
	<Grid>
		<Row>
			<Truncate clamp="front">
				{shlinkItem.longUrl}
			</Truncate>
		</Row>
		<Row>
			<CodeSnippet code={shlinkItem.shortUrl} />
		</Row>
		<Row>
			<Column class="visits">
				<View size={32} />
				<span>
					{shlinkItem.visitsCount}
				</span>
			</Column>
			<Column>
				<ButtonSet>
					<Button 
						kind="secondary"
						iconDescription="View statistics"
						icon={ChartLineData}
						on:click={statsForShortUrl}
					/>
					<Button
						kind="danger-tertiary"
						iconDescription="Delete"
						icon={TrashCan}
						on:click={deleteShortUrl}
					/>
				</ButtonSet>
			</Column>
		</Row>
	</Grid>
</Tile>

<style>
	:global(.visits) {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px !important;
	}
	:global(.visits) > span {
		margin-left: 5px;
	}
	:global(button) {
		width: 50px !important;
	}
</style>
