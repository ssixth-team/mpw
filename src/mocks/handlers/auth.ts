/**
 * MSW 인증 핸들러
 * 실제 서버 연동을 위해 요청을 passthrough 처리
 */

import { http, passthrough } from 'msw';

export const authHandlers = [
  // POST /api/auth/login - 로그인
  http.post('/api/auth/login', () => passthrough()),

  // POST /api/auth/logout - 로그아웃
  http.post('/api/auth/logout', () => passthrough()),

  // GET /api/auth/validate - 토큰 유효성 검증
  http.get('/api/auth/validate', () => passthrough()),

  // GET /api/auth/me - 현재 사용자 정보 조회
  http.get('/api/auth/me', () => passthrough())
];
