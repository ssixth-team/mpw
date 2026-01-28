<script lang="ts">
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
  import { onMount } from 'svelte';
  import { getBumps } from '$lib/api/bumps';
  import type { MPW_BUMP } from '$lib/schemas/bump.schema';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Plus, RefreshCw } from '@lucide/svelte';
  import { Window } from '$lib/components/ui/window';
  import BumpForm from './BumpForm.svelte';

  let tableDiv: HTMLDivElement;
  let table: Tabulator;
  let bumps = $state<MPW_BUMP[]>([]);
  let loading = $state(false);
  let addWindowOpen = $state(false);
  let editWindowOpen = $state(false);
  let selectedBump = $state<MPW_BUMP | null>(null);

  // Bump 데이터 로딩
  async function loadBumps() {
    loading = true;
    try {
      bumps = await getBumps();
      if (table) {
        table.setData(bumps);
      }
    } catch (error) {
      console.error('Failed to load bumps:', error);
    } finally {
      loading = false;
    }
  }

  // Row 클릭 핸들러
  function handleRowClick(_e: any, row: any) {
    const data = row.getData() as MPW_BUMP;
    selectedBump = data;
    editWindowOpen = true;
  }

  // Tabulator 테이블 초기화
  onMount(async () => {
    await loadBumps();

    table = new Tabulator(tableDiv, {
      layout: 'fitColumns',
      data: bumps,
      rowHeight: 45,
      columns: [
        {
          title: 'Code',
          field: 'code',
          width: 150,
          hozAlign: 'center',
          sorter: 'string'
        },
        {
          title: 'Name',
          field: 'name',
          width: 200
        },
        {
          title: 'Use Tag',
          field: 'useTag',
          width: 120,
          hozAlign: 'center',
          formatter: (cell) => {
            const value = cell.getValue();
            const color = value === 'Y' ? '#2e7d32' : '#c62828';
            const bg = value === 'Y' ? '#e8f5e9' : '#ffebee';
            return `<span style="background-color: ${bg}; color: ${color}; padding: 4px 12px; border-radius: 12px; font-weight: 500;">${value}</span>`;
          }
        },
        {
          title: 'Avail',
          field: 'avail',
          width: 100,
          hozAlign: 'center',
          formatter: (cell) => {
            const value = cell.getValue();
            const color = value === 'Y' ? '#2e7d32' : '#c62828';
            const bg = value === 'Y' ? '#e8f5e9' : '#ffebee';
            return `<span style="background-color: ${bg}; color: ${color}; padding: 4px 12px; border-radius: 12px; font-weight: 500;">${value}</span>`;
          }
        }
      ],
      movableColumns: true,
      resizableColumns: true,
      pagination: true,
      paginationSize: 10,
      paginationSizeSelector: [10, 20, 50, 100]
    });

    // rowClick 이벤트 바인딩
    table.on('rowClick', handleRowClick);
  });

  // Bump 추가 성공 핸들러
  function handleBumpAdded() {
    addWindowOpen = false;
    loadBumps();
  }

  // Bump 수정 성공 핸들러
  function handleBumpUpdated() {
    editWindowOpen = false;
    selectedBump = null;
    loadBumps();
  }
</script>

<div class="bump-container">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold mb-2">Bump Management</h2>
      <p class="text-muted-foreground">Bump 코드 관리 페이지입니다.</p>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" onclick={loadBumps} disabled={loading}>
        <RefreshCw class="h-4 w-4 mr-2 {loading ? 'animate-spin' : ''}" />
        새로고침
      </Button>
      <Button size="sm" onclick={() => (addWindowOpen = true)}>
        <Plus class="h-4 w-4 mr-2" />
        Add
      </Button>
    </div>
  </div>

  <div bind:this={tableDiv}></div>
</div>

<!-- Non-Modal Window for Adding Bump -->
<Window bind:open={addWindowOpen} title="Add New Bump" width="600px" modal={false}>
  <BumpForm onSuccess={handleBumpAdded} onCancel={() => (addWindowOpen = false)} />
</Window>

<!-- Non-Modal Window for Editing Bump -->
<Window bind:open={editWindowOpen} title="Edit Bump" width="600px" modal={false}>
  <BumpForm
    editMode={true}
    initialData={selectedBump}
    onSuccess={handleBumpUpdated}
    onCancel={() => {
      editWindowOpen = false;
      selectedBump = null;
    }}
  />
</Window>

<style>
  .bump-container {
    width: 100%;
  }

  :global(.tabulator) {
    font-size: 14px;
  }

  :global(.tabulator .tabulator-header) {
    background-color: hsl(var(--muted));
    border-bottom: 2px solid hsl(var(--border));
  }

  :global(.tabulator .tabulator-row:hover) {
    background-color: hsl(var(--muted) / 0.5);
  }
</style>
