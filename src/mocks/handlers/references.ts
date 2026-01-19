import { http, HttpResponse } from 'msw';
import { db, type Reference } from '../db';

export const referenceHandlers = [
  // GET /api/references - 목록 조회
  http.get('/api/references', async () => {
    const references = await db.references.toArray();
    return HttpResponse.json(references);
  }),

  // GET /api/references/:id - 단건 조회
  http.get('/api/references/:id', async ({ params }) => {
    const { id } = params;
    const reference = await db.references.get(Number(id));

    if (!reference) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(reference);
  }),

  // POST /api/references - 등록
  http.post('/api/references', async ({ request }) => {
    const body = (await request.json()) as Omit<Reference, 'id' | 'createDate' | 'createUser'>;
    const authHeader = request.headers.get('Authorization');

    // JWT 토큰에서 사용자 정보 추출 (Mock 환경)
    // 실제 환경에서는 백엔드에서 JWT를 파싱하여 사용자 정보를 가져옴
    const mockUser = {
      id: 'testuser',
      name: 'Test User',
      email: 'test@example.com'
    };

    const id = await db.references.add({
      ...body,
      createUser: mockUser, // JWT에서 추출한 사용자 정보 자동 주입
      createDate: new Date().toISOString()
    } as any);

    const newReference = await db.references.get(id);
    return HttpResponse.json(newReference, { status: 201 });
  }),

  // PUT /api/references/:id - 수정
  http.put('/api/references/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Omit<Reference, 'id' | 'createDate'>>;

    const existingReference = await db.references.get(Number(id));
    if (!existingReference) {
      return new HttpResponse(null, { status: 404 });
    }

    await db.references.update(Number(id), body);
    const updatedReference = await db.references.get(Number(id));

    return HttpResponse.json(updatedReference);
  }),

  // DELETE /api/references/:id - 삭제
  http.delete('/api/references/:id', async ({ params }) => {
    const { id } = params;

    const existingReference = await db.references.get(Number(id));
    if (!existingReference) {
      return new HttpResponse(null, { status: 404 });
    }

    await db.references.delete(Number(id));
    return new HttpResponse(null, { status: 204 });
  })
];
