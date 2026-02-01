/**
 * Axios 전역 설정
 * JWT 토큰 자동 추가 및 401 에러 처리
 */

import axios from 'axios';
import { authStore } from '$lib/stores/auth.svelte';

/**
 * 쿠키에서 특정 값 읽기
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

// Request Interceptor: 모든 요청에 JWT 토큰 자동 추가
axios.interceptors.request.use(
  (config) => {
    // 1. authStore에서 토큰 확인
    let token = authStore.token;

    // 2. authStore에 없으면 쿠키에서 읽기 (Spring이 쿠키에 저장)
    if (!token) {
      const cookieAuth = getCookie('Authorization');
      if (cookieAuth) {
        token = cookieAuth.replace('Bearer ', '');
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 에러 시 자동 로그아웃 처리
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로그아웃 처리
      authStore.clearAuth();

      // 쿠키도 삭제
      if (typeof document !== 'undefined') {
        document.cookie = 'Authorization=; path=/; max-age=0';
      }

      // 로그인 페이지로 리다이렉트 (브라우저 환경에서만)
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
