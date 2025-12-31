<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
	import { onMount } from 'svelte';
	import { sampleData } from './sampledata';

	let tableDiv: HTMLDivElement;

	onMount(() => {
		const table = new Tabulator(tableDiv, {
			layout: 'fitColumns',
			data: sampleData,
			rowHeight: 40, // 행 높이 고정
			// autoColumns: true,
			columns: [
				//define the table columns
				{ title: 'Name', field: 'name', editor: 'input' },
				{
					title: 'Task Progress',
					field: 'progress',
					hozAlign: 'left',
					formatter: 'progress',
					editor: true
				},
				{
					title: 'Gender',
					field: 'gender',
					width: 95,
					editor: 'list',
					editorParams: { values: ['male', 'female'] }
				},
				{
					title: 'Rating',
					field: 'rating',
					formatter: 'star',
					hozAlign: 'center',
					width: 100,
					editor: true
				},
				{ title: 'Color', field: 'col', width: 130, editor: 'input' },
				{ title: 'Date Of Birth', field: 'dob', width: 130, sorter: 'date', hozAlign: 'center' },
				{
					title: 'Driver',
					field: 'car',
					width: 90,
					hozAlign: 'center',
					formatter: 'tickCross',
					sorter: 'boolean',
					editor: true
				}
			],
			movableColumns: true,
			resizableRows: true
		});
	});
</script>

<svelte:head>
	<title>Tabulator Sample</title>
	<meta name="description" content="Tabulator table library sample" />
</svelte:head>

<div class="container mx-auto p-6">
	<h1 class="text-3xl font-bold mb-6">Tabulator Sample</h1>
	<p class="mb-4 text-muted-foreground">
		Interactive table with sorting, pagination, and column resizing.
	</p>
	<div bind:this={tableDiv}></div>
</div>
