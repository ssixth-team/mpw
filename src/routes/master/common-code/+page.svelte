<script lang="ts">
  import CommonCodeBump from '$lib/components/common-code/CommonCodeBump.svelte';
  import CommonCodeCorner from '$lib/components/common-code/CommonCodeCorner.svelte';
  import CommonCodeStatus from '$lib/components/common-code/CommonCodeStatus.svelte';
  import CommonCodeLimits from '$lib/components/common-code/CommonCodeLimits.svelte';

  type CommonCodeType = 'Bump' | 'Corner' | 'Status' | 'Limits';
  let selectedType = $state<CommonCodeType>('Bump');

  // 동적 컴포넌트 매핑
  const componentMap = {
    Bump: CommonCodeBump,
    Corner: CommonCodeCorner,
    Status: CommonCodeStatus,
    Limits: CommonCodeLimits
  };
</script>

<svelte:head>
  <title>Common Code Management</title>
  <meta name="description" content="Common Code 마스터 관리 페이지" />
</svelte:head>

<div class="container mx-auto p-6">
  <div class="header-section mb-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold mb-2">Common Code Management</h1>
        <p class="text-muted-foreground">공통 코드 마스터 데이터를 관리하는 페이지입니다.</p>
      </div>
      <div class="type-selector">
        <label for="type-select" class="selector-label">Type:</label>
        <select id="type-select" bind:value={selectedType} class="type-select">
          <option value="Bump">Bump</option>
          <option value="Corner">Corner</option>
          <option value="Status">Status</option>
          <option value="Limits">Limits</option>
        </select>
      </div>
    </div>
  </div>

  <!-- 동적 컴포넌트 렌더링 -->
  <div class="content-section">
    <svelte:component this={componentMap[selectedType]} />
  </div>
</div>

<style>
  .container {
    max-width: 1400px;
  }

  .header-section {
    border-bottom: 2px solid hsl(var(--border));
    padding-bottom: 1.5rem;
  }

  .type-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .selector-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .type-select {
    min-width: 150px;
    padding: 0.5rem 0.75rem;
    border: 1px solid hsl(var(--input));
    border-radius: 0.375rem;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .type-select:hover {
    border-color: hsl(var(--ring));
  }

  .type-select:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 3px hsl(var(--ring) / 0.1);
  }

  .content-section {
    margin-top: 1.5rem;
  }
</style>
