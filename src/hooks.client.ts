import { worker } from './mocks/browser';
import { base } from '$app/paths';

// 프로덕션에서도 MSW 실행 (정적 사이트이므로 백엔드가 없음)
worker.start({
  serviceWorker: {
    url: `${base}/mockServiceWorker.js`
  },
  onUnhandledRequest: 'bypass'
});
