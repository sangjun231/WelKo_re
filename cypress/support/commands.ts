// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// 기존 도구들과 독립적으로 작동하는 커스텀 명령어들

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * 안전한 로그인 커스텀 명령어
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * 페이지 로딩 대기 커스텀 명령어
       */
      waitForPageLoad(): Chainable<void>;

      /**
       * 성능 측정 커스텀 명령어
       */
      measurePerformance(): Chainable<{ fcp: number; lcp: number }>;
    }
  }
}

// 로그인 커스텀 명령어
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// 페이지 로딩 대기 커스텀 명령어
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().its('document').its('readyState').should('eq', 'complete');
});

// 성능 측정 커스텀 명령어
Cypress.Commands.add('measurePerformance', () => {
  return cy.window().then((win) => {
    return new Promise<{ fcp: number; lcp: number }>((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcp = entries.find((entry) => entry.name === 'first-contentful-paint');
        const lcp = entries.find((entry) => entry.name === 'largest-contentful-paint');

        resolve({
          fcp: fcp ? fcp.startTime : 0,
          lcp: lcp ? lcp.startTime : 0
        });
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    });
  });
});

export {};
