import { test, expect } from '@playwright/test';

test.describe('Grouping Example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page content to be ready using web-first assertions
    await expect(page.getByRole('heading', { name: 'Grouping', exact: true })).toBeVisible();
    
    // Ensure clean state - use exact match for Grouping (not Multi Grouping)
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    
    await input.clear();
    await input.blur();
  });

  test('displays the grouping component', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    await expect(groupingSection).toBeVisible();
    
    // Check for the label
    await expect(groupingSection.locator('label').first()).toHaveText('Search fruits');
    
    // Check for the input field
    const input = groupingSection.locator('input').first();
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Type to search fruits...');
  });

  test('shows grouped fruits by type when opened', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();

    await input.clear();
    await input.fill('a');
    await expect(dropdown).toBeVisible();

    // Check for group headers - should see fruit types
    await expect(dropdown.locator('.bg-gray-600')).toHaveCount.greaterThan(0);
    
    // Should see different fruit types as group headers
    const groupHeaders = dropdown.locator('.bg-gray-600');
    const headerTexts = await groupHeaders.allTextContents();
    
    // Should contain some fruit types like 'pome', 'berry', 'citrus', etc.
    expect(headerTexts.length).toBeGreaterThan(0);
    expect(headerTexts.some(text => ['pome', 'berry', 'citrus', 'tropical', 'stone', 'melon'].includes(text.toLowerCase()))).toBeTruthy();
  });

  test('groups fruits correctly by type', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();

    await input.clear();
    await input.fill('apple');
    await expect(dropdown).toBeVisible();

    // Should show apple under the 'pome' group
    const pomeGroup = dropdown.locator('text=pome').locator('..').locator('..');
    await expect(pomeGroup).toBeVisible();
    await expect(pomeGroup).toContainText('🍎 Apple');
  });

  test('filters across all groups', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();

    await input.clear();
    await input.fill('e');
    await expect(dropdown).toBeVisible();

    // Should show fruits containing 'e' from different groups
    // Apple (pome), Grape (berry), Orange (citrus), Cherry (stone), etc.
    await expect(dropdown).toContainText('🍎 Apple');
    await expect(dropdown).toContainText('🍇 Grape');
    await expect(dropdown).toContainText('🍊 Orange');
    await expect(dropdown).toContainText('🍒 Cherry');
  });

  test('can select fruit from a group', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();

    await input.clear();
    await input.fill('banana');
    await expect(dropdown).toBeVisible();

    // Click on Banana (should be in berry group)
    await dropdown.locator('li').filter({ hasText: '🍌 Banana' }).click();

    // Check that Banana is selected
    await expect(input).toHaveValue('🍌 Banana');
    
    // Check that the selected fruit info is displayed with all details
    const selectedSection = groupingSection.locator('text=Selected Fruit:').locator('..');
    await expect(selectedSection).toBeVisible();
    await expect(selectedSection).toContainText('🍌 Banana');
    await expect(selectedSection).toContainText('Type: berry');
    await expect(selectedSection).toContainText('Taste: sweet');
    await expect(selectedSection).toContainText('Color: yellow');

    // Dropdown should be closed
    await expect(dropdown).not.toBeVisible();
  });

  test('shows clear button when fruit is selected', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();
    const clearButton = groupingSection.locator('button[type="button"]').first();

    // Start with clean input - clear button should not be visible
    await input.clear();
    await expect(clearButton).not.toBeVisible();

    // Select a fruit
    await input.fill('orange');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍊 Orange' }).click();

    // Clear button should appear
    await expect(clearButton).toBeVisible();
  });

  test('can clear selection using clear button', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();
    const clearButton = groupingSection.locator('button[type="button"]').first();

    // Start with clean input and select a fruit
    await input.clear();
    await input.fill('mango');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🥭 Mango' }).click();

    // Verify selection
    await expect(input).toHaveValue('🥭 Mango');
    
    // Click clear button
    await clearButton.click();

    // Input should be cleared
    await expect(input).toHaveValue('');
    
    // Selected fruit section should be hidden
    const selectedSection = groupingSection.locator('text=Selected Fruit:').locator('..');
    await expect(selectedSection).not.toBeVisible();
    
    // Clear button should be hidden
    await expect(clearButton).not.toBeVisible();
  });

  test('supports keyboard navigation within groups', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();

    await input.clear();
    await input.fill('berry');
    await expect(dropdown).toBeVisible();

    // Should show fruits in berry group
    await expect(dropdown).toContainText('🍌 Banana');
    await expect(dropdown).toContainText('🍓 Strawberry');
    await expect(dropdown).toContainText('🍇 Grape');

    // Press arrow down to navigate through items
    await input.press('ArrowDown');
    
    // First fruit item should be highlighted (skip group header)
    const firstFruitItem = dropdown.locator('li[role]').first(); // Items with role attribute
    await expect(firstFruitItem).toHaveClass(/bg-gray-100/);
  });

  test('can select fruit with Enter key in grouped view', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();

    await input.clear();
    await input.fill('kiwi');
    await expect(dropdown).toBeVisible();

    // Navigate to the kiwi item and select with Enter
    await input.press('ArrowDown');
    await input.press('Enter');

    // Should select Kiwi
    await expect(input).toHaveValue('🥝 Kiwi');
    await expect(dropdown).not.toBeVisible();
  });

  test('shows selected indicator in grouped view', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();

    // Start with clean input and select a fruit
    await input.clear();
    await input.fill('strawberry');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍓 Strawberry' }).click();

    // Open dropdown again to see the checkmark
    await input.click();
    await input.fill('');
    await input.fill('s');
    await expect(dropdown).toBeVisible();

    // Strawberry should have a checkmark
    const strawberryItem = dropdown.locator('li').filter({ hasText: '🍓 Strawberry' });
    await expect(strawberryItem.locator('svg')).toBeVisible(); // Check icon
  });

  test('shows no results when no fruits match in any group', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();

    await input.clear();
    await input.fill('xyz');
    await expect(dropdown).toBeVisible();
    await expect(dropdown.locator('li').first()).toHaveText('No results found');
  });

  test('maintains group structure when filtering', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();

    await input.clear();
    await input.fill('sweet');
    await expect(dropdown).toBeVisible();

    // Should still show group headers for groups that have matching fruits
    const groupHeaders = dropdown.locator('.bg-gray-600');
    await expect(groupHeaders).toHaveCount.greaterThan(0);
    
    // Should show fruits with 'sweet' taste from multiple groups
    await expect(dropdown).toContainText('🍎 Apple');
    await expect(dropdown).toContainText('🍌 Banana');
    await expect(dropdown).toContainText('🍓 Strawberry');
  });

  test('shows detailed selected fruit information', async ({ page }) => {
    const groupingSection = page.locator('h2').filter({ hasText: /^Grouping$/ }).locator('..');
    const input = groupingSection.locator('input').first();
    const dropdown = groupingSection.locator('ul').first();

    await input.clear();
    await input.fill('pineapple');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍍 Pineapple' }).click();

    // Check all the detailed information is displayed
    const selectedSection = groupingSection.locator('text=Selected Fruit:').locator('..');
    await expect(selectedSection).toBeVisible();
    
    // Check each piece of information
    await expect(selectedSection).toContainText('🍍 Pineapple');
    await expect(selectedSection).toContainText('Type: tropical');
    await expect(selectedSection).toContainText('Taste: sweet-tart');
    await expect(selectedSection).toContainText('Color: yellow');
  });
});