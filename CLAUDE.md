# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wispe is a headless React autocomplete component library with a Tanstack-inspired API. The project is a monorepo managed by Nx with three main packages:

- `@wispe/wispe-react` - The core React autocomplete library
- `@wispe/ui-tests` - Vite-based test application for manual testing
- `@wispe/ui-tests-e2e` - Playwright e2e tests

## Common Commands

### Local Development

```bash
# Start the local development server for the main library
npx nx serve @wispe/ui-tests
# watch deps for lib
npx nx watch-deps @wispe/ui-tests
```

### Build Commands

```bash
# Build the main library
nx run @wispe/wispe-react:build

# Build all projects
nx run-many --target=build
```

### Development Commands

```bash
# Start the UI tests development server
nx run @wispe/ui-tests:dev

# Run e2e tests
nx run @wispe/ui-tests-e2e:e2e
```

### Code Quality Commands

```bash
# Lint the main library
nx run @wispe/wispe-react:lint

# Typecheck the main library
nx run @wispe/wispe-react:typecheck

# Run lint on all projects
nx run-many --target=lint

# Run typecheck on all projects
nx run-many --target=typecheck
```

### Testing Commands

```bash
# Run unit tests (if configured)
nx run @wispe/wispe-react:test

# Run all e2e tests
nx run @wispe/ui-tests-e2e:e2e

# Run specific test file
npx playwright test tests/ui-tests-e2e/src/basic-example.spec.ts --config=tests/ui-tests-e2e/playwright.config.ts

# Run tests in headed mode (see browser)
npx playwright test tests/ui-tests-e2e/src/basic-example.spec.ts --headed

# Run specific test by name
npx playwright test tests/ui-tests-e2e/src/basic-example.spec.ts --grep "displays the basic autocomplete component"

# Run tests with specific browser
npx playwright test tests/ui-tests-e2e/src/basic-example.spec.ts --project=chromium

# Debug tests interactively
npx playwright test tests/ui-tests-e2e/src/basic-example.spec.ts --debug

# Generate test report
npx playwright show-report tests/ui-tests-e2e/test-output/playwright/report
```

## Architecture

### Main Library (`packages/wispe-react/src`)

The core library follows a modular hook composition pattern:

- **`useAutoComplete`** - Main hook that orchestrates all functionality
- **Core hooks** (`autocomplete/core/`) - Essential UI primitives:

  - `use-active-item` - Manages highlighted/active item state
  - `use-input` - Input field behavior and events
  - `use-listbox` - Dropdown list container
  - `use-option` - Individual option items
  - `use-root` - Root container component
  - `use-label` - Label accessibility
  - `use-clear-button` - Clear functionality
  - `use-disclosure-button` - Show/hide toggle

- **Feature hooks** (`autocomplete/features/`) - Advanced functionality:

  - `use-filtering` - Async filtering and debouncing
  - `use-navigation` - Keyboard navigation
  - `use-grouping` - Item grouping and organization
  - `use-tabs` - Tab-based filtering
  - `use-custom-value` - Custom item creation

- **Types** (`autocomplete/types.ts`) - Comprehensive TypeScript definitions with overloads for:
  - Single vs multiple selection modes
  - Grouped vs ungrouped items
  - With vs without action items

### Key Design Patterns

1. **Headless Architecture** - Zero styling, full customization through prop getters
2. **Tanstack-Style API** - Prop getter pattern for composable UI elements
3. **Type Safety** - Complex TypeScript overloads ensure proper return types based on configuration
4. **Controlled/Uncontrolled** - Supports both patterns with internal state management
5. **Async-First** - Built-in debouncing and AbortController support for filtering

### State Management

The library uses a hybrid approach:

- Internal state for UI concerns (open/closed, active item, etc.)
- Controlled state options via the `state` prop for external control
- Value mapping between internal item type `T` and external value type `V`

### Testing Structure

- **`tests/ui-tests`** - Manual testing application with comprehensive examples
- **`tests/ui-tests-e2e`** - Playwright-based automated testing
- Examples cover all major features: basic usage, async data, grouping, multiselect, tabs, etc.

### Testing Best Practices

- **Use web-first assertions** instead of `waitForLoadState('networkidle')` for better reliability:
  ```typescript
  // ✅ Good - Web-first assertion
  await expect(page.getByText('Basic Autocomplete')).toBeVisible();
  
  // ❌ Avoid - Network idle waiting
  await page.waitForLoadState('networkidle');
  ```
- **Avoid conditionals in tests** for deterministic behavior:
  ```typescript
  // ✅ Good - Deterministic cleanup
  await input.clear();
  
  // ❌ Avoid - Conditional logic
  if (await clearButton.isVisible()) {
    await clearButton.click();
  }
  ```
- **Prefer specific element assertions** over generic timeouts
- **Use component state cleanup** in beforeEach hooks to ensure test isolation
