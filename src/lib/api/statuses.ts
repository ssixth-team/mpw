import type { MPW_STATUS } from '$lib/schemas/status.schema';

export type CreateStatusDto = Omit<MPW_STATUS, 'code'>;
export type UpdateStatusDto = Partial<Omit<MPW_STATUS, 'code'>>;

export async function getStatuses(): Promise<MPW_STATUS[]> {
  const response = await fetch('/api/statuses');
  if (!response.ok) {
    throw new Error('Failed to fetch statuses');
  }
  return response.json();
}

export async function createStatus(data: CreateStatusDto): Promise<MPW_STATUS> {
  const response = await fetch('/api/statuses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to create status');
  }
  return response.json();
}

export async function updateStatus(code: string, data: UpdateStatusDto): Promise<MPW_STATUS> {
  const response = await fetch(`/api/statuses/${code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update status');
  }
  return response.json();
}

export async function deleteStatus(code: string): Promise<void> {
  const response = await fetch(`/api/statuses/${code}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete status');
  }
}
