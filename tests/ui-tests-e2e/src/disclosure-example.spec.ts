import { test, expect } from '@playwright/test';

test.describe('Disclosure Button Example', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page content to be ready using web-first assertions
    await expect(page.getByText('Disclosure Button')).toBeVisible();
    
    // Ensure clean state
    const disclosureSection = page.locator('h2:has-text("Disclosure Button")').locator('..');
    const input = disclosureSection.locator('input').first();
    
    await input.clear();
    await input.blur();
  });

  test('displays the disclosure button component', async ({ page }) => {
    const disclosureSection = page.locator('h2:has-text("Disclosure Button")').locator('..');
    await expect(disclosureSection).toBeVisible();
    
    // Check for the label
    await expect(disclosureSection.locator('label').first()).toHaveText('Search users');
    
    // Check for the input field
    const input = disclosureSection.locator('input').first();
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Type to search...');
    
    // Check for the disclosure button (dropdown arrow)
    const disclosureButton = disclosureSection.locator('button').filter({ hasText: '' }).last(); // The button with the arrow icon
    await expect(disclosureButton).toBeVisible();
    
    // Check that the disclosure button has the arrow icon
    await expect(disclosureButton.locator('svg')).toBeVisible();
  });

  test('can open dropdown using disclosure button', async ({ page }) => {
    const disclosureSection = page.locator('h2:has-text("Disclosure Button")').locator('..');
    const input = disclosureSection.locator('input').first();
    const dropdown = disclosureSection.locator('ul').first();
    const disclosureButton = disclosureSection.locator('button').filter({ hasText: '' }).last();

    // Initially dropdown should not be visible
    await expect(dropdown).not.toBeVisible();

    // Click the disclosure button
    await disclosureButton.click();

    // Dropdown should open and show all users
    await expect(dropdown).toBeVisible();
    const listItems = dropdown.locator('li');
    await expect(listItems).toHaveCount(5); // All users should be shown
    await expect(dropdown).toContainText('John Doe');
    await expect(dropdown).toContainText('Jane Smith');
    await expect(dropdown).toContainText('Bob Johnson');
    await expect(dropdown).toContainText('Alice Brown');
    await expect(dropdown).toContainText('Charlie Wilson');
  });

  test('can close dropdown using disclosure button', async ({ page }) => {
    const disclosureSection = page.locator('h2:has-text("Disclosure Button")').locator('..');
    const dropdown = disclosureSection.locator('ul').first();
    const disclosureButton = disclosureSection.locator('button').filter({ hasText: '' }).last();

    // Open dropdown first
    await disclosureButton.click();
    await expect(dropdown).toBeVisible();

    // Click disclosure button again to close
    await disclosureButton.click();
    await expect(dropdown).not.toBeVisible();
  });

  test('shows both clear button and disclosure button when item is selected', async ({ page }) => {
    const disclosureSection = page.locator('h2:has-text("Disclosure Button")').locator('..');
    const input = disclosureSection.locator('input').first();
    const dropdown = disclosureSection.locator('ul').first();
    const clearButton = disclosureSection.locator('button').filter({ hasText: '' }).first(); // First button should be clear
    const disclosureButton = disclosureSection.locator('button').filter({ hasText: '' }).last(); // Last button should be disclosure

    // Start with clean input
    await input.clear();
    
    // Initially only disclosure button should be visible
    await expect(disclosureButton).toBeVisible();
    await expect(clearButton).not.toBeVisible();

    // Select a user
    await input.fill('john');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: 'John Doe' }).click();

    // Both buttons should now be visible
    await expect(clearButton).toBeVisible();
    await expect(disclosureButton).toBeVisible();
    
    // Verify their positioning (clear button should be at right-10, disclosure at right-3)
    await expect(clearButton).toHaveClass(/right-10/);
    await expect(disclosureButton).toHaveClass(/right-3/);
  });

  test('can clear selection using clear button', async ({ page }) => {
    const disclosureSection = page.locator('h2:has-text("Disclosure Button")').locator('..');
    const input = disclosureSection.locator('input').first();
    const dropdown = disclosureSection.locator('ul').first();
    const clearButton = disclosureSection.locator('button').filter({ hasText: '' }).first();

    // Start with clean input and select a user
    await input.clear();
    await input.fill('alice');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: 'Alice Brown' }).click();

    // Verify selection
    await expect(input).toHaveValue('Alice Brown');

    // Click clear button
    await clearButton.click();

    // Input should be cleared
    await expect(input).toHaveValue('');
    
    // Selected user section should be hidden
    const selectedSection = disclosureSection.locator('text=Selected User:').locator('..');
    await expect(selectedSection).not.toBeVisible();
    
    // Clear button should be hidden
    await expect(clearButton).not.toBeVisible();
  });

  test('supports filtering with disclosure button functionality', async ({ page }) => {
    const disclosureSection = page.locator('h2:has-text("Disclosure Button")').locator('..');
    const input = disclosureSection.locator('input').first();
    const dropdown = disclosureSection.locator('ul').first();
    const disclosureButton = disclosureSection.locator('button').filter({ hasText: '' }).last();

    await input.clear();
    
    // Type to filter
    await input.fill('j');
    await expect(dropdown).toBeVisible();

    // Should show filtered results
    const listItems = dropdown.locator('li');
    await expect(listItems).toHaveCount(3); // John Doe, Jane Smith, Bob Johnson
    
    // Close with disclosure button
    await disclosureButton.click();
    await expect(dropdown).not.toBeVisible();
    
    // Open again with disclosure button - should show all users, not filtered
    await disclosureButton.click();
    await expect(dropdown).toBeVisible();
    await expect(dropdown.locator('li')).toHaveCount(5); // All users
  });

  test('supports keyboard navigation with disclosure button', async ({ page }) => {
    const disclosureSection = page.locator('h2:has-text("Disclosure Button")').locator('..');
    const input = disclosureSection.locator('input').first();
    const dropdown = disclosureSection.locator('ul').first();
    const disclosureButton = disclosureSection.locator('button').filter({ hasText: '' }).last();

    await input.clear();
    
    // Open dropdown with disclosure button
    await disclosureButton.click();
    await expect(dropdown).toBeVisible();

    // Focus should be on input, try keyboard navigation
    await input.focus();
    await input.press('ArrowDown');
    
    // First item should be highlighted
    const firstItem = dropdown.locator('li').first();
    await expect(firstItem).toHaveClass(/bg-gray-100/);

    // Select with Enter
    await input.press('Enter');
    
    // Should select the first user
    await expect(input).toHaveValue('John Doe');
    await expect(dropdown).not.toBeVisible();
  });

  test('can select user and see selected state', async ({ page }) => {
    const disclosureSection = page.locator('h2:has-text("Disclosure Button")').locator('..');
    const input = disclosureSection.locator('input').first();
    const dropdown = disclosureSection.locator('ul').first();

    await input.clear();
    await input.fill('charlie');
    await expect(dropdown).toBeVisible();

    // Click on Charlie Wilson
    await dropdown.locator('li').filter({ hasText: 'Charlie Wilson' }).click();

    // Check that Charlie Wilson is selected
    await expect(input).toHaveValue('Charlie Wilson');
    
    // Check that the selected user info is displayed
    const selectedSection = disclosureSection.locator('text=Selected User:').locator('..');
    await expect(selectedSection).toBeVisible();
    await expect(selectedSection).toContainText('Name: Charlie Wilson');
    await expect(selectedSection).toContainText('Email: charlie@example.com');

    // Dropdown should be closed
    await expect(dropdown).not.toBeVisible();
  });

  test('shows selected indicator when reopening dropdown', async ({ page }) => {
    const disclosureSection = page.locator('h2:has-text("Disclosure Button")').locator('..');
    const input = disclosureSection.locator('input').first();
    const dropdown = disclosureSection.locator('ul').first();
    const disclosureButton = disclosureSection.locator('button').filter({ hasText: '' }).last();

    // Start with clean input and select a user
    await input.clear();
    await input.fill('bob');
    await expect(dropdown).toBeVisible();
    await dropdown.locator('li').filter({ hasText: 'Bob Johnson' }).click();

    // Open dropdown again with disclosure button
    await disclosureButton.click();
    await expect(dropdown).toBeVisible();

    // Bob Johnson should have a checkmark
    const bobItem = dropdown.locator('li').filter({ hasText: 'Bob Johnson' });
    await expect(bobItem.locator('svg')).toBeVisible(); // Check icon
  });

  test('disclosure button works with debounced filtering', async ({ page }) => {
    const disclosureSection = page.locator('h2:has-text("Disclosure Button")').locator('..');
    const input = disclosureSection.locator('input').first();
    const dropdown = disclosureSection.locator('ul').first();
    const disclosureButton = disclosureSection.locator('button').filter({ hasText: '' }).last();

    await input.clear();
    
    // Type to trigger debounced filtering
    await input.fill('jane');
    await expect(dropdown).toBeVisible();

    // Should show Jane Smith after debounce
    await expect(dropdown.locator('li')).toHaveCount(1);
    await expect(dropdown).toContainText('Jane Smith');

    // Close with disclosure button
    await disclosureButton.click();
    await expect(dropdown).not.toBeVisible();

    // Clear input and open with disclosure button
    await input.clear();
    await disclosureButton.click();
    
    // Should show all users, not the previous filtered result
    await expect(dropdown).toBeVisible();
    await expect(dropdown.locator('li')).toHaveCount(5);
  });
});