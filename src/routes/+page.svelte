<script lang="ts">
  import { base } from '$app/paths';
  import { Button } from '$lib/components/ui/button';
  import { Card } from '$lib/components/ui/card';
  import {
    Calendar,
    CheckCircle2,
    Users,
    TrendingUp,
    Zap,
    Shield,
    ArrowRight,
    Cpu,
    BarChart3
  } from '@lucide/svelte';

  const features = [
    {
      icon: Calendar,
      title: 'Scheduling',
      description: '실시간 MPW 셔틀 일정 확인 및 예약',
      color: 'text-blue-500'
    },
    {
      icon: CheckCircle2,
      title: 'Design Validation',
      description: '자동화된 Rule Check 및 설계 자산 보호',
      color: 'text-green-500'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: '부서간 실시간 데이터 공유 및 히스토리 관리',
      color: 'text-purple-500'
    }
  ];

  const stats = [
    { label: '진행 중인 셔틀', value: '12', icon: Cpu },
    { label: '참여 프로젝트', value: '48', icon: BarChart3 },
    { label: '비용 절감률', value: '65%', icon: TrendingUp }
  ];

  const values = [
    {
      icon: TrendingUp,
      title: 'Cost Efficiency',
      description: '비용 절감'
    },
    {
      icon: Zap,
      title: 'Rapid Prototyping',
      description: '빠른 프로토타이핑'
    },
    {
      icon: Shield,
      title: 'Resource Optimization',
      description: '자원 최적화'
    }
  ];

  // 시작하기 버튼 클릭 핸들러
  function handleGetStarted() {
    // 현재 페이지를 새로고침하여 메인 앱으로 진입
    window.location.href = `${base}/references`;
  }
</script>

<svelte:head>
  <title>MPW - Multi-Project Wafer Platform</title>
  <meta name="description" content="Next-Gen MPW Management System" />
</svelte:head>

<div
  class="landing-page min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden fixed inset-0"
>
  <!-- Circuit Pattern Background -->
  <div class="circuit-pattern absolute inset-0 opacity-10"></div>

  <div class="relative h-full overflow-y-auto">
    <!-- Hero Section -->
    <section class="hero-section relative min-h-screen flex items-center justify-center px-4 py-20">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center space-y-8 animate-fade-in">
          <!-- Main Title -->
          <div class="space-y-4">
            <div class="inline-block">
              <div
                class="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm text-blue-300 backdrop-blur-sm mb-6"
              >
                <Cpu class="w-4 h-4" />
                <span>Next-Generation Platform</span>
              </div>
            </div>

            <h1
              class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent leading-tight"
            >
              MPW Management<br />System
            </h1>

            <p class="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              여러 프로젝트를 하나의 웨이퍼에 담아,<br />
              <span class="text-blue-400 font-semibold">설계 비용은 낮추고</span>
              <span class="text-cyan-400 font-semibold">공정 효율은 극대화</span>하십시오
            </p>
          </div>

          <!-- CTA Button -->
          <div class="pt-8">
            <Button
              size="lg"
              onclick={handleGetStarted}
              class="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 hover:scale-105 group"
            >
              시작하기
              <ArrowRight class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <!-- Core Values -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto">
            {#each values as value}
              <div
                class="flex flex-col items-center gap-3 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div class="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg">
                  <svelte:component this={value.icon} class="w-6 h-6 text-cyan-400" />
                </div>
                <div class="text-center">
                  <h3 class="font-semibold text-white mb-1">{value.title}</h3>
                  <p class="text-sm text-slate-400">{value.description}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div
          class="w-6 h-10 border-2 border-blue-400/50 rounded-full flex items-start justify-center p-2"
        >
          <div class="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section relative py-24 px-4">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-16">
          <h2
            class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Key Features
          </h2>
          <p class="text-slate-400 text-lg">핵심 기능으로 업무 효율을 극대화하세요</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {#each features as feature}
            <Card
              class="bg-white/5 backdrop-blur-sm border-white/10 p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 group"
            >
              <div class="space-y-4">
                <div
                  class="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl w-fit group-hover:scale-110 transition-transform"
                >
                  <svelte:component this={feature.icon} class="w-8 h-8 {feature.color}" />
                </div>
                <h3 class="text-2xl font-bold text-white">{feature.title}</h3>
                <p class="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          {/each}
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section
      class="stats-section relative py-24 px-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 backdrop-blur-sm"
    >
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-16">
          <h2
            class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
          >
            실시간 현황
          </h2>
          <p class="text-slate-400 text-lg">현재 플랫폼 운영 상태를 한눈에 확인하세요</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {#each stats as stat}
            <div
              class="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-8 text-center hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30"
            >
              <div class="flex justify-center mb-4">
                <div class="p-4 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl">
                  <svelte:component this={stat.icon} class="w-10 h-10 text-cyan-400" />
                </div>
              </div>
              <div
                class="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2"
              >
                {stat.value}
              </div>
              <div class="text-slate-300 text-lg">{stat.label}</div>
            </div>
          {/each}
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative py-12 px-4 border-t border-white/10">
      <div class="container mx-auto max-w-6xl text-center">
        <p class="text-slate-400">© 2026 MPW Platform. All rights reserved.</p>
      </div>
    </footer>
  </div>
</div>

<style>
  .landing-page {
    position: relative;
  }

  .circuit-pattern {
    background-image:
      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 1s ease-out;
  }

  /* Glassmorphism effects */
  :global(.landing-page .bg-white\/5) {
    background: rgba(255, 255, 255, 0.05);
  }

  :global(.landing-page .backdrop-blur-sm) {
    backdrop-filter: blur(12px);
  }
</style>
