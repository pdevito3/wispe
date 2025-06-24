import { test, expect } from '@playwright/test';

test.describe('Simple Autocomplete Example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page content to be ready using web-first assertions
    await expect(page.getByText('Simple Autocomplete')).toBeVisible();
    
    // Ensure clean state
    const simpleSection = page.locator('h2:has-text("Simple Autocomplete")').locator('..');
    const input = simpleSection.locator('input').first();
    
    await input.clear();
    await input.blur();
  });

  test('displays the simple autocomplete component', async ({ page }) => {
    const simpleSection = page.locator('h2:has-text("Simple Autocomplete")').locator('..');
    await expect(simpleSection).toBeVisible();
    
    // Check for the label
    await expect(simpleSection.locator('label').first()).toHaveText('Search fruits');
    
    // Check for the input field
    const input = simpleSection.locator('input').first();
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Type to search...');
  });

  test('filters fruits based on search term', async ({ page }) => {
    const simpleSection = page.locator('h2:has-text("Simple Autocomplete")').locator('..');
    const input = simpleSection.locator('input').first();
    const dropdown = simpleSection.locator('ul').first();

    await input.clear();
    await input.fill('a');
    await expect(dropdown).toBeVisible();

    // Should show fruits containing 'a' (Apple, Banana, Grape)
    const listItems = dropdown.locator('li');
    await expect(listItems).toHaveCount(3);
    await expect(dropdown).toContainText('Apple');
    await expect(dropdown).toContainText('Banana');
    await expect(dropdown).toContainText('Grape');
  });

  test('shows no results when no fruits match', async ({ page }) => {
    const simpleSection = page.locator('h2:has-text("Simple Autocomplete")').locator('..');
    const input = simpleSection.locator('input').first();
    const dropdown = simpleSection.locator('ul').first();

    await input.clear();
    await input.fill('xyz');
    await expect(dropdown).toBeVisible();
    await expect(dropdown.locator('li').first()).toHaveText('No results found');
  });

  test('can select fruit by clicking', async ({ page }) => {
    const simpleSection = page.locator('h2:has-text("Simple Autocomplete")').locator('..');
    const input = simpleSection.locator('input').first();
    const dropdown = simpleSection.locator('ul').first();

    await input.clear();
    await input.fill('apple');
    await expect(dropdown).toBeVisible();

    // Click on Apple
    await dropdown.locator('li').filter({ hasText: 'Apple' }).click();

    // Check that Apple is selected
    await expect(input).toHaveValue('Apple');
    
    // Check that the selected fruit info is displayed
    const selectedSection = simpleSection.locator('text=Selected Fruit:').locator('..');
    await expect(selectedSection).toBeVisible();
    await expect(selectedSection).toContainText('Apple');

    // Dropdown should be closed
    await expect(dropdown).not.toBeVisible();
  });

  test('shows clear button when fruit is selected', async ({ page }) => {
    const simpleSection = page.locator('h2:has-text("Simple Autocomplete")').locator('..');
    const input = simpleSection.locator('input').first();
    const dropdown = simpleSection.locator('ul').first();
    const clearButton = simpleSection.locator('button[type="button"]').first();

    // Start with clean input - clear button should not be visible
    await input.clear();
    await expect(clearButton).not.toBeVisible();

    // Select a fruit
    await input.fill('banana');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: 'Banana' }).click();

    // Clear button should appear
    await expect(clearButton).toBeVisible();
  });

  test('can clear selection using clear button', async ({ page }) => {
    const simpleSection = page.locator('h2:has-text("Simple Autocomplete")').locator('..');
    const input = simpleSection.locator('input').first();
    const dropdown = simpleSection.locator('ul').first();
    const clearButton = simpleSection.locator('button[type="button"]').first();

    // Start with clean input and select a fruit
    await input.clear();
    await input.fill('cherry');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: 'Cherry' }).click();

    // Verify selection
    await expect(input).toHaveValue('Cherry');
    
    // Click clear button
    await clearButton.click();

    // Input should be cleared
    await expect(input).toHaveValue('');
    
    // Selected fruit section should be hidden
    const selectedSection = simpleSection.locator('text=Selected Fruit:').locator('..');
    await expect(selectedSection).not.toBeVisible();
    
    // Clear button should be hidden
    await expect(clearButton).not.toBeVisible();
  });

  test('supports keyboard navigation', async ({ page }) => {
    const simpleSection = page.locator('h2:has-text("Simple Autocomplete")').locator('..');
    const input = simpleSection.locator('input').first();
    const dropdown = simpleSection.locator('ul').first();

    await input.clear();
    await input.fill('e');
    await expect(dropdown).toBeVisible();

    // Should show Elderberry
    await expect(dropdown).toContainText('Elderberry');

    // Press arrow down to highlight first item
    await input.press('ArrowDown');
    
    // First item should be highlighted
    const firstItem = dropdown.locator('li').first();
    await expect(firstItem).toHaveClass(/bg-gray-100/);
  });

  test('can select fruit with Enter key', async ({ page }) => {
    const simpleSection = page.locator('h2:has-text("Simple Autocomplete")').locator('..');
    const input = simpleSection.locator('input').first();
    const dropdown = simpleSection.locator('ul').first();

    await input.clear();
    await input.fill('durian');
    await expect(dropdown).toBeVisible();

    // Navigate to the item and select with Enter
    await input.press('ArrowDown');
    await input.press('Enter');

    // Should select Durian
    await expect(input).toHaveValue('Durian');
    await expect(dropdown).not.toBeVisible();
  });

  test('closes dropdown with Escape key', async ({ page }) => {
    const simpleSection = page.locator('h2:has-text("Simple Autocomplete")').locator('..');
    const input = simpleSection.locator('input').first();
    const dropdown = simpleSection.locator('ul').first();

    await input.clear();
    await input.fill('fig');
    await expect(dropdown).toBeVisible();

    // Press Escape
    await input.press('Escape');

    // Dropdown should close
    await expect(dropdown).not.toBeVisible();
  });

  test('shows selected indicator for selected fruit', async ({ page }) => {
    const simpleSection = page.locator('h2:has-text("Simple Autocomplete")').locator('..');
    const input = simpleSection.locator('input').first();
    const dropdown = simpleSection.locator('ul').first();

    // Start with clean input and select a fruit
    await input.clear();
    await input.fill('grape');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: 'Grape' }).click();

    // Open dropdown again to see the checkmark
    await input.click();
    await input.fill('');
    await input.fill('g');
    await expect(dropdown).toBeVisible();

    // Grape should have a checkmark
    const grapeItem = dropdown.locator('li').filter({ hasText: 'Grape' });
    await expect(grapeItem.locator('svg')).toBeVisible(); // Check icon
  });
});