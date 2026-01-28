import type { MPW_CORNER } from '$lib/schemas/corner.schema';

export type CreateCornerDto = Omit<MPW_CORNER, 'code'>;
export type UpdateCornerDto = Partial<Omit<MPW_CORNER, 'code'>>;

export async function getCorners(): Promise<MPW_CORNER[]> {
  const response = await fetch('/api/corners');
  if (!response.ok) {
    throw new Error('Failed to fetch corners');
  }
  return response.json();
}

export async function createCorner(data: CreateCornerDto): Promise<MPW_CORNER> {
  const response = await fetch('/api/corners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to create corner');
  }
  return response.json();
}

export async function updateCorner(code: string, data: UpdateCornerDto): Promise<MPW_CORNER> {
  const response = await fetch(`/api/corners/${code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to update corner');
  }
  return response.json();
}

export async function deleteCorner(code: string): Promise<void> {
  const response = await fetch(`/api/corners/${code}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete corner');
  }
}
