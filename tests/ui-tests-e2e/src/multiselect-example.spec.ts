import { test, expect } from '@playwright/test';

test.describe('Multi Select Example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page content to be ready using web-first assertions
    await expect(page.getByText('Multi Select')).toBeVisible();
    
    // Ensure clean state
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    
    await input.clear();
    await input.blur();
  });

  test('displays the multiselect component', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    await expect(multiselectSection).toBeVisible();
    
    // Check for the label
    await expect(multiselectSection.locator('label').first()).toHaveText('Select fruits');
    
    // Check for the input field
    const input = multiselectSection.locator('input').first();
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Type to search fruits...');
    
    // Check for the pill container
    const pillContainer = multiselectSection.locator('.flex.flex-wrap.items-center');
    await expect(pillContainer).toBeVisible();
  });

  test('can select multiple fruits', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();

    await input.clear();
    
    // Select first fruit
    await input.fill('apple');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍎 Apple' }).click();

    // Input should be cleared but dropdown should stay open for more selections
    await expect(input).toHaveValue('');
    
    // Select second fruit
    await input.fill('banana');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍌 Banana' }).click();

    // Check that both fruits are selected in the pills area
    const pills = multiselectSection.locator('.bg-green-100');
    await expect(pills).toHaveCount(2);
    await expect(pills.first()).toContainText('🍎 Apple');
    await expect(pills.nth(1)).toContainText('🍌 Banana');
  });

  test('shows selected fruits as pills when 2 or fewer', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();

    await input.clear();
    
    // Select one fruit
    await input.fill('orange');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍊 Orange' }).click();

    // Should show pill
    const pills = multiselectSection.locator('.bg-green-100');
    await expect(pills).toHaveCount(1);
    await expect(pills.first()).toContainText('🍊 Orange');
    
    // Select second fruit
    await input.fill('grape');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍇 Grape' }).click();

    // Should show both pills
    await expect(pills).toHaveCount(2);
    await expect(multiselectSection).toContainText('🍊 Orange');
    await expect(multiselectSection).toContainText('🍇 Grape');
  });

  test('shows count placeholder when more than 2 fruits selected', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();

    await input.clear();
    
    // Select three fruits
    await input.fill('apple');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍎 Apple' }).click();

    await input.fill('banana');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍌 Banana' }).click();

    await input.fill('orange');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍊 Orange' }).click();

    // Placeholder should show count instead of individual pills
    await expect(input).toHaveAttribute('placeholder', '3 fruit selected');
    
    // Pills should not be visible when count > 2
    const pills = multiselectSection.locator('.bg-green-100').first();
    await expect(pills).not.toBeVisible();
  });

  test('shows all selected fruits in the summary section', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();

    await input.clear();
    
    // Select multiple fruits
    await input.fill('apple');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍎 Apple' }).click();

    await input.fill('banana');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍌 Banana' }).click();

    await input.fill('orange');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍊 Orange' }).click();

    // Check that the selected fruits section is visible
    const selectedSection = multiselectSection.locator('text=Selected Fruits:').locator('..');
    await expect(selectedSection).toBeVisible();
    
    // Check that all fruits are listed
    const summaryPills = selectedSection.locator('.bg-green-100');
    await expect(summaryPills).toHaveCount(3);
    await expect(selectedSection).toContainText('🍎 Apple');
    await expect(selectedSection).toContainText('🍌 Banana');
    await expect(selectedSection).toContainText('🍊 Orange');
  });

  test('can clear all selections using clear button', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();
    const clearButton = multiselectSection.locator('button[type="button"]').first();

    await input.clear();
    
    // Select multiple fruits
    await input.fill('apple');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍎 Apple' }).click();

    await input.fill('banana');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍌 Banana' }).click();

    // Clear button should be visible
    await expect(clearButton).toBeVisible();
    
    // Click clear button
    await clearButton.click();

    // All selections should be cleared
    await expect(input).toHaveAttribute('placeholder', 'Type to search fruits...');
    
    // Selected fruits section should be hidden
    const selectedSection = multiselectSection.locator('text=Selected Fruits:').locator('..');
    await expect(selectedSection).not.toBeVisible();
    
    // Clear button should be hidden
    await expect(clearButton).not.toBeVisible();
  });

  test('shows selected indicators for selected fruits', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();

    await input.clear();
    
    // Select a fruit
    await input.fill('apple');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍎 Apple' }).click();

    // Open dropdown again to see selected indicators
    await input.fill('a');
    await expect(dropdown).toBeVisible();

    // Apple should have a checkmark
    const appleItem = dropdown.locator('li').filter({ hasText: '🍎 Apple' });
    await expect(appleItem.locator('svg')).toBeVisible(); // Check icon
  });

  test('can deselect fruits by clicking them again', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();

    await input.clear();
    
    // Select two fruits
    await input.fill('apple');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍎 Apple' }).click();

    await input.fill('banana');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍌 Banana' }).click();

    // Both should be selected
    const pills = multiselectSection.locator('.bg-green-100');
    await expect(pills).toHaveCount(2);

    // Click apple again to deselect
    await input.fill('apple');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍎 Apple' }).click();

    // Should only have banana selected now
    await expect(pills).toHaveCount(1);
    await expect(multiselectSection).toContainText('🍌 Banana');
    await expect(multiselectSection).not.toContainText('🍎 Apple');
  });

  test('supports keyboard navigation in multiselect mode', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();

    await input.clear();
    await input.fill('a');
    await expect(dropdown).toBeVisible();

    // Press arrow down to highlight first item
    await input.press('ArrowDown');
    
    // First item should be highlighted
    const firstItem = dropdown.locator('li').first();
    await expect(firstItem).toHaveClass(/bg-gray-100/);

    // Press Enter to select
    await input.press('Enter');

    // Should select the item and clear input
    await expect(input).toHaveValue('');
    
    // The selected fruit should appear as a pill
    const pills = multiselectSection.locator('.bg-green-100');
    await expect(pills).toHaveCount(1);
  });

  test('filters available options correctly', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();

    await input.clear();
    await input.fill('berry');
    await expect(dropdown).toBeVisible();

    // Should show fruits containing 'berry' in the label
    const listItems = dropdown.locator('li');
    await expect(listItems).toHaveCount.greaterThan(0);
    
    // All visible items should contain 'berry' or be fruits with berry-like names
    const itemTexts = await listItems.allTextContents();
    expect(itemTexts.some(text => text.includes('🍓') || text.includes('🍌') || text.includes('🍇'))).toBeTruthy();
  });

  test('maintains selection state across different searches', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();

    await input.clear();
    
    // Select apple
    await input.fill('apple');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: '🍎 Apple' }).click();

    // Search for something else
    await input.fill('banana');
    await expect(dropdown).toBeVisible();

    // Apple should still be selected (shown as pill)
    const pills = multiselectSection.locator('.bg-green-100');
    await expect(pills).toHaveCount(1);
    await expect(pills.first()).toContainText('🍎 Apple');

    // Select banana
    await dropdown.locator('li').filter({ hasText: '🍌 Banana' }).click();

    // Now should have both
    await expect(pills).toHaveCount(2);
  });

  test('shows no results when no fruits match search', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();

    await input.clear();
    await input.fill('xyz');
    await expect(dropdown).toBeVisible();
    await expect(dropdown.locator('li').first()).toHaveText('No results found');
  });

  test('handles many selections gracefully', async ({ page }) => {
    const multiselectSection = page.locator('h2:has-text("Multi Select")').locator('..');
    const input = multiselectSection.locator('input').first();
    const dropdown = multiselectSection.locator('ul').first();

    await input.clear();
    
    // Select 5 fruits
    const fruitsToSelect = ['apple', 'banana', 'orange', 'grape', 'mango'];
    const fruitEmojis = ['🍎 Apple', '🍌 Banana', '🍊 Orange', '🍇 Grape', '🥭 Mango'];
    
    for (let i = 0; i < fruitsToSelect.length; i++) {
      await input.fill(fruitsToSelect[i]);
      await expect(dropdown).toBeVisible();
      await dropdown.locator('li').filter({ hasText: fruitEmojis[i] }).click();
    }

    // Placeholder should show count
    await expect(input).toHaveAttribute('placeholder', '5 fruit selected');
    
    // All fruits should be in the summary section
    const selectedSection = multiselectSection.locator('text=Selected Fruits:').locator('..');
    await expect(selectedSection).toBeVisible();
    
    const summaryPills = selectedSection.locator('.bg-green-100');
    await expect(summaryPills).toHaveCount(5);
  });
});