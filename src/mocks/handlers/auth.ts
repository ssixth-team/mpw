/**
 * MSW 인증 핸들러
 * 실제 서버 연동을 위해 요청을 passthrough 처리
 */

import { http, passthrough } from 'msw';

export const authHandlers = [
  // POST /auth/login - 로그인
  http.post('/auth/login', () => passthrough()),

  // POST /auth/logout - 로그아웃
  http.post('/auth/logout', () => passthrough()),

  // GET /auth/validate - 토큰 유효성 검증
  http.get('/auth/validate', () => passthrough()),

  // GET /auth/me - 현재 사용자 정보 조회
  http.get('/auth/me', () => passthrough())
];
