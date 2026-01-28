<script lang="ts">
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
  import { onMount } from 'svelte';
  import { getStatuses } from '$lib/api/statuses';
  import type { MPW_STATUS } from '$lib/schemas/status.schema';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Plus, RefreshCw } from '@lucide/svelte';
  import { Window } from '$lib/components/ui/window';
  import StatusForm from './StatusForm.svelte';

  let tableDiv: HTMLDivElement;
  let table: Tabulator;
  let statuses = $state<MPW_STATUS[]>([]);
  let loading = $state(false);
  let addWindowOpen = $state(false);
  let editWindowOpen = $state(false);
  let selectedStatus = $state<MPW_STATUS | null>(null);

  // Status 데이터 로딩
  async function loadStatuses() {
    loading = true;
    try {
      statuses = await getStatuses();
      if (table) {
        table.setData(statuses);
      }
    } catch (error) {
      console.error('Failed to load statuses:', error);
    } finally {
      loading = false;
    }
  }

  // Row 클릭 핸들러
  function handleRowClick(_e: any, row: any) {
    const data = row.getData() as MPW_STATUS;
    selectedStatus = data;
    editWindowOpen = true;
  }

  // Tabulator 테이블 초기화
  onMount(async () => {
    await loadStatuses();

    table = new Tabulator(tableDiv, {
      layout: 'fitColumns',
      data: statuses,
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

  // Status 추가 성공 핸들러
  function handleStatusAdded() {
    addWindowOpen = false;
    loadStatuses();
  }

  // Status 수정 성공 핸들러
  function handleStatusUpdated() {
    editWindowOpen = false;
    selectedStatus = null;
    loadStatuses();
  }
</script>

<div class="status-container">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold mb-2">Status Management</h2>
      <p class="text-muted-foreground">Status 코드 관리 페이지입니다.</p>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" onclick={loadStatuses} disabled={loading}>
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

<!-- Non-Modal Window for Adding Status -->
<Window bind:open={addWindowOpen} title="Add New Status" width="600px" modal={false}>
  <StatusForm onSuccess={handleStatusAdded} onCancel={() => (addWindowOpen = false)} />
</Window>

<!-- Non-Modal Window for Editing Status -->
<Window bind:open={editWindowOpen} title="Edit Status" width="600px" modal={false}>
  <StatusForm
    editMode={true}
    initialData={selectedStatus}
    onSuccess={handleStatusUpdated}
    onCancel={() => {
      editWindowOpen = false;
      selectedStatus = null;
    }}
  />
</Window>

<style>
  .status-container {
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
