import { http, HttpResponse } from 'msw';
import { db } from '../db';
import type { MPW_LIMITS } from '$lib/schemas/limits.schema';

export const limitsHandlers = [
  // GET /api/limits - 모든 Limits 조회
  http.get('/api/limits', async () => {
    const limits = await db.limits.toArray();
    return HttpResponse.json(limits);
  }),

  // POST /api/limits - Limits 생성
  http.post('/api/limits', async ({ request }) => {
    const data = (await request.json()) as Omit<MPW_LIMITS, 'code'>;

    // 자동으로 code 생성
    const allLimits = await db.limits.toArray();
    const maxNum = allLimits.reduce((max, limit) => {
      const num = parseInt(limit.code.replace('LIMIT', ''));
      return num > max ? num : max;
    }, 0);
    const newCode = `LIMIT${String(maxNum + 1).padStart(3, '0')}`;

    const newLimits: MPW_LIMITS = {
      code: newCode,
      ...data
    };

    await db.limits.add(newLimits);
    return HttpResponse.json(newLimits, { status: 201 });
  }),

  // PUT /api/limits/:code - Limits 수정
  http.put('/api/limits/:code', async ({ params, request }) => {
    const { code } = params;
    const data = (await request.json()) as Partial<Omit<MPW_LIMITS, 'code'>>;

    const existing = await db.limits.get(code as string);
    if (!existing) {
      return HttpResponse.json({ error: 'Limits not found' }, { status: 404 });
    }

    const updated: MPW_LIMITS = {
      ...existing,
      ...data
    };

    await db.limits.put(updated);
    return HttpResponse.json(updated);
  }),

  // DELETE /api/limits/:code - Limits 삭제
  http.delete('/api/limits/:code', async ({ params }) => {
    const { code } = params;
    await db.limits.delete(code as string);
    return HttpResponse.json({ success: true }, { status: 204 });
  })
];
