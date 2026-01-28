<script lang="ts">
  import { TabulatorFull as Tabulator } from 'tabulator-tables';
  import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
  import { onMount } from 'svelte';
  import { getLimits } from '$lib/api/limits';
  import type { MPW_LIMITS } from '$lib/schemas/limits.schema';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Plus, RefreshCw } from '@lucide/svelte';
  import { Window } from '$lib/components/ui/window';
  import LimitsForm from './LimitsForm.svelte';

  let tableDiv: HTMLDivElement;
  let table: Tabulator;
  let limits = $state<MPW_LIMITS[]>([]);
  let loading = $state(false);
  let addWindowOpen = $state(false);
  let editWindowOpen = $state(false);
  let selectedLimits = $state<MPW_LIMITS | null>(null);

  // Limits 데이터 로딩
  async function loadLimits() {
    loading = true;
    try {
      limits = await getLimits();
      if (table) {
        table.setData(limits);
      }
    } catch (error) {
      console.error('Failed to load limits:', error);
    } finally {
      loading = false;
    }
  }

  // Row 클릭 핸들러
  function handleRowClick(_e: any, row: any) {
    const data = row.getData() as MPW_LIMITS;
    selectedLimits = data;
    editWindowOpen = true;
  }

  // Tabulator 테이블 초기화
  onMount(async () => {
    await loadLimits();

    table = new Tabulator(tableDiv, {
      layout: 'fitColumns',
      data: limits,
      rowHeight: 45,
      columns: [
        {
          title: 'Code',
          field: 'code',
          width: 120,
          hozAlign: 'center',
          sorter: 'string'
        },
        {
          title: 'Name',
          field: 'name',
          width: 180
        },
        {
          title: 'Min Value',
          field: 'minValue',
          width: 120,
          hozAlign: 'right',
          sorter: 'number',
          formatter: (cell) => {
            const value = cell.getValue();
            return `<span style="font-weight: 500;">${value}</span>`;
          }
        },
        {
          title: 'Max Value',
          field: 'maxValue',
          width: 120,
          hozAlign: 'right',
          sorter: 'number',
          formatter: (cell) => {
            const value = cell.getValue();
            return `<span style="font-weight: 500;">${value}</span>`;
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

  // Limits 추가 성공 핸들러
  function handleLimitsAdded() {
    addWindowOpen = false;
    loadLimits();
  }

  // Limits 수정 성공 핸들러
  function handleLimitsUpdated() {
    editWindowOpen = false;
    selectedLimits = null;
    loadLimits();
  }
</script>

<div class="limits-container">
  <div class="flex justify-between items-center mb-6">
    <div>
      <h2 class="text-2xl font-bold mb-2">Limits Management</h2>
      <p class="text-muted-foreground">Limits 코드 관리 페이지입니다.</p>
    </div>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" onclick={loadLimits} disabled={loading}>
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

<!-- Non-Modal Window for Adding Limits -->
<Window bind:open={addWindowOpen} title="Add New Limits" width="600px" modal={false}>
  <LimitsForm onSuccess={handleLimitsAdded} onCancel={() => (addWindowOpen = false)} />
</Window>

<!-- Non-Modal Window for Editing Limits -->
<Window bind:open={editWindowOpen} title="Edit Limits" width="600px" modal={false}>
  <LimitsForm
    editMode={true}
    initialData={selectedLimits}
    onSuccess={handleLimitsUpdated}
    onCancel={() => {
      editWindowOpen = false;
      selectedLimits = null;
    }}
  />
</Window>

<style>
  .limits-container {
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
