<script lang="ts">
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
  import { onMount } from 'svelte';
  import { getCorners } from '$lib/api/corners';
  import type { MPW_CORNER } from '$lib/schemas/corner.schema';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Plus, RefreshCw } from '@lucide/svelte';
  import { Window } from '$lib/components/ui/window';
  import CornerForm from './CornerForm.svelte';

  let tableDiv: HTMLDivElement;
  let table: Tabulator;
  let corners = $state<MPW_CORNER[]>([]);
  let loading = $state(false);
  let addWindowOpen = $state(false);
  let editWindowOpen = $state(false);
  let selectedCorner = $state<MPW_CORNER | null>(null);

  // Corner 데이터 로딩
  async function loadCorners() {
    loading = true;
    try {
      corners = await getCorners();
      if (table) {
        table.setData(corners);
      }
    } catch (error) {
      console.error('Failed to load corners:', error);
    } finally {
      loading = false;
    }
  }

  // Row 클릭 핸들러
  function handleRowClick(_e: any, row: any) {
    const data = row.getData() as MPW_CORNER;
    selectedCorner = data;
    editWindowOpen = true;
  }

  // Tabulator 테이블 초기화
  onMount(async () => {
    await loadCorners();

    table = new Tabulator(tableDiv, {
      layout: 'fitColumns',
      data: corners,
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
          width: 250
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

  // Corner 추가 성공 핸들러
  function handleCornerAdded() {
    addWindowOpen = false;
    loadCorners();
  }

  // Corner 수정 성공 핸들러
  function handleCornerUpdated() {
    editWindowOpen = false;
    selectedCorner = null;
    loadCorners();
  }
</script>

<div class="corner-container">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold mb-2">Corner Management</h2>
      <p class="text-muted-foreground">Corner 코드 관리 페이지입니다.</p>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" onclick={loadCorners} disabled={loading}>
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

<!-- Non-Modal Window for Adding Corner -->
<Window bind:open={addWindowOpen} title="Add New Corner" width="600px" modal={false}>
  <CornerForm onSuccess={handleCornerAdded} onCancel={() => (addWindowOpen = false)} />
</Window>

<!-- Non-Modal Window for Editing Corner -->
<Window bind:open={editWindowOpen} title="Edit Corner" width="600px" modal={false}>
  <CornerForm
    editMode={true}
    initialData={selectedCorner}
    onSuccess={handleCornerUpdated}
    onCancel={() => {
      editWindowOpen = false;
      selectedCorner = null;
    }}
  />
</Window>

<style>
  .corner-container {
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
