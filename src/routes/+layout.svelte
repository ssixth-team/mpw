<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import '../app.css';

	let { children } = $props();

	// 경로를 breadcrumb 항목으로 변환
	const getBreadcrumbs = $derived(() => {
		const pathname = page.url.pathname.replace(base, '') || '/';

		// 홈 페이지인 경우
		if (pathname === '/') {
			return [{ label: 'Home', href: base + '/', isLast: true }];
		}

		// 경로를 세그먼트로 분리
		const segments = pathname.split('/').filter(Boolean);

		// breadcrumb 항목 생성
		const breadcrumbs = [{ label: 'Home', href: base + '/', isLast: false }];

		segments.forEach((segment, index) => {
			const href = base + '/' + segments.slice(0, index + 1).join('/');
			const label = segment.charAt(0).toUpperCase() + segment.slice(1);
			const isLast = index === segments.length - 1;

			breadcrumbs.push({ label, href, isLast });
		});

		return breadcrumbs;
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
						{#each getBreadcrumbs() as crumb, index}
							{#if index > 0}
								<Breadcrumb.Separator class="hidden md:block" />
							{/if}
							<Breadcrumb.Item class={index === 0 ? 'hidden md:block' : ''}>
								{#if crumb.isLast}
									<Breadcrumb.Page>{crumb.label}</Breadcrumb.Page>
								{:else}
									<Breadcrumb.Link href={crumb.href}>{crumb.label}</Breadcrumb.Link>
								{/if}
							</Breadcrumb.Item>
						{/each}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
