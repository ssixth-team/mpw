import { http, HttpResponse } from 'msw';
import { db } from '../db';
import type { MPW_BUMP } from '$lib/schemas/bump.schema';

export const bumpHandlers = [
  // GET /api/bumps - 모든 Bump 조회
  http.get('/api/bumps', async () => {
    const bumps = await db.bumps.toArray();
    return HttpResponse.json(bumps);
  }),

  // POST /api/bumps - Bump 생성
  http.post('/api/bumps', async ({ request }) => {
    const data = (await request.json()) as Omit<MPW_BUMP, 'code'>;

    // 자동으로 code 생성
    const allBumps = await db.bumps.toArray();
    const maxNum = allBumps.reduce((max, bump) => {
      const num = parseInt(bump.code.replace('BUMP', ''));
      return num > max ? num : max;
    }, 0);
    const newCode = `BUMP${String(maxNum + 1).padStart(3, '0')}`;

    const newBump: MPW_BUMP = {
      code: newCode,
      ...data
    };

    await db.bumps.add(newBump);
    return HttpResponse.json(newBump, { status: 201 });
  }),

  // PUT /api/bumps/:code - Bump 수정
  http.put('/api/bumps/:code', async ({ params, request }) => {
    const { code } = params;
    const data = (await request.json()) as Partial<Omit<MPW_BUMP, 'code'>>;

    const existing = await db.bumps.get(code as string);
    if (!existing) {
      return HttpResponse.json({ error: 'Bump not found' }, { status: 404 });
    }

    const updated: MPW_BUMP = {
      ...existing,
      ...data
    };

    await db.bumps.put(updated);
    return HttpResponse.json(updated);
  }),

  // DELETE /api/bumps/:code - Bump 삭제
  http.delete('/api/bumps/:code', async ({ params }) => {
    const { code } = params;
    await db.bumps.delete(code as string);
    return HttpResponse.json({ success: true }, { status: 204 });
  })
];
