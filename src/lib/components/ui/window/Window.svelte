<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { WindowProps } from './types';
	import WindowTitlebar from './WindowTitlebar.svelte';
	import { windowStack } from './windowStack';
	import './window.scss';

	let {
		open = $bindable(false),
		title = '',
		variant = 'default',
		modal = true, // true: 모달 (블러 + 오버레이), false: non-modal (투명 오버레이)
		closeOnOverlay = true,
		closeOnEscape = true,
		width = '600px',
		height = 'auto',
		maxWidth = '90vw',
		maxHeight = '90vh',
		onClose,
		children
	}: WindowProps & { children?: any } = $props();

	let overlayElement: HTMLDivElement | null = $state(null);
	let windowElement: HTMLDivElement | null = $state(null);
	let isAnimating = $state(false);
	let isVisible = $state(false);
	let isMaximized = $state(false);
	let previousBodyOverflow = '';

	// 윈도우 고유 ID 생성
	const windowId = `window-${Math.random().toString(36).substr(2, 9)}`;

	// Drag state
	let isDragging = $state(false);
	let dragOffset = $state({ x: 0, y: 0 });
	let windowPosition = $state({ x: 0, y: 0 });

	// Resize state
	let isResizing = $state(false);
	let resizeDirection = $state<string>('');
	let resizeStartPos = $state({ x: 0, y: 0 });
	let resizeStartSize = $state({ width: 0, height: 0 });
	let windowSize = $state({ width: 600, height: 400 }); // 초기 크기
	const minWidth = 300;
	const minHeight = 200;

	// 애니메이션 상태
	let overlayClass = $derived.by(() => {
		const animationClass = open
			? isAnimating
				? 'window-overlay-enter'
				: ''
			: isAnimating
				? 'window-overlay-exit'
				: '';
		const modalClass = !modal ? 'non-modal' : '';
		return `${animationClass} ${modalClass}`.trim();
	});

	let windowClass = $derived(
		open ? (isAnimating ? 'window-enter' : '') : isAnimating ? 'window-exit' : ''
	);

	// ESC 키 핸들러
	function handleKeydown(event: KeyboardEvent) {
		if (closeOnEscape && event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation(); // 부모 윈도우로 이벤트 전파 방지
			handleClose();
		}
	}

	// Overlay 클릭 핸들러
	function handleOverlayClick(event: MouseEvent) {
		if (closeOnOverlay && event.target === overlayElement) {
			handleClose();
		}
	}

	// 닫기 핸들러
	function handleClose() {
		open = false;
		onClose?.();
	}

	// 최대화 핸들러
	function handleMaximize() {
		isMaximized = !isMaximized;
		// Reset position when maximizing
		if (isMaximized) {
			windowPosition = { x: 0, y: 0 };
		}
	}

	// Drag handlers
	function handleDragStart(e: MouseEvent) {
		if (isMaximized) return; // Disable dragging when maximized

		isDragging = true;
		dragOffset = {
			x: e.clientX - windowPosition.x,
			y: e.clientY - windowPosition.y
		};
	}

	function handleDragMove(e: MouseEvent) {
		if (!isDragging || !windowElement) return;

		const newX = e.clientX - dragOffset.x;
		const newY = e.clientY - dragOffset.y;

		// 윈도우의 현재 위치를 계산 (뷰포트 기준)
		const rect = windowElement.getBoundingClientRect();
		const currentTop = rect.top;

		// 새로운 Y 위치로 이동했을 때의 top 값 계산
		const potentialTop = currentTop + (newY - windowPosition.y);

		// 뷰포트 상단(0)을 넘지 않도록 제한
		const minY = potentialTop < 0 ? windowPosition.y - currentTop : newY;

		windowPosition = {
			x: newX,
			y: minY
		};
	}

	function handleDragEnd() {
		isDragging = false;
	}

	// Resize handlers
	function handleResizeStart(e: MouseEvent, direction: string) {
		if (isMaximized) return; // Disable resizing when maximized

		e.preventDefault();
		e.stopPropagation();

		isResizing = true;
		resizeDirection = direction;
		resizeStartPos = { x: e.clientX, y: e.clientY };
		resizeStartSize = { width: windowSize.width, height: windowSize.height };
	}

	function handleResizeMove(e: MouseEvent) {
		if (!isResizing || !windowElement) return;

		const deltaX = e.clientX - resizeStartPos.x;
		const deltaY = e.clientY - resizeStartPos.y;

		let newWidth = resizeStartSize.width;
		let newHeight = resizeStartSize.height;
		let newX = windowPosition.x;
		let newY = windowPosition.y;

		// 방향에 따라 크기 및 위치 조정
		if (resizeDirection.includes('e')) {
			newWidth = Math.max(minWidth, resizeStartSize.width + deltaX);
		}
		if (resizeDirection.includes('w')) {
			const potentialWidth = Math.max(minWidth, resizeStartSize.width - deltaX);
			const widthDiff = resizeStartSize.width - potentialWidth;
			newWidth = potentialWidth;
			newX = windowPosition.x + widthDiff;
		}
		if (resizeDirection.includes('s')) {
			newHeight = Math.max(minHeight, resizeStartSize.height + deltaY);
		}
		if (resizeDirection.includes('n')) {
			const potentialHeight = Math.max(minHeight, resizeStartSize.height - deltaY);
			const heightDiff = resizeStartSize.height - potentialHeight;
			newHeight = potentialHeight;
			newY = windowPosition.y + heightDiff;
		}

		windowSize = { width: newWidth, height: newHeight };
		windowPosition = { x: newX, y: newY };
	}

	function handleResizeEnd() {
		isResizing = false;
		resizeDirection = '';
	}

	// Body scroll lock
	function lockBodyScroll() {
		if (typeof document !== 'undefined') {
			previousBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
		}
	}

	function unlockBodyScroll() {
		if (typeof document !== 'undefined') {
			document.body.style.overflow = previousBodyOverflow;
		}
	}

	// Focus trap
	function trapFocus(element: HTMLElement) {
		const focusableElements = element.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);
		const firstFocusable = focusableElements[0];
		const lastFocusable = focusableElements[focusableElements.length - 1];

		function handleTabKey(e: KeyboardEvent) {
			if (e.key !== 'Tab') return;

			if (e.shiftKey) {
				if (document.activeElement === firstFocusable) {
					e.preventDefault();
					lastFocusable?.focus();
				}
			} else {
				if (document.activeElement === lastFocusable) {
					e.preventDefault();
					firstFocusable?.focus();
				}
			}
		}

		element.addEventListener('keydown', handleTabKey);
		firstFocusable?.focus();

		return () => {
			element.removeEventListener('keydown', handleTabKey);
		};
	}

	// open 상태 변경 감지
	$effect(() => {
		if (open) {
			// 위치 초기화 (항상 중앙에서 시작)
			windowPosition = { x: 0, y: 0 };

			// fullscreen variant는 자동으로 최대화
			if (variant === 'fullscreen') {
				isMaximized = true;
			}

			isVisible = true;
			isAnimating = true;
			lockBodyScroll();

			// 애니메이션 완료 후
			const timer = setTimeout(() => {
				isAnimating = false;

				// 윈도우 스택에 등록
				windowStack.register(windowId, overlayElement);

				if (windowElement) {
					const cleanup = trapFocus(windowElement);
					return cleanup;
				}
			}, 200);

			return () => clearTimeout(timer);
		} else if (isVisible) {
			// 윈도우 스택에서 제거 (자동으로 다른 윈도우로 포커스 이동)
			windowStack.unregister(windowId);

			// 닫기 애니메이션 시작
			isAnimating = true;

			// 애니메이션 완료 후 DOM에서 제거
			const timer = setTimeout(() => {
				isVisible = false;
				isAnimating = false;
				unlockBodyScroll();
				// 최대화 상태 리셋 (다음에 열 때 올바르게 동작하도록)
				isMaximized = false;
				// 위치 초기화는 다음에 열 때 수행 (닫기 애니메이션이 드래그한 위치에서 실행되도록)
			}, 200);

			return () => clearTimeout(timer);
		}
	});

	// 키보드 이벤트 리스너
	onMount(() => {
		if (typeof window !== 'undefined') {
			// keydown은 overlay 요소에서 처리 (중첩 윈도우 지원)
			window.addEventListener('mousemove', handleDragMove);
			window.addEventListener('mouseup', handleDragEnd);
			window.addEventListener('mousemove', handleResizeMove);
			window.addEventListener('mouseup', handleResizeEnd);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			// keydown은 overlay 요소에서 처리 (중첩 윈도우 지원)
			window.removeEventListener('mousemove', handleDragMove);
			window.removeEventListener('mouseup', handleDragEnd);
			window.removeEventListener('mousemove', handleResizeMove);
			window.removeEventListener('mouseup', handleResizeEnd);
		}
		unlockBodyScroll();
	});

	// 스타일 계산
	let windowStyle = $derived(() => {
		const baseStyle =
			isMaximized || variant === 'fullscreen'
				? 'width: 100%; height: 100%;'
				: `width: ${windowSize.width}px; height: ${windowSize.height}px; max-width: ${maxWidth}; max-height: ${maxHeight};`;

		const transformStyle = !isMaximized
			? `transform: translate(${windowPosition.x}px, ${windowPosition.y}px);`
			: '';

		return `${baseStyle} ${transformStyle}`;
	});
</script>

{#if isVisible}
	<div
		bind:this={overlayElement}
		class="window-overlay {overlayClass}"
		onclick={handleOverlayClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'window-title' : undefined}
		tabindex="-1"
	>
		<div
			bind:this={windowElement}
			class="window-container {windowClass} variant-{variant}"
			class:variant-fullscreen={isMaximized}
			style={windowStyle()}
		>
			<WindowTitlebar
				{title}
				{isMaximized}
				onClose={handleClose}
				onMaximize={handleMaximize}
				onDragStart={handleDragStart}
			/>
			<div class="window-content">
				{@render children?.()}
			</div>

			{#if !isMaximized}
				<!-- Resize handles -->
				<div
					class="resize-handle resize-n"
					role="presentation"
					aria-hidden="true"
					onmousedown={(e) => handleResizeStart(e, 'n')}
				></div>
				<div
					class="resize-handle resize-s"
					role="presentation"
					aria-hidden="true"
					onmousedown={(e) => handleResizeStart(e, 's')}
				></div>
				<div
					class="resize-handle resize-e"
					role="presentation"
					aria-hidden="true"
					onmousedown={(e) => handleResizeStart(e, 'e')}
				></div>
				<div
					class="resize-handle resize-w"
					role="presentation"
					aria-hidden="true"
					onmousedown={(e) => handleResizeStart(e, 'w')}
				></div>
				<div
					class="resize-handle resize-ne"
					role="presentation"
					aria-hidden="true"
					onmousedown={(e) => handleResizeStart(e, 'ne')}
				></div>
				<div
					class="resize-handle resize-nw"
					role="presentation"
					aria-hidden="true"
					onmousedown={(e) => handleResizeStart(e, 'nw')}
				></div>
				<div
					class="resize-handle resize-se"
					role="presentation"
					aria-hidden="true"
					onmousedown={(e) => handleResizeStart(e, 'se')}
				></div>
				<div
					class="resize-handle resize-sw"
					role="presentation"
					aria-hidden="true"
					onmousedown={(e) => handleResizeStart(e, 'sw')}
				></div>
			{/if}
		</div>
	</div>
{/if}
