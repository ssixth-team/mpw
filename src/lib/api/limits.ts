import type { MPW_LIMITS } from '$lib/schemas/limits.schema';

export type CreateLimitsDto = Omit<MPW_LIMITS, 'code'>;
export type UpdateLimitsDto = Partial<Omit<MPW_LIMITS, 'code'>>;

export async function getLimits(): Promise<MPW_LIMITS[]> {
  const response = await fetch('/api/limits');
  if (!response.ok) {
    throw new Error('Failed to fetch limits');
  }
  return response.json();
}

export async function createLimits(data: CreateLimitsDto): Promise<MPW_LIMITS> {
  const response = await fetch('/api/limits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to create limits');
  }
  return response.json();
}

export async function updateLimits(code: string, data: UpdateLimitsDto): Promise<MPW_LIMITS> {
  const response = await fetch(`/api/limits/${code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update limits');
  }
  return response.json();
}

export async function deleteLimits(code: string): Promise<void> {
  const response = await fetch(`/api/limits/${code}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete limits');
  }
}
