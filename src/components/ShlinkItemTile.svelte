<script lang="ts">
	import {
		Button,
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
	import { createEventDispatcher } from "svelte";

	export let shlinkItem: ShlinkItem;
	const dispatch = createEventDispatcher<{
		delete: { shlinkItem: ShlinkItem };
	}>();

	const deleteShortUrl = () => {
		dispatch("delete", {
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
				<Button
					kind="danger-tertiary"
					iconDescription="Delete"
					icon={TrashCan}
					on:click={deleteShortUrl}
				/>
			</Column>
		</Row>
	</Grid>
</Tile>

<style>
	:global(.visits) {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	:global(.visits) > span {
		margin-left: 5px;
	}
</style>
