<script lang="ts">
  import { createReference, type CreateReferenceDto } from '$lib/api/references';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { authStore } from '$lib/stores/auth.svelte';

  interface Props {
    onSuccess?: () => void;
    onCancel?: () => void;
  }

  let { onSuccess, onCancel }: Props = $props();

  // 폼 상태
  let process = $state<'design' | 'development' | 'testing' | 'deployment'>('design');
  let phase = $state('');
  let avail = $state<'Y' | 'N'>('Y');
  // 사용자 입력 필드 제거 - 로그인한 사용자 정보를 authStore에서 가져옴

  let loading = $state(false);
  let error = $state<string | null>(null);

  // 폼 제출
  async function handleSubmit(e: Event) {
    e.preventDefault();

    // 유효성 검사
    if (!phase.trim()) {
      error = 'Phase는 필수 입력 항목입니다.';
      return;
    }

    loading = true;
    error = null;

    try {
      const data: CreateReferenceDto = {
        process,
        phase,
        avail
        // createUser는 백엔드에서 JWT 토큰으로 자동 주입
      };

      await createReference(data);

      // 폼 초기화
      process = 'design';
      phase = '';
      avail = 'Y';

      // 성공 콜백 호출
      onSuccess?.();
    } catch (e) {
      error = 'Reference 추가에 실패했습니다.';
      console.error(e);
    } finally {
      loading = false;
    }
  }

  // 취소
  function handleCancel() {
    // 폼 초기화
    process = 'design';
    phase = '';
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
      <label for="process">Process <span class="required">*</span></label>
      <select id="process" bind:value={process} disabled={loading} class="select-input">
        <option value="design">Design</option>
        <option value="development">Development</option>
        <option value="testing">Testing</option>
        <option value="deployment">Deployment</option>
      </select>
    </div>

    <div class="form-group">
      <label for="avail">Avail <span class="required">*</span></label>
      <select id="avail" bind:value={avail} disabled={loading} class="select-input">
        <option value="Y">Y</option>
        <option value="N">N</option>
      </select>
    </div>
  </div>

  <div class="form-group">
    <label for="phase">Phase <span class="required">*</span></label>
    <Input
      id="phase"
      type="text"
      bind:value={phase}
      placeholder="Phase를 입력하세요 (예: Phase 1)"
      disabled={loading}
    />
  </div>

  <div class="divider">
    <span>Created By (로그인한 사용자)</span>
  </div>

  <div class="user-info-display">
    {#if authStore.currentUser}
      <div class="user-field">
        <span class="user-label">User ID:</span>
        <span class="user-value">{authStore.currentUser.loginId || '-'}</span>
      </div>
      <div class="user-field">
        <span class="user-label">User Name:</span>
        <span class="user-value">{authStore.currentUser.username || '-'}</span>
      </div>
      <div class="user-field">
        <span class="user-label">Email:</span>
        <span class="user-value">{authStore.currentUser.email || '-'}</span>
      </div>
    {:else}
      <p class="no-user-warning">로그인이 필요합니다.</p>
    {/if}
  </div>

  <div class="form-actions">
    <Button type="button" variant="outline" onclick={handleCancel} disabled={loading}>취소</Button>
    <Button type="submit" disabled={loading}>
      {loading ? '추가 중...' : '추가'}
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

  .divider {
    display: flex;
    align-items: center;
    margin: 1.5rem 0 1rem;
  }

  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: hsl(var(--border));
  }

  .divider span {
    padding: 0 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
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

  .user-info-display {
    padding: 1rem;
    background-color: hsl(var(--muted) / 0.5);
    border-radius: 0.375rem;
    border: 1px solid hsl(var(--border));
  }

  .user-field {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid hsl(var(--border) / 0.5);
  }

  .user-field:last-child {
    border-bottom: none;
  }

  .user-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: hsl(var(--muted-foreground));
  }

  .user-value {
    font-size: 0.875rem;
    color: hsl(var(--foreground));
  }

  .no-user-warning {
    text-align: center;
    color: hsl(var(--destructive));
    font-size: 0.875rem;
    margin: 0;
  }
</style>
