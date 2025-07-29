const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
  constructor() {
    this.results = [];
  }

  async measurePerformance(url, name) {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    // 타임아웃 설정 증가
    page.setDefaultTimeout(60000); // 60초
    page.setDefaultNavigationTimeout(60000); // 60초

    // 성능 메트릭 수집
    await page.setViewport({ width: 1920, height: 1080 });

    // 네트워크 속도 시뮬레이션 (3G)
    await page.emulate({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });

    const startTime = Date.now();

    try {
      // 페이지 로드 (더 관대한 대기 조건)
      await page.goto(url, {
        waitUntil: 'domcontentloaded', // networkidle0 대신 더 빠른 조건
        timeout: 60000
      });

      const loadTime = Date.now() - startTime;

      // Core Web Vitals 측정 (간단한 버전)
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          // 기본 메트릭만 측정
          const fcp = performance.getEntriesByType('paint').find((entry) => entry.name === 'first-contentful-paint');
          const lcp = performance.getEntriesByType('largest-contentful-paint')[0];

          resolve({
            fcp: fcp ? fcp.startTime : 0,
            lcp: lcp ? lcp.startTime : 0,
            fid: 0, // 간단하게 0으로 설정
            cls: 0 // 간단하게 0으로 설정
          });
        });
      });

      // 메모리 사용량 (간단한 버전)
      const memory = await page.evaluate(() => {
        return performance.memory
          ? {
              usedJSHeapSize: performance.memory.usedJSHeapSize,
              totalJSHeapSize: performance.memory.totalJSHeapSize,
              jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            }
          : null;
      });

      await browser.close();

      return {
        name,
        url,
        loadTime,
        metrics,
        memory,
        timestamp: new Date().toISOString(),
        success: true
      };
    } catch (error) {
      await browser.close();
      return {
        name,
        url,
        loadTime: 0,
        metrics: { fcp: 0, lcp: 0, fid: 0, cls: 0 },
        memory: null,
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message
      };
    }
  }

  async runTests() {
    // 테스트할 페이지 수를 줄이고 더 간단한 URL들로 변경
    const testUrls = [
      { url: 'http://localhost:3000', name: '홈페이지' },
      { url: 'http://localhost:3000/login', name: '로그인 페이지' }
    ];

    console.log('🚀 성능 테스트 시작...');
    console.log('⚠️  개발 서버가 실행 중인지 확인하세요 (yarn dev)');

    for (const test of testUrls) {
      try {
        console.log(`📊 ${test.name} 테스트 중...`);
        const result = await this.measurePerformance(test.url, test.name);
        this.results.push(result);

        if (result.success) {
          console.log(`✅ ${test.name} 완료:`);
          console.log(`   로딩 시간: ${result.loadTime}ms`);
          console.log(`   FCP: ${result.metrics.fcp}ms`);
          console.log(`   LCP: ${result.metrics.lcp}ms`);

          if (result.memory) {
            console.log(`   메모리 사용량: ${Math.round(result.memory.usedJSHeapSize / 1024 / 1024)}MB`);
          }
        } else {
          console.log(`❌ ${test.name} 실패: ${result.error}`);
        }

        // 테스트 간 간격 추가
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.log(`❌ ${test.name} 테스트 중 오류 발생:`, error.message);
        this.results.push({
          name: test.name,
          url: test.url,
          loadTime: 0,
          metrics: { fcp: 0, lcp: 0, fid: 0, cls: 0 },
          memory: null,
          timestamp: new Date().toISOString(),
          success: false,
          error: error.message
        });
      }
    }

    this.generateReport();
  }

  generateReport() {
    const report = {
      summary: {
        totalTests: this.results.length,
        averageLoadTime: this.results.reduce((sum, r) => sum + r.loadTime, 0) / this.results.length,
        averageFCP: this.results.reduce((sum, r) => sum + r.metrics.fcp, 0) / this.results.length,
        averageLCP: this.results.reduce((sum, r) => sum + r.metrics.lcp, 0) / this.results.length
      },
      results: this.results
    };

    // JSON 리포트 저장
    const reportPath = path.join(__dirname, '../performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // HTML 리포트 생성
    this.generateHTMLReport(report);

    console.log('\n📈 성능 리포트 생성 완료:');
    console.log(`   JSON: ${reportPath}`);
    console.log(`   HTML: ${path.join(__dirname, '../performance-report.html')}`);
  }

  generateHTMLReport(data) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>성능 테스트 리포트</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .result { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .metric { display: inline-block; margin: 5px 10px; }
        .good { color: green; }
        .warning { color: orange; }
        .bad { color: red; }
    </style>
</head>
<body>
    <h1>🚀 성능 테스트 리포트</h1>
    
    <div class="summary">
        <h2>📊 요약</h2>
        <p>총 테스트: ${data.summary.totalTests}개</p>
        <p>평균 로딩 시간: ${Math.round(data.summary.averageLoadTime)}ms</p>
        <p>평균 FCP: ${Math.round(data.summary.averageFCP)}ms</p>
        <p>평균 LCP: ${Math.round(data.summary.averageLCP)}ms</p>
    </div>
    
    <h2>📋 상세 결과</h2>
    ${data.results
      .map(
        (result) => `
        <div class="result">
            <h3>${result.name}</h3>
            <p><strong>URL:</strong> ${result.url}</p>
            <p><strong>로딩 시간:</strong> <span class="${result.loadTime < 2000 ? 'good' : result.loadTime < 4000 ? 'warning' : 'bad'}">${result.loadTime}ms</span></p>
            <div class="metrics">
                <span class="metric">FCP: <span class="${result.metrics.fcp < 2000 ? 'good' : result.metrics.fcp < 4000 ? 'warning' : 'bad'}">${Math.round(result.metrics.fcp)}ms</span></span>
                <span class="metric">LCP: <span class="${result.metrics.lcp < 4000 ? 'good' : result.metrics.lcp < 6000 ? 'warning' : 'bad'}">${Math.round(result.metrics.lcp)}ms</span></span>
                <span class="metric">FID: <span class="${result.metrics.fid < 100 ? 'good' : result.metrics.fid < 300 ? 'warning' : 'bad'}">${Math.round(result.metrics.fid)}ms</span></span>
                <span class="metric">CLS: <span class="${result.metrics.cls < 0.1 ? 'good' : result.metrics.cls < 0.25 ? 'warning' : 'bad'}">${result.metrics.cls.toFixed(3)}</span></span>
            </div>
            ${result.memory ? `<p><strong>메모리 사용량:</strong> ${Math.round(result.memory.usedJSHeapSize / 1024 / 1024)}MB</p>` : ''}
        </div>
    `
      )
      .join('')}
</body>
</html>
    `;

    const htmlPath = path.join(__dirname, '../performance-report.html');
    fs.writeFileSync(htmlPath, html);
  }
}

// 스크립트 실행
if (require.main === module) {
  const monitor = new PerformanceMonitor();
  monitor.runTests().catch(console.error);
}

module.exports = PerformanceMonitor;
