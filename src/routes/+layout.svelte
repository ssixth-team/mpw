<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { locales, localizeHref } from '$lib/paraglide/runtime';
  import AppSidebar from '$lib/components/app-sidebar.svelte';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Sidebar from '$lib/components/ui/sidebar/index.js';
  import { authStore } from '$lib/stores/auth.svelte';
  import '$lib/config/axios.config'; // Axios interceptor 초기화
  import '../app.css';

  let { children } = $props();

  // 라우트 정의 - 새로운 페이지 추가 시 여기에만 추가하면 됩니다
  const routes = [
    { path: '/', label: 'Home', isHome: true },
    { path: '/about', label: 'About' },
    { path: '/demo', label: 'Demo' },
    { path: '/items', label: 'Items' },
    { path: '/reference', label: 'Reference' },
    { path: '/references', label: 'References' },
    { path: '/tabulator', label: 'Tabulator' },
    { path: '/window-demo', label: 'Window Demo' },
    { path: '/quill-demo', label: 'Quill Demo' },
    { path: '/login', label: 'Login' },
    { path: '/master/common-code', label: 'Common Code' },
    { path: '/master/assembly', label: 'Assembly' }
  ];

  // 현재 경로에 맞는 라우트 찾기
  const currentRoute = $derived.by(() => {
    const pathname = page.url.pathname;

    // 홈 페이지 체크
    // if (pathname === '/mpw' || pathname === base + '/mpw') {
    //   return { path: '/references', label: 'References' };
    // }

    // 다른 라우트 찾기
    const route = routes.find((r) => {
      if (r.path === '/') {
        // 루트 경로는 정확히 일치할 때만
        return pathname === '/';
      }
      // 다른 경로는 해당 경로로 시작하는지 확인
      return pathname.startsWith(r.path);
    });
    return route || { path: pathname, label: 'Page', isHome: false };
  });

  import { goto } from '$app/navigation';
  import { getCurrentUser } from '$lib/api/auth';

  // 앱 초기화 시 인증 정보 동기화 (LocalStorage + Cookie)
  onMount(async () => {
    // 1. 기존 LocalStorage 복원
    authStore.loadFromStorage();

    // 2. Server-side Cookie 확인 및 동기화 (SSO/Login Page 연동)
    if (typeof document !== 'undefined') {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
      };

      const authCookie = getCookie('Authorization');
      if (authCookie) {
        try {
          // URL Decode 및 Bearer 제거
          const decodedValue = decodeURIComponent(authCookie);
          const token = decodedValue.startsWith('Bearer ')
            ? decodedValue.substring(7)
            : decodedValue;

          // 토큰이 있고, 현재 스토어와 다르다면 갱신
          if (token && token !== authStore.token) {
            console.log('[Auth] Syncing from cookie...');
            const user = await getCurrentUser(token);
            authStore.setAuth(user, token);
            console.log('[Auth] Synced successfully:', user.username);
          }
        } catch (e) {
          console.error('[Auth] Failed to sync auth from cookie', e);
        }
      }
    }
  });

  // Navigation Guard
  $effect(() => {
    const publicPaths = ['/login', '/sso/login'];
    const path = page.url.pathname;

    // 공개 경로가 아닌 경우 인증 체크
    if (!publicPaths.some((p) => path.startsWith(p))) {
      // 인증되지 않았거나 토큰이 만료된 경우
      if (!authStore.isAuthenticated) {
        console.warn('[Auth] Unauthorized access to protected route. Redirecting to login.');
        // 현재 경로를 redirect_uri로 전달 (선택 사항)
        goto(`/login?redirect_uri=${encodeURIComponent(path)}`);
      }
    }
  });
</script>

<Sidebar.Provider>
  <AppSidebar />
  <Sidebar.Inset>
    <header
      class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
    >
      <div class="flex items-center gap-2 px-4">
        <Sidebar.Trigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb.Root>
          <Breadcrumb.List>
            {#if currentRoute.isHome}
              <Breadcrumb.Item>
                <Breadcrumb.Page>Home</Breadcrumb.Page>
              </Breadcrumb.Item>
            {:else}
              <Breadcrumb.Item class="hidden md:block">
                <Breadcrumb.Link href={'/'}>Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator class="hidden md:block" />
              <Breadcrumb.Item>
                <Breadcrumb.Page>{currentRoute.label}</Breadcrumb.Page>
              </Breadcrumb.Item>
            {/if}
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </div>
    </header>
    <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
      {@render children()}
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>
