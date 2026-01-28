import { http, HttpResponse } from 'msw';
import { db } from '../db';
import type { MPW_STATUS } from '$lib/schemas/status.schema';

export const statusHandlers = [
  // GET /api/statuses - 모든 Status 조회
  http.get('/api/statuses', async () => {
    const statuses = await db.statuses.toArray();
    return HttpResponse.json(statuses);
  }),

  // POST /api/statuses - Status 생성
  http.post('/api/statuses', async ({ request }) => {
    const data = (await request.json()) as Omit<MPW_STATUS, 'code'>;

    // 자동으로 code 생성
    const allStatuses = await db.statuses.toArray();
    const maxNum = allStatuses.reduce((max, status) => {
      const num = parseInt(status.code.replace('STATUS', ''));
      return num > max ? num : max;
    }, 0);
    const newCode = `STATUS${String(maxNum + 1).padStart(3, '0')}`;

    const newStatus: MPW_STATUS = {
      code: newCode,
      ...data
    };

    await db.statuses.add(newStatus);
    return HttpResponse.json(newStatus, { status: 201 });
  }),

  // PUT /api/statuses/:code - Status 수정
  http.put('/api/statuses/:code', async ({ params, request }) => {
    const { code } = params;
    const data = (await request.json()) as Partial<Omit<MPW_STATUS, 'code'>>;

    const existing = await db.statuses.get(code as string);
    if (!existing) {
      return HttpResponse.json({ error: 'Status not found' }, { status: 404 });
    }

    const updated: MPW_STATUS = {
      ...existing,
      ...data
    };

    await db.statuses.put(updated);
    return HttpResponse.json(updated);
  }),

  // DELETE /api/statuses/:code - Status 삭제
  http.delete('/api/statuses/:code', async ({ params }) => {
    const { code } = params;
    await db.statuses.delete(code as string);
    return HttpResponse.json({ success: true }, { status: 204 });
  })
];
