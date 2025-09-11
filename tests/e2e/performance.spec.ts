import { test, expect } from '@playwright/test';

test.describe('성능 테스트', () => {
  test('메인페이지 로딩 성능', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // 페이지 로딩 시간이 3초 이내여야 함
    expect(loadTime).toBeLessThan(3000);

    // Core Web Vitals 측정
    const metrics = await page.evaluate(() => {
      return new Promise<{
        fcp: number;
        lcp: number;
        fid: number;
        cls: number;
      }>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcp = entries.find((entry) => entry.name === 'first-contentful-paint');
          const lcp = entries.find((entry) => entry.name === 'largest-contentful-paint');
          const fid = entries.find((entry) => entry.name === 'first-input-delay');
          const cls = entries.find((entry) => entry.name === 'cumulative-layout-shift');

          resolve({
            fcp: fcp ? fcp.startTime : 0,
            lcp: lcp ? lcp.startTime : 0,
            fid: fid ? (fid as any).processingStart - (fid as any).startTime : 0,
            cls: cls ? (cls as any).value : 0
          });
        }).observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
      });
    });

    // Core Web Vitals 기준
    expect(metrics.fcp).toBeLessThan(2000); // First Contentful Paint
    expect(metrics.lcp).toBeLessThan(4000); // Largest Contentful Paint
    expect(metrics.fid).toBeLessThan(100); // First Input Delay
    expect(metrics.cls).toBeLessThan(0.1); // Cumulative Layout Shift
  });

  test('채팅페이지 성능 테스트', async ({ page }) => {
    await page.goto('/');

    // 채팅 버튼 찾기 (ChatBot 대신 일반 채팅 기능)
    const chatButton = page.locator('button').filter({ hasText: '채팅' }).first();

    if ((await chatButton.count()) > 0) {
      // 채팅 열기 성능 측정
      const openStartTime = performance.now();
      await chatButton.click();
      await page.waitForSelector('.chat-container, .message-container', { timeout: 5000 });
      const openTime = performance.now() - openStartTime;

      // 채팅 열기 시간이 500ms 이내여야 함
      expect(openTime).toBeLessThan(500);
    }
  });

  test('이미지 로딩 성능', async ({ page }) => {
    await page.goto('/');

    // 이미지 로딩 성능 측정
    const imageLoadTimes = await page.evaluate(() => {
      return new Promise<number[]>((resolve) => {
        const images = document.querySelectorAll('img');
        const loadTimes: number[] = [];

        if (images.length === 0) {
          resolve([]);
          return;
        }

        images.forEach((img) => {
          const startTime = performance.now();
          img.addEventListener('load', () => {
            const loadTime = performance.now() - startTime;
            loadTimes.push(loadTime);

            if (loadTimes.length === images.length) {
              resolve(loadTimes);
            }
          });

          // 이미 로드된 이미지 처리
          if (img.complete) {
            const loadTime = performance.now() - startTime;
            loadTimes.push(loadTime);

            if (loadTimes.length === images.length) {
              resolve(loadTimes);
            }
          }
        });
      });
    });

    // 모든 이미지가 2초 이내에 로드되어야 함
    imageLoadTimes.forEach((loadTime) => {
      expect(loadTime).toBeLessThan(2000);
    });
  });

  test('메모리 사용량 테스트', async ({ page }) => {
    await page.goto('/');

    // 초기 메모리 사용량
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // 여러 페이지 이동
    for (let i = 0; i < 10; i++) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    }

    // 최종 메모리 사용량
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    const memoryIncrease = finalMemory - initialMemory;

    // 메모리 증가량이 50MB 이내여야 함
    if (memoryIncrease > 0) {
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB
    }
  });

  test('반응형 성능 테스트', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 }, // Tablet
      { width: 375, height: 667 } // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');

      const startTime = performance.now();
      await page.waitForLoadState('networkidle');
      const loadTime = performance.now() - startTime;

      // 각 뷰포트에서 로딩 시간이 3초 이내여야 함
      expect(loadTime).toBeLessThan(3000);
    }
  });

  test('검색 기능 성능 테스트', async ({ page }) => {
    await page.goto('/');

    // 검색 입력창 찾기
    const searchInput = page
      .locator('input[type="search"], input[placeholder*="검색"], input[placeholder*="search"]')
      .first();

    if ((await searchInput.count()) > 0) {
      const searchStartTime = performance.now();
      await searchInput.fill('서울');
      const searchTime = performance.now() - searchStartTime;

      // 검색 입력 응답 시간이 100ms 이내여야 함
      expect(searchTime).toBeLessThan(100);
    }
  });

  test('네비게이션 성능 테스트', async ({ page }) => {
    await page.goto('/');

    // 네비게이션 링크들 찾기
    const navLinks = page.locator('nav a, .navbar a, .navigation a');

    if ((await navLinks.count()) > 0) {
      for (let i = 0; i < Math.min(3, await navLinks.count()); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute('href');

        if (href && !href.startsWith('#')) {
          const navStartTime = performance.now();
          await link.click();
          await page.waitForLoadState('networkidle');
          const navTime = performance.now() - navStartTime;

          // 네비게이션 시간이 2초 이내여야 함
          expect(navTime).toBeLessThan(2000);

          // 홈으로 돌아가기
          await page.goto('/');
        }
      }
    }
  });
});
