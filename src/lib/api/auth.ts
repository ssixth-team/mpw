/**
 * 인증 API
 * Spring Boot JWT 인증 서버와 통합
 */

import axios from 'axios';
import type { LoginRequest, LoginResponse } from '$lib/types/auth.types';
import type { Account } from '$lib/schemas/account.schema';

/**
 * Spring JWT 로그인 응답 형식
 */
interface SpringLoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user?: Account; // 백엔드에서 user 정보 포함
}

/**
 * 로그인
 * Spring의 /api/auth/login을 호출하고 사용자 정보를 가져옴
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // 1. Spring 로그인 API 호출
  console.log('[Auth] Requesting login to /api/auth/login');
  const loginResponse = await axios.post<SpringLoginResponse>('/api/auth/login', credentials);
  console.log('[Auth] Login response data:', loginResponse.data);

  const { accessToken, user } = loginResponse.data;

  // 2. 백엔드에서 user 정보를 주면 바로 사용, 아니면 별도 조회
  let account = user;
  if (!account) {
    console.warn('[Auth] User info missing in login response. Fetching from /api/auth/me');
    try {
      const userResponse = await axios.get<Account>('/api/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log('[Auth] /api/auth/me response:', userResponse.data);
      account = userResponse.data;
    } catch (error) {
      console.error('[Auth] Failed to fetch user info:', error);
    }
  } else {
    console.log('[Auth] User info found in login response:', account);
  }

  if (!account) {
    throw new Error('Failed to retrieve user information.');
  }

  // 3. SvelteKit 형식으로 반환
  return {
    token: accessToken,
    user: account
  };
};

/**
 * 로그아웃
 * JWT는 stateless이므로 클라이언트에서 토큰만 제거
 */
export const logout = async (): Promise<void> => {
  // JWT 방식이므로 서버 호출 불필요
  // authStore.clearAuth()로 클라이언트 토큰 제거
};

/**
 * JWT 토큰 유효성 검증
 * 현재 사용자 정보를 가져올 수 있는지 확인
 */
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    await axios.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return true;
  } catch {
    return false;
  }
};

/**
 * 현재 사용자 정보 조회
 */
export const getCurrentUser = async (token?: string): Promise<Account> => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.get<Account>('/api/auth/me', config);
  return response.data;
};
