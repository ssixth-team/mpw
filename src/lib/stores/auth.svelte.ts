/**
 * 인증 상태 관리 스토어
 * Svelte 5 runes 기반 전역 상태 관리
 */

import type { Account } from '$lib/schemas/account.schema';

class AuthStore {
  currentUser = $state<Account | null>(null);
  token = $state<string | null>(null);

  // 인증 여부를 자동으로 계산 (토큰이 있고 만료되지 않아야 함)
  isAuthenticated = $derived(
    this.currentUser !== null && this.token !== null && !this.isTokenExpired(this.token)
  );

  /**
   * JWT 토큰 만료 여부 확인
   * 외부 라이브러리 없이 Base64 디코딩으로 exp claim 확인
   */
  isTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const { exp } = JSON.parse(jsonPayload);

      // exp는 초 단위, Date.now()는 밀리초 단위
      return Date.now() >= exp * 1000;
    } catch (e) {
      console.error('Failed to parse token expiration:', e);
      return true; // 파싱 실패 시 만료된 것으로 간주
    }
  }

  /**
   * 인증 정보 설정 및 localStorage에 저장
   */
  setAuth(user: Account, token: string) {
    this.currentUser = user;
    this.token = token;

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  }

  /**
   * 인증 정보 제거 및 localStorage 클리어
   */
  clearAuth() {
    this.currentUser = null;
    this.token = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      // 쿠키 삭제 (Authorization)
      document.cookie = 'Authorization=; Path=/; Max-Age=0;';
    }
  }

  /**
   * 로그아웃
   */
  logout() {
    this.clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * 페이지 로드 시 localStorage에서 인증 정보 복원
   */
  loadFromStorage() {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');

    if (token && userStr) {
      try {
        // 토큰 만료 체크 후 복원
        if (this.isTokenExpired(token)) {
          console.warn('[Auth] Stored token is expired. Clearing auth.');
          this.clearAuth();
          return;
        }

        this.token = token;
        this.currentUser = JSON.parse(userStr);
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        this.clearAuth();
      }
    }
  }

  /**
   * 현재 사용자의 간단한 정보 반환 (Reference createUser 형식)
   */
  getUserInfo() {
    if (!this.currentUser) return null;

    return {
      id: this.currentUser.loginId || '',
      name: this.currentUser.username || '',
      email: this.currentUser.email || ''
    };
  }
}

export const authStore = new AuthStore();
