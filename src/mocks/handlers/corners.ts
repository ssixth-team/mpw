import { http, HttpResponse } from 'msw';
import { db } from '../db';
import type { MPW_CORNER } from '$lib/schemas/corner.schema';

export const cornerHandlers = [
  // GET /api/corners - 모든 Corner 조회
  http.get('/api/corners', async () => {
    const corners = await db.corners.toArray();
    return HttpResponse.json(corners);
  }),

  // POST /api/corners - Corner 생성
  http.post('/api/corners', async ({ request }) => {
    const data = (await request.json()) as Omit<MPW_CORNER, 'code'>;

    // 자동으로 code 생성
    const allCorners = await db.corners.toArray();
    const maxNum = allCorners.reduce((max, corner) => {
      const num = parseInt(corner.code.replace('CORNER', ''));
      return num > max ? num : max;
    }, 0);
    const newCode = `CORNER${String(maxNum + 1).padStart(3, '0')}`;

    const newCorner: MPW_CORNER = {
      code: newCode,
      ...data
    };

    await db.corners.add(newCorner);
    return HttpResponse.json(newCorner, { status: 201 });
  }),

  // PUT /api/corners/:code - Corner 수정
  http.put('/api/corners/:code', async ({ params, request }) => {
    const { code } = params;
    const data = (await request.json()) as Partial<Omit<MPW_CORNER, 'code'>>;

    const existing = await db.corners.get(code as string);
    if (!existing) {
      return HttpResponse.json({ error: 'Corner not found' }, { status: 404 });
    }

    const updated: MPW_CORNER = {
      ...existing,
      ...data
    };

    await db.corners.put(updated);
    return HttpResponse.json(updated);
  }),

  // DELETE /api/corners/:code - Corner 삭제
  http.delete('/api/corners/:code', async ({ params }) => {
    const { code } = params;
    await db.corners.delete(code as string);
    return HttpResponse.json({ success: true }, { status: 204 });
  })
];
