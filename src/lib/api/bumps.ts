import type { MPW_BUMP } from '$lib/schemas/bump.schema';

export type CreateBumpDto = Omit<MPW_BUMP, 'code'>;
export type UpdateBumpDto = Partial<Omit<MPW_BUMP, 'code'>>;

export async function getBumps(): Promise<MPW_BUMP[]> {
  const response = await fetch('/api/bumps');
  if (!response.ok) {
    throw new Error('Failed to fetch bumps');
  }
  return response.json();
}

export async function createBump(data: CreateBumpDto): Promise<MPW_BUMP> {
  const response = await fetch('/api/bumps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to create bump');
  }
  return response.json();
}

export async function updateBump(code: string, data: UpdateBumpDto): Promise<MPW_BUMP> {
  const response = await fetch(`/api/bumps/${code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update bump');
  }
  return response.json();
}

export async function deleteBump(code: string): Promise<void> {
  const response = await fetch(`/api/bumps/${code}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete bump');
  }
}
