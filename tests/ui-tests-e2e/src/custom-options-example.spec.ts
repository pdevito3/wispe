import { test, expect } from '@playwright/test';

test.describe('Custom Options (Detailed Option) Example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page content to be ready using web-first assertions
    await expect(page.getByText('Detailed Option')).toBeVisible();
    
    // Ensure clean state
    const detailedSection = page.locator('h2:has-text("Detailed Option")').locator('..');
    const input = detailedSection.locator('input').first();
    
    await input.clear();
    await input.blur();
  });

  test('displays the detailed option component', async ({ page }) => {
    const detailedSection = page.locator('h2:has-text("Detailed Option")').locator('..');
    await expect(detailedSection).toBeVisible();
    
    // Check for the label (screen reader only)
    await expect(detailedSection.locator('label').first()).toHaveText('Search users with custom rendering');
    
    // Check for the input field
    const input = detailedSection.locator('input').first();
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Type to search...');
  });

  test('shows detailed user information in dropdown items', async ({ page }) => {
    const detailedSection = page.locator('h2:has-text("Detailed Option")').locator('..');
    const input = detailedSection.locator('input').first();
    const dropdown = detailedSection.locator('ul').first();

    await input.clear();
    await input.fill('john');
    await expect(dropdown).toBeVisible();

    // Should show detailed user information
    const johnItem = dropdown.locator('li').filter({ hasText: 'John Doe' });
    await expect(johnItem).toBeVisible();
    
    // Check that both name and email are displayed in the item
    await expect(johnItem).toContainText('John Doe');
    await expect(johnItem).toContainText('john@deer.com');
    
    // Check the structure - name should be in font-medium div, email in text-gray-500
    await expect(johnItem.locator('.font-medium')).toContainText('John Doe');
    await expect(johnItem.locator('.text-gray-500')).toContainText('john@deer.com');
  });

  test('filters users based on name', async ({ page }) => {
    const detailedSection = page.locator('h2:has-text("Detailed Option")').locator('..');
    const input = detailedSection.locator('input').first();
    const dropdown = detailedSection.locator('ul').first();

    await input.clear();
    await input.fill('alice');
    await expect(dropdown).toBeVisible();

    // Should show only Alice Brown
    const listItems = dropdown.locator('li');
    await expect(listItems).toHaveCount(1);
    await expect(listItems.first()).toContainText('Alice Brown');
    await expect(listItems.first()).toContainText('alice@auth.com');
  });

  test('shows no results when no users match', async ({ page }) => {
    const detailedSection = page.locator('h2:has-text("Detailed Option")').locator('..');
    const input = detailedSection.locator('input').first();
    const dropdown = detailedSection.locator('ul').first();

    await input.clear();
    await input.fill('nonexistent');
    await expect(dropdown).toBeVisible();
    await expect(dropdown.locator('li').first()).toHaveText('No results found');
  });

  test('can select user by clicking', async ({ page }) => {
    const detailedSection = page.locator('h2:has-text("Detailed Option")').locator('..');
    const input = detailedSection.locator('input').first();
    const dropdown = detailedSection.locator('ul').first();

    await input.clear();
    await input.fill('jane');
    await expect(dropdown).toBeVisible();

    // Click on Jane Smith
    await dropdown.locator('li').filter({ hasText: 'Jane Smith' }).click();

    // Check that Jane Smith is selected
    await expect(input).toHaveValue('Jane Smith');
    
    // Check that the selected user info is displayed
    const selectedSection = detailedSection.locator('text=Selected User:').locator('..');
    await expect(selectedSection).toBeVisible();
    await expect(selectedSection).toContainText('Name: Jane Smith');
    await expect(selectedSection).toContainText('Email: jane@deer.com');

    // Dropdown should be closed
    await expect(dropdown).not.toBeVisible();
  });

  test('supports keyboard navigation through detailed items', async ({ page }) => {
    const detailedSection = page.locator('h2:has-text("Detailed Option")').locator('..');
    const input = detailedSection.locator('input').first();
    const dropdown = detailedSection.locator('ul').first();

    await input.clear();
    await input.fill('b');
    await expect(dropdown).toBeVisible();

    // Should show Bob Johnson and Alice Brown
    await expect(dropdown).toContainText('Bob Johnson');
    await expect(dropdown).toContainText('Alice Brown');

    // Press arrow down to highlight first item
    await input.press('ArrowDown');
    
    // First item should be highlighted
    const firstItem = dropdown.locator('li').first();
    await expect(firstItem).toHaveClass(/bg-gray-100/);
    
    // Press arrow down again to move to second item
    await input.press('ArrowDown');
    
    // Second item should be highlighted
    const secondItem = dropdown.locator('li').nth(1);
    await expect(secondItem).toHaveClass(/bg-gray-100/);
  });

  test('can select user with Enter key', async ({ page }) => {
    const detailedSection = page.locator('h2:has-text("Detailed Option")').locator('..');
    const input = detailedSection.locator('input').first();
    const dropdown = detailedSection.locator('ul').first();

    await input.clear();
    await input.fill('charlie');
    await expect(dropdown).toBeVisible();

    // Navigate to the item and select with Enter
    await input.press('ArrowDown');
    await input.press('Enter');

    // Should select Charlie Wilson
    await expect(input).toHaveValue('Charlie Wilson');
    await expect(dropdown).not.toBeVisible();
  });

  test('shows selected indicator in detailed view', async ({ page }) => {
    const detailedSection = page.locator('h2:has-text("Detailed Option")').locator('..');
    const input = detailedSection.locator('input').first();
    const dropdown = detailedSection.locator('ul').first();

    // Start with clean input and select a user
    await input.clear();
    await input.fill('bob');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: 'Bob Johnson' }).click();

    // Open dropdown again to see the checkmark
    await input.click();
    await input.fill('');
    await input.fill('b');
    await expect(dropdown).toBeVisible();

    // Bob Johnson should have a checkmark in the detailed view
    const bobItem = dropdown.locator('li').filter({ hasText: 'Bob Johnson' });
    await expect(bobItem.locator('svg')).toBeVisible(); // Check icon
    
    // Verify the checkmark is positioned correctly in the detailed layout
    await expect(bobItem.locator('.font-medium svg')).toBeVisible();
  });

  test('displays controlled state correctly', async ({ page }) => {
    const detailedSection = page.locator('h2:has-text("Detailed Option")').locator('..');
    const input = detailedSection.locator('input').first();
    const dropdown = detailedSection.locator('ul').first();

    // Test that the component uses controlled state by checking that input value persists
    await input.clear();
    await input.fill('test input');
    
    // Click outside to lose focus
    await page.click('body');
    
    // Value should still be there (controlled state)
    await expect(input).toHaveValue('test input');
    
    // Clear and type to trigger dropdown
    await input.clear();
    await input.fill('john');
    await expect(dropdown).toBeVisible();
    
    // The dropdown should open and show results
    await expect(dropdown.locator('li').filter({ hasText: 'John Doe' })).toBeVisible();
  });
});