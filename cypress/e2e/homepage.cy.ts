describe('홈페이지 E2E 테스트 (Cypress)', () => {
  beforeEach(() => {
    // 각 테스트 전에 홈페이지 방문
    cy.visit('/');
  });

  it('홈페이지가 정상적으로 로드되어야 함', () => {
    // 페이지 타이틀 확인
    cy.title().should('not.be.empty');

    // 메인 컨테이너가 존재하는지 확인
    cy.get('main, .main, #main').should('exist');

    // 페이지가 완전히 로드될 때까지 대기
    cy.waitForPageLoad();
  });

  it('네비게이션 링크들이 정상적으로 작동해야 함', () => {
    // 네비게이션 링크들 찾기
    cy.get('nav a, .navbar a, .navigation a').should('have.length.greaterThan', 0);

    // 첫 번째 링크 클릭 테스트
    cy.get('nav a, .navbar a, .navigation a')
      .first()
      .then(($link) => {
        const href = $link.attr('href');
        if (href && !href.startsWith('#')) {
          cy.wrap($link).click();
          cy.url().should('not.eq', Cypress.config().baseUrl + '/');
        }
      });
  });

  it('검색 기능이 정상적으로 작동해야 함', () => {
    // 검색 입력창 찾기
    cy.get('input[type="search"], input[placeholder*="검색"], input[placeholder*="search"]')
      .should('exist')
      .type('서울')
      .should('have.value', '서울');
  });

  it('이미지들이 정상적으로 로드되어야 함', () => {
    // 페이지의 모든 이미지가 로드되는지 확인
    cy.get('img').should('be.visible');

    // 이미지 로딩 에러가 없는지 확인
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'src');
    });
  });

  it('반응형 디자인이 정상적으로 작동해야 함', () => {
    // 데스크톱 뷰
    cy.viewport(1920, 1080);
    cy.get('body').should('be.visible');

    // 태블릿 뷰
    cy.viewport(768, 1024);
    cy.get('body').should('be.visible');

    // 모바일 뷰
    cy.viewport(375, 667);
    cy.get('body').should('be.visible');
  });

  it('성능 메트릭이 기준을 만족해야 함', () => {
    // 성능 측정
    cy.measurePerformance().then((metrics) => {
      // First Contentful Paint가 2초 이내
      expect(metrics.fcp).to.be.lessThan(2000);

      // Largest Contentful Paint가 4초 이내
      expect(metrics.lcp).to.be.lessThan(4000);
    });
  });
});
