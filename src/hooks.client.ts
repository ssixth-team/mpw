import { worker } from '$lib/../mocks/browser';

if (import.meta.env.DEV) {
  worker.start({
    onUnhandledRequest: 'bypass'
  });
}
