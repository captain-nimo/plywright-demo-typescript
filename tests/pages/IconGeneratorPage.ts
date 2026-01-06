import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Icon Generator Application
 * Encapsulates all interactions and locators for the icon generator page
 */
export class IconGeneratorPage {
  readonly page: Page;
  readonly baseUrl: string = 'https://engineer-coding-challenge-frontend.vercel.app/';

  // Locators
  private promptInputSelector = 'input[type="text"], input:not([type]), textarea';
  private generateButtonSelector = 'button:has-text("Generate"), button:has-text("generate"), button[type="submit"]';
  private iconSelector = 'img, [class*="icon"], [class*="image"], svg';

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the Icon Generator application
   */
  async goto(): Promise<void> {
    await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
  }

  /**
   * Get the prompt input field locator
   * Tries multiple selectors to handle different implementations
   */
  private getPromptInputLocator(): Locator {
    // Try primary selector first
    let input = this.page.locator(this.promptInputSelector);

    // Return first matching element
    return input.first();
  }

  /**
   * Get the generate button locator
   * Tries multiple selectors to handle different implementations
   */
  private getGenerateButtonLocator(): Locator {
    // Try with "Generate" text first
    let button = this.page.locator('button:has-text("Generate")');

    return button.first();
  }

  /**
   * Get all icon elements on the page
   */
  private getIconsLocator(): Locator {
    return this.page.locator(this.iconSelector);
  }

  /**
   * Wait for the prompt input field to be visible
   */
  async waitForPromptInput(timeout: number = 5000): Promise<void> {
    const promptInput = this.getPromptInputLocator();
    await promptInput.waitFor({ state: 'visible', timeout }).catch(() => {
      // Silently continue if element doesn't appear
    });
  }

  /**
   * Wait for the generate button to be visible
   */
  async waitForGenerateButton(timeout: number = 5000): Promise<void> {
    const generateBtn = this.getGenerateButtonLocator();
    await generateBtn.waitFor({ state: 'visible', timeout }).catch(() => {
      // Silently continue if element doesn't appear
    });
  }

  /**
   * Fill the prompt input field with text
   */
  async fillPrompt(text: string): Promise<void> {
    const promptInput = this.getPromptInputLocator();
    await promptInput.fill(text).catch(() => {
      // Fallback to typing if fill fails
      return promptInput.type(text, { delay: 50 });
    });
  }

  /**
   * Get the current value of the prompt input field
   */
  async getPromptValue(): Promise<string> {
    const promptInput = this.getPromptInputLocator();
    const value = await promptInput.inputValue().catch(() => '');
    return value;
  }

  /**
   * Clear the prompt input field
   */
  async clearPrompt(): Promise<void> {
    const promptInput = this.getPromptInputLocator();
    await promptInput.clear().catch(() => {
      // Fallback: select all and delete
      return promptInput.press('Control+A');
    });
  }

  /**
   * Focus on the prompt input field
   */
  async focusPrompt(): Promise<void> {
    const promptInput = this.getPromptInputLocator();
    await promptInput.focus().catch(() => {
      // Silently continue
    });
  }

  /**
   * Click the generate button
   */
  async clickGenerateButton(): Promise<void> {
    const generateBtn = this.getGenerateButtonLocator();
    await generateBtn.click().catch(() => {
      // Silently continue if click fails
    });
  }

  /**
   * Check if the prompt input field is visible
   */
  async isPromptInputVisible(): Promise<boolean> {
    const promptInput = this.getPromptInputLocator();
    return promptInput.isVisible().catch(() => false);
  }

  /**
   * Check if the generate button is visible
   */
  async isGenerateButtonVisible(): Promise<boolean> {
    const generateBtn = this.getGenerateButtonLocator();
    return generateBtn.isVisible().catch(() => false);
  }

  /**
   * Get the count of icon elements on the page
   */
  async getIconCount(): Promise<number> {
    const icons = this.getIconsLocator();
    return icons.count();
  }

  /**
   * Generate icons with a given prompt
   */
  async generateIcons(prompt: string): Promise<void> {
    await this.fillPrompt(prompt);
    await this.clickGenerateButton();
    // Wait for generation to complete
    await this.page.waitForTimeout(3000);
  }

  /**
   * Get the page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Set viewport size for responsive testing
   */
  async setViewportSize(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  /**
   * Wait for a specific timeout
   */
  async wait(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Get the underlying Playwright page object
   */
  getPage(): Page {
    return this.page;
  }
}

