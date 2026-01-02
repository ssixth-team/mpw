import { writable } from 'svelte/store';

interface WindowInstance {
	id: string;
	overlayElement: HTMLElement | null;
}

function createWindowStack() {
	const { subscribe, update } = writable<WindowInstance[]>([]);

	return {
		subscribe,
		register: (id: string, overlayElement: HTMLElement | null) => {
			update((stack) => [...stack, { id, overlayElement }]);
		},
		unregister: (id: string) => {
			update((stack) => {
				const filtered = stack.filter((w) => w.id !== id);
				// 다른 윈도우가 있으면 가장 최근 윈도우로 포커스 이동
				if (filtered.length > 0) {
					const lastWindow = filtered[filtered.length - 1];
					if (lastWindow.overlayElement) {
						// 약간의 지연을 두고 포커스 이동 (DOM 업데이트 대기)
						setTimeout(() => {
							lastWindow.overlayElement?.focus();
						}, 50);
					}
				}
				return filtered;
			});
		},
		clear: () => update(() => [])
	};
}

export const windowStack = createWindowStack();
