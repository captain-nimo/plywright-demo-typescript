import { test as base, expect, Page } from '@playwright/test';
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

  testLogger: async ({ testInfo }: any, use: (value: TestLogger) => Promise<void>) => {
    const testName = testInfo.titlePath.join(' > ');
    const logger = new TestLogger(testName);
    await use(logger);
  },

  debugHelper: async ({ page, testInfo }: any, use: (value: DebugHelper) => Promise<void>) => {
    const testName = testInfo.titlePath.join(' > ');
    const debugHelper = new DebugHelper(page, testName);
    await use(debugHelper);
  },

  assertions: async ({ page }: { page: Page }, use: (value: IconGeneratorAssertions) => Promise<void>) => {
    const assertions = new IconGeneratorAssertions(page);
    await use(assertions);
  },
});

export { expect };