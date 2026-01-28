<script lang="ts">
  import { onMount } from 'svelte';
  import {
    createStatus,
    updateStatus,
    type CreateStatusDto,
    type UpdateStatusDto
  } from '$lib/api/statuses';
  import { Button } from '$lib/components/ui/button/index.js';
  import type { MPW_STATUS } from '$lib/schemas/status.schema';

  interface Props {
    editMode?: boolean;
    initialData?: MPW_STATUS | null;
    onSuccess?: () => void;
    onCancel?: () => void;
  }

  let { editMode = false, initialData = null, onSuccess, onCancel }: Props = $props();

  // 폼 상태
  let code = $state('');
  let name = $state('');
  let avail = $state<'Y' | 'N'>('Y');

  let loading = $state(false);
  let error = $state<string | null>(null);

  // 수정 모드일 때 초기 데이터로 폼 필드 설정
  onMount(() => {
    if (editMode && initialData) {
      code = initialData.code;
      name = initialData.name;
      avail = initialData.avail;
    }
  });

  // 폼 제출
  async function handleSubmit(e: Event) {
    e.preventDefault();

    // 유효성 검사
    if (!code.trim()) {
      error = 'Code는 필수 입력 항목입니다.';
      return;
    }
    if (!name.trim()) {
      error = 'Name은 필수 입력 항목입니다.';
      return;
    }

    loading = true;
    error = null;

    try {
      if (editMode && initialData) {
        // 수정 모드
        const updateData: UpdateStatusDto = {
          name: name.trim(),
          avail
        };
        await updateStatus(initialData.code, updateData);
      } else {
        // 추가 모드
        const createData: CreateStatusDto = {
          name: name.trim(),
          avail
        };
        await createStatus(createData);
      }

      // 폼 초기화 (추가 모드일 때만)
      if (!editMode) {
        code = '';
        name = '';
        avail = 'Y';
      }

      // 성공 콜백 호출
      onSuccess?.();
    } catch (e) {
      error = editMode ? 'Status 수정에 실패했습니다.' : 'Status 추가에 실패했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  // 취소
  function handleCancel() {
    code = '';
    name = '';
    avail = 'Y';
    error = null;
    onCancel?.();
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4">
  {#if error}
    <div class="error-message">
      {error}
    </div>
  {/if}

  <div class="form-row">
    <div class="form-group">
      <label for="code">Code <span class="required">*</span></label>
      <input
        id="code"
        type="text"
        bind:value={code}
        placeholder="Code를 입력하세요"
        disabled={loading || editMode}
        class="select-input"
      />
    </div>

    <div class="form-group">
      <label for="name">Name <span class="required">*</span></label>
      <input
        id="name"
        type="text"
        bind:value={name}
        placeholder="Name을 입력하세요"
        disabled={loading}
        class="select-input"
      />
    </div>
  </div>

  <div class="form-group">
    <label for="avail">Avail <span class="required">*</span></label>
    <select id="avail" bind:value={avail} disabled={loading} class="select-input">
      <option value="Y">Y</option>
      <option value="N">N</option>
    </select>
  </div>

  <div class="form-actions">
    <Button type="button" variant="outline" onclick={handleCancel} disabled={loading}>취소</Button>
    <Button type="submit" disabled={loading}>
      {loading ? (editMode ? '수정 중...' : '추가 중...') : editMode ? '수정' : '추가'}
    </Button>
  </div>
</form>

<style>
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--foreground));
  }

  .required {
    color: hsl(var(--destructive));
  }

  .select-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid hsl(var(--input));
    border-radius: 0.375rem;
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }

  .select-input:focus {
    outline: none;
    border-color: hsl(var(--ring));
    box-shadow: 0 0 0 3px hsl(var(--ring) / 0.1);
  }

  .select-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    padding: 0.75rem 1rem;
    background-color: hsl(var(--destructive) / 0.1);
    border: 1px solid hsl(var(--destructive) / 0.3);
    border-radius: 0.375rem;
    color: hsl(var(--destructive));
    font-size: 0.875rem;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid hsl(var(--border));
  }
</style>
