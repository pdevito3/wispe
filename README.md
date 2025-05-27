# Wispe

Wispe is an autocomplete component for React that is unstyled (headless) and has a Tanstack inspired API with rich interactions.

## Documentation

Visit https://wispe.dev/docs to view the documentation.

## Usage

To start using the library, install it in your project:

```bash
npm install @wispe/wispe-react
```

Use `useAutoComplete` to establish your incoming automcplete state and use the return values to compose your actual component.

```tsx
import { useAutoComplete } from "@wispe/wispe-react";

export interface User {
  id: number;
  name: string;
}

export const users: User[] = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
  { id: 4, name: "Alice Brown" },
  { id: 5, name: "Charlie Wilson" },
];

export function BasicAutocomplete() {
  const {
    getRootProps,
    getLabelProps,
    getInputProps,
    getListProps,
    getItemProps,
    getItemState,
    getItems,
    isOpen,
  } = useAutoComplete({
    items: users,
    state: {
      label: "Search users",
    },
    onFilterAsync: async ({ searchTerm }) =>
      users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    itemToString: (u) => u.name,
  });

  return (
    <>
      <label {...getLabelProps()}>Search users</label>
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        {isOpen && (
          <ul {...getListProps()}>
            {getItems().map((user) => (
              <li key={user.id} {...getItemProps(user)}>
                <span>
                  {user.name} {getItemState(user).isSelected && <span>✓</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

```

## Feature Summary

- 100% TypeScript (but not required)
- Headless (100% customizable, Bring-your-own-UI)
- Auto out of the box, opt-in controllable state
- Keyboard Navigation (and overall a11y support)
- Flexible Filtering Options
- 1st Class Async Data Support
- Built in Debounce Option
- Single or Multi-Select
- Tab Navigation
- Grouping & Aggregation
- Link Items
- Action Items
- Create New Items
- Clearable
- Animatable
- Virtualizable
