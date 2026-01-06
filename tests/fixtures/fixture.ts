import { test as base, expect, Page, TestInfo } from '@playwright/test';
// @ts-ignore TS2306: imported file is not a module (legacy/commonjs). Silence until modules are fixed.
import { IconGeneratorPage } from '../pages/IconGeneratorPage';
// @ts-ignore TS2306: imported file is not a module (legacy/commonjs). Silence until modules are fixed.
import { IconGeneratorAssertions, TestLogger, DebugHelper } from '../utils/TestHelpers';

/**
 * Custom test fixture extending Playwright's test
 */
type TestFixtures = {
  iconGeneratorPage: IconGeneratorPage;
  testLogger: TestLogger;
  debugHelper: DebugHelper;
  assertions: IconGeneratorAssertions;
};

export const test = base.extend<TestFixtures>({
  iconGeneratorPage: async ({ page }: { page: Page }, use: (value: IconGeneratorPage) => Promise<void>) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await use(iconGeneratorPage);
  },

  testLogger: async ({ test: testInfo }: { test: TestInfo }, use: (value: TestLogger) => Promise<void>) => {
    const testName = testInfo.title;
    const logger = new TestLogger(testName);
    await use(logger);
  },

  debugHelper: async ({ page, test: testInfo }: { page: Page; test: TestInfo }, use: (value: DebugHelper) => Promise<void>) => {
    const debugHelper = new DebugHelper(page, testInfo.title);
    await use(debugHelper);
  },

  assertions: async ({ page }: { page: Page }, use: (value: IconGeneratorAssertions) => Promise<void>) => {
    const assertions = new IconGeneratorAssertions(page);
    await use(assertions);
  },
});

export { expect };