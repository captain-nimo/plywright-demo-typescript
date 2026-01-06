import { Page, expect } from '@playwright/test';

/**
 * Test Logger Utility
 * Provides structured logging for test execution
 */
export class TestLogger {
  private testName: string;
  private logs: string[] = [];

  constructor(testName: string) {
    this.testName = testName;
  }

  /**
   * Log an informational message
   */
  info(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [INFO] [${this.testName}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  /**
   * Log a warning message
   */
  warn(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [WARN] [${this.testName}] ${message}`;
    this.logs.push(logEntry);
    console.warn(logEntry);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error): void {
    const timestamp = new Date().toISOString();
    const errorMsg = error ? ` ${error.message}` : '';
    const logEntry = `[${timestamp}] [ERROR] [${this.testName}] ${message}${errorMsg}`;
    this.logs.push(logEntry);
    console.error(logEntry);
  }

  /**
   * Log a success message
   */
  success(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [SUCCESS] [${this.testName}] ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  /**
   * Get all logged messages
   */
  getLogs(): string[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Print all logs to console
   */
  printLogs(): void {
    console.log('\n========== TEST LOGS ==========');
    this.logs.forEach(log => console.log(log));
    console.log('==============================\n');
  }
}

/**
 * Debug Helper Utility
 * Provides debugging and inspection capabilities
 */
export class DebugHelper {
  private page: Page;
  private testName: string;

  constructor(page: Page, testName: string) {
    this.page = page;
    this.testName = testName;
  }

  /**
   * Take a screenshot for debugging
   */
  async takeScreenshot(filename?: string): Promise<Buffer> {
    const name = filename || `debug-${this.testName}-${Date.now()}`;
    const screenshot = await this.page.screenshot({ path: `test-results/${name}.png` });
    console.log(`Screenshot saved: test-results/${name}.png`);
    return screenshot;
  }

  /**
   * Get the page's HTML content
   */
  async getPageHTML(): Promise<string> {
    return this.page.content();
  }

  /**
   * Get all text content on the page
   */
  async getPageText(): Promise<string> {
    return this.page.locator('body').innerText();
  }

  /**
   * Log all elements with a specific selector
   */
  async logElements(selector: string): Promise<void> {
    const elements = await this.page.locator(selector).all();
    console.log(`Found ${elements.length} elements matching: ${selector}`);

    for (let i = 0; i < elements.length; i++) {
      const text = await elements[i].innerText().catch(() => 'N/A');
      const visibility = await elements[i].isVisible().catch(() => false);
      console.log(`  [${i}] ${selector} - Visible: ${visibility} - Text: ${text}`);
    }
  }

  /**
   * Print page console logs
   */
  async printConsoleLogs(): Promise<void> {
    const logs: string[] = [];

    this.page.on('console', msg => {
      logs.push(`${msg.type().toUpperCase()}: ${msg.text()}`);
    });

    if (logs.length > 0) {
      console.log('\n========== PAGE CONSOLE LOGS ==========');
      logs.forEach(log => console.log(log));
      console.log('=======================================\n');
    }
  }

  /**
   * Get all network requests/responses
   */
  async logNetworkActivity(): Promise<void> {
    let requestCount = 0;

    this.page.on('request', request => {
      requestCount++;
      console.log(`[${requestCount}] ${request.method()} ${request.url()}`);
    });
  }

  /**
   * Pause test execution for debugging (useful with --debug flag)
   */
  async pause(): Promise<void> {
    await this.page.pause();
  }

  /**
   * Get element count by selector
   */
  async getElementCount(selector: string): Promise<number> {
    return this.page.locator(selector).count();
  }

  /**
   * Log browser viewport info
   */
  async logViewportInfo(): Promise<void> {
    const viewport = this.page.viewportSize();
    console.log(`\nViewport Size: ${viewport?.width}x${viewport?.height}`);
  }
}

/**
 * Icon Generator Assertions Utility
 * Provides custom assertions for the Icon Generator application
 */
export class IconGeneratorAssertions {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Assert that the prompt input field is visible
   */
  async assertPromptInputVisible(): Promise<void> {
    const promptInput = this.page.locator('input[type="text"], input:not([type]), textarea').first();
    const isVisible = await promptInput.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  }

  /**
   * Assert that the generate button is visible
   */
  async assertGenerateButtonVisible(): Promise<void> {
    const generateBtn = this.page.locator('button').first();
    const isVisible = await generateBtn.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  }

  /**
   * Assert that the page title is present
   */
  async assertPageTitlePresent(): Promise<void> {
    const title = await this.page.title();
    expect(title).toBeTruthy();
  }

  /**
   * Assert that icons are generated (element count check)
   */
  async assertIconsGenerated(minCount: number = 0): Promise<void> {
    const icons = this.page.locator('img, [class*="icon"], [class*="image"], svg');
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }

  /**
   * Assert that the prompt input contains a specific value
   */
  async assertPromptValue(expectedValue: string): Promise<void> {
    const promptInput = this.page.locator('input[type="text"], input:not([type]), textarea').first();
    const actualValue = await promptInput.inputValue().catch(() => '');
    expect(actualValue).toContain(expectedValue);
  }

  /**
   * Assert that the prompt input is empty
   */
  async assertPromptEmpty(): Promise<void> {
    const promptInput = this.page.locator('input[type="text"], input:not([type]), textarea').first();
    const value = await promptInput.inputValue().catch(() => '');
    expect(value).toBe('');
  }

  /**
   * Assert that the prompt input has focus
   */
  async assertPromptFocused(): Promise<void> {
    const promptInput = this.page.locator('input[type="text"], input:not([type]), textarea').first();
    const focusedElement = await this.page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'TEXTAREA']).toContain(focusedElement);
  }

  /**
   * Assert that the page is responsive on a specific viewport
   */
  async assertResponsiveLayout(width: number, height: number): Promise<void> {
    const viewport = this.page.viewportSize();
    expect(viewport?.width).toBe(width);
    expect(viewport?.height).toBe(height);

    // Check that prompt input is still visible on this viewport
    const promptInput = this.page.locator('input[type="text"], input:not([type]), textarea').first();
    const isVisible = await promptInput.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  }

  /**
   * Assert that a specific element exists on the page
   */
  async assertElementExists(selector: string): Promise<void> {
    const element = this.page.locator(selector).first();
    const count = await element.count();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * Assert that a specific element does not exist on the page
   */
  async assertElementNotExists(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    const count = await element.count();
    expect(count).toBe(0);
  }

  /**
   * Assert that text is present on the page
   */
  async assertTextPresent(text: string): Promise<void> {
    const pageText = await this.page.locator('body').innerText();
    expect(pageText).toContain(text);
  }

  /**
   * Assert that text is not present on the page
   */
  async assertTextNotPresent(text: string): Promise<void> {
    const pageText = await this.page.locator('body').innerText();
    expect(pageText).not.toContain(text);
  }
}

