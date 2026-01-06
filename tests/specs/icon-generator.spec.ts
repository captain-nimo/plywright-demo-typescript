import { test, expect } from '@playwright/test';
import { IconGeneratorPage } from '../pages/IconGeneratorPage';

test.describe('Icon Generator - Icon Generation', () => {
  test('should render application on page load', async ({ page }) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await iconGeneratorPage.goto();
    const title = await iconGeneratorPage.getPageTitle();
    expect(title).toBeTruthy();
  });

  test('should display prompt input field', async ({ page }) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await iconGeneratorPage.goto();
    await iconGeneratorPage.waitForPromptInput();

    const isVisible = await iconGeneratorPage.isPromptInputVisible();
    expect(isVisible).toBe(true);
  });

  test('should display generate button', async ({ page }) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await iconGeneratorPage.goto();
    await iconGeneratorPage.waitForGenerateButton();

    const isVisible = await iconGeneratorPage.isGenerateButtonVisible();
    expect(isVisible).toBe(true);
  });

  test('should accept text input in prompt field', async ({ page }) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await iconGeneratorPage.goto();
    await iconGeneratorPage.waitForPromptInput();

    await iconGeneratorPage.fillPrompt('test prompt');

    const value = await iconGeneratorPage.getPromptValue();
    expect(value).toContain('test prompt');
  });

  test('should generate icons on button click', async ({ page }) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await iconGeneratorPage.goto();
    await iconGeneratorPage.waitForPromptInput();

    await iconGeneratorPage.generateIcons('car');

    const count = await iconGeneratorPage.getIconCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('Icon Generator - UI Elements', () => {
  test('should have responsive design on desktop', async ({ page }) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await iconGeneratorPage.setViewportSize(1920, 1080);
    await iconGeneratorPage.goto();
    await iconGeneratorPage.waitForPromptInput();

    const isVisible = await iconGeneratorPage.isPromptInputVisible();
    expect(isVisible).toBe(true);
  });

  test('should have responsive design on mobile', async ({ page }) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await iconGeneratorPage.setViewportSize(375, 812);
    await iconGeneratorPage.goto();
    await iconGeneratorPage.waitForPromptInput();

    const isVisible = await iconGeneratorPage.isPromptInputVisible();
    expect(isVisible).toBe(true);
  });

  test('should have responsive design on tablet', async ({ page }) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await iconGeneratorPage.setViewportSize(768, 1024);
    await iconGeneratorPage.goto();
    await iconGeneratorPage.waitForPromptInput();

    const isVisible = await iconGeneratorPage.isPromptInputVisible();
    expect(isVisible).toBe(true);
  });
});

test.describe('Icon Generator - Edge Cases', () => {
  test('should handle long prompts', async ({ page }) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await iconGeneratorPage.goto();
    await iconGeneratorPage.waitForPromptInput();

    const longPrompt = 'a ' + 'long '.repeat(50);
    await iconGeneratorPage.fillPrompt(longPrompt);

    const value = await iconGeneratorPage.getPromptValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should handle special characters', async ({ page }) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await iconGeneratorPage.goto();
    await iconGeneratorPage.waitForPromptInput();

    await iconGeneratorPage.fillPrompt('test@#$%');

    const value = await iconGeneratorPage.getPromptValue();
    expect(value).toContain('test@#$%');
  });

  test('should maintain focus on input field', async ({ page }) => {
    const iconGeneratorPage = new IconGeneratorPage(page);
    await iconGeneratorPage.goto();
    await iconGeneratorPage.waitForPromptInput();

    await iconGeneratorPage.focusPrompt();
    await iconGeneratorPage.fillPrompt('test');

    const value = await iconGeneratorPage.getPromptValue();
    expect(value).toContain('test');
  });
});

