import type { Account } from '$lib/schemas/account.schema';

/**
 * 로그인 요청 DTO
 */
export interface LoginRequest {
  loginId: string;
  password: string;
}

/**
 * 로그인 응답 DTO
 */
export interface LoginResponse {
  token: string;
  user: Account;
}

/**
 * JWT 페이로드 구조
 */
export interface JWTPayload {
  sub: string; // loginId
  exp: number; // 만료 시간 (Unix timestamp)
  iat: number; // 발급 시간 (Unix timestamp)
}
