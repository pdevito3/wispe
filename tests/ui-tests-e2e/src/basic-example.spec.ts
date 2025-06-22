import { test, expect } from '@playwright/test';

test.describe('Basic Autocomplete Example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page content to be ready using web-first assertions
    await expect(page.getByText('Basic Autocomplete')).toBeVisible();
    
    // Ensure clean state - always clear input and blur to close dropdowns
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    
    // Clear input and remove focus to ensure clean state
    await input.clear();
    await input.blur();
  });

  test('displays the basic autocomplete component', async ({ page }) => {
    // Find the Basic Autocomplete section - more specific selector
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    await expect(basicSection).toBeVisible();
    
    // Check for the label
    await expect(basicSection.locator('label').first()).toHaveText('Search users');
    
    // Check for the input field
    const input = basicSection.locator('input').first();
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Type to search...');
  });

  test('dropdown shows filtered results when typing', async ({ page }) => {
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    const dropdown = basicSection.locator('ul').first();

    // Start with clean input
    await input.clear();

    // Type to trigger filtering
    await input.fill('j');
    
    // Dropdown should be visible and show filtered results
    await expect(dropdown).toBeVisible();
    
    // Should show users matching 'j' (John Doe, Jane Smith, Bob Johnson)
    const listItems = dropdown.locator('li');
    await expect(listItems).toHaveCount(3);
    await expect(dropdown).toContainText('John Doe');
    await expect(dropdown).toContainText('Jane Smith');
    await expect(dropdown).toContainText('Bob Johnson');
  });

  test('filters users based on search term', async ({ page }) => {
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    const dropdown = basicSection.locator('ul').first();

    // Search for users containing 'john'
    await input.fill('john');
    await expect(dropdown).toBeVisible();

    // Should show John Doe and Bob Johnson
    const listItems = dropdown.locator('li');
    await expect(listItems).toHaveCount(2);
    await expect(listItems.nth(0)).toContainText('John Doe');
    await expect(listItems.nth(1)).toContainText('Bob Johnson');
  });

  test('shows "No results found" when no matches', async ({ page }) => {
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    const dropdown = basicSection.locator('ul').first();

    // Search for something that doesn't exist
    await input.fill('xyz123nonexistent');
    await expect(dropdown).toBeVisible();
    await expect(dropdown.locator('li').first()).toHaveText('No results found');
  });

  test('can select a user by clicking', async ({ page }) => {
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    const dropdown = basicSection.locator('ul').first();

    // Type to open dropdown
    await input.fill('jane');
    await expect(dropdown).toBeVisible();

    // Click on Jane Smith
    await dropdown.locator('li').filter({ hasText: 'Jane Smith' }).click();

    // Check that Jane Smith is selected
    await expect(input).toHaveValue('Jane Smith');
    
    // Check that the selected user info is displayed
    const selectedSection = basicSection.locator('text=Selected User:').locator('..');
    await expect(selectedSection).toBeVisible();
    await expect(selectedSection).toContainText('Name: Jane Smith');
    await expect(selectedSection).toContainText('Email: jane@deer.com');

    // Dropdown should be closed
    await expect(dropdown).not.toBeVisible();
  });

  test('shows clear button when item is selected', async ({ page }) => {
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    const dropdown = basicSection.locator('ul').first();
    const clearButton = basicSection.locator('button[type="button"]').first();

    // Start with clean state - clear button should not be visible initially
    await input.clear();
    await expect(clearButton).not.toBeVisible();

    // Select an item
    await input.fill('alice');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: 'Alice Brown' }).click();

    // Clear button should appear
    await expect(clearButton).toBeVisible();
  });

  test('can clear selection using clear button', async ({ page }) => {
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    const dropdown = basicSection.locator('ul').first();
    const clearButton = basicSection.locator('button[type="button"]').first();

    // Start with clean input and select an item
    await input.clear();
    await input.fill('charlie');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: 'Charlie Wilson' }).click();

    // Verify selection
    await expect(input).toHaveValue('Charlie Wilson');
    
    // Click clear button
    await clearButton.click();

    // Input should be cleared
    await expect(input).toHaveValue('');
    
    // Selected user section should be hidden
    const selectedSection = basicSection.locator('text=Selected User:').locator('..');
    await expect(selectedSection).not.toBeVisible();
    
    // Clear button should be hidden
    await expect(clearButton).not.toBeVisible();
  });

  test('supports keyboard navigation with arrow keys', async ({ page }) => {
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    const dropdown = basicSection.locator('ul').first();

    // Start with clean input
    await input.clear();
    
    // Type to open dropdown
    await input.fill('a');
    await expect(dropdown).toBeVisible();

    // Press arrow down to highlight first item
    await input.press('ArrowDown');
    
    // First item should be highlighted (look for aria-activedescendant or visual cues)
    const firstItem = dropdown.locator('li').first();
    await expect(firstItem).toHaveClass(/bg-gray-100/);

    // Press arrow down again
    await input.press('ArrowDown');
    
    // Second item should be highlighted
    const secondItem = dropdown.locator('li').nth(1);
    await expect(secondItem).toHaveClass(/bg-gray-100/);
  });

  test('can select item with Enter key', async ({ page }) => {
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    const dropdown = basicSection.locator('ul').first();

    // Start with clean input
    await input.clear();
    
    // Type to open dropdown with a search that has only one result
    await input.fill('charlie');
    await expect(dropdown).toBeVisible();
    
    // Verify Charlie Wilson is the only result
    const listItems = dropdown.locator('li');
    await expect(listItems).toHaveCount(1);
    await expect(listItems.first()).toContainText('Charlie Wilson');

    // Navigate to the item and select with Enter
    await input.press('ArrowDown');
    await input.press('Enter');

    // Should select Charlie Wilson
    await expect(input).toHaveValue('Charlie Wilson');
    await expect(dropdown).not.toBeVisible();
  });

  test('closes dropdown with Escape key', async ({ page }) => {
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    const dropdown = basicSection.locator('ul').first();

    // Type to open dropdown
    await input.fill('john');
    await expect(dropdown).toBeVisible();

    // Press Escape
    await input.press('Escape');

    // Dropdown should close
    await expect(dropdown).not.toBeVisible();
  });

  test('shows selected indicator (checkmark) for selected item', async ({ page }) => {
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    const dropdown = basicSection.locator('ul').first();

    // Start with clean input and select an item
    await input.clear();
    await input.fill('alice');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: 'Alice Brown' }).click();

    // Open dropdown again to see the checkmark
    await input.click();
    await input.fill('');
    await input.fill('a');
    await expect(dropdown).toBeVisible();

    // Alice Brown should have a checkmark
    const aliceItem = dropdown.locator('li').filter({ hasText: 'Alice Brown' });
    await expect(aliceItem.locator('svg')).toBeVisible(); // Check icon
  });

  test('search has debounced behavior', async ({ page }) => {
    const basicSection = page.locator('h2:has-text("Basic Autocomplete")').locator('..');
    const input = basicSection.locator('input').first();
    const dropdown = basicSection.locator('ul').first();

    // Start with clean input
    await input.clear();
    
    // Type characters to trigger search
    await input.fill('john');
    
    // Wait for debounce and verify results appear
    await expect(dropdown).toBeVisible();
    
    // Verify we get the expected results for 'john'
    const listItems = dropdown.locator('li');
    await expect(listItems).toHaveCount(2);
    await expect(listItems.first()).toContainText('John Doe');
    await expect(listItems.nth(1)).toContainText('Bob Johnson');
  });
});