const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Next.js 앱의 경로를 제공하여 next.config.js와 .env 파일을 로드할 수 있도록 합니다
  dir: './'
});

// Jest에 전달할 사용자 정의 설정
const customJestConfig = {
  // 테스트 환경 설정
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // DOM 환경 제공
  testEnvironment: 'jest-environment-jsdom',
  // 모듈 경로 매핑
  moduleNameMapper: {
    // 절대 경로
    '^@/(.*)$': '<rootDir>/src/$1',
    // CSS 모킹
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // 이미지 모킹
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/tests/e2e/'],
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.{js,jsx,ts,tsx}'],
  // 커버리지 기준
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};

// createJestConfig는 비동기 함수이므로 async/await를 사용합니다
module.exports = createJestConfig(customJestConfig);
