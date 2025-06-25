/**
 * Types and interfaces for the dropdown component and hook.
 */

// Re-export common types from autocomplete
export type { Mode, GroupingOptions, Group, ActionItem, Tab, ItemState, TabState } from "../autocomplete/types";

/**
 * Controlled state for the dropdown hook.
 * @template T  the type of each option item
 * @template V  the external value type (defaults to T)
 */
export interface UseDropdownState<T, V = T> {
  /** Whether the listbox is open. */
  isOpen?: boolean;
  /** External setter for the open state. */
  setIsOpen?: (isOpen: boolean) => void;
  /** One or more grouping definitions. */
  grouping?: import("../autocomplete/types").GroupingOptions<T>[];
  /** Default selected item (uncontrolled single mode). */
  defaultValue?: T;
  /** Currently active (highlighted) item. */
  activeItem?: T | null;
  /** External setter for the activeItem. */
  setActiveItem?: (item: T | null) => void;
  /** Index of the currently highlighted item. */
  highlightedIndex?: number | null;
  /** External setter for the highlightedIndex. */
  setHighlightedIndex?: (index: number | null) => void;
  /** Whether the trigger button is disabled. */
  disabled?: boolean;

  /**
   * Controlled selected value (single mode), mapped via `mapValue`.
   * If provided, the hook will use this instead of its internal T-based state.
   */
  selectedValue?: V;
  /** External setter for controlled single-mode value. */
  setSelectedValue?: (value: V) => void;

  /**
   * Controlled selected values (multiple mode), mapped via `mapValue`.
   * If provided, the hook will use these instead of its internal T-based state.
   */
  selectedValues?: V[];
  /** External setter for controlled multiple-mode values. */
  setSelectedValues?: (values: V[]) => void;
}

/**
 * Options to configure the useDropdown hook.
 *
 * @template T  the type of each option item
 * @template V  the external value type (defaults to T)
 */
export interface UseDropdownOptions<T, V = T> {
  /** 'single' for one selection, 'multiple' for multiple selections. */
  mode?: import("../autocomplete/types").Mode;

  /** Controlled vs. uncontrolled state. */
  state?: UseDropdownState<T, V>;

  /** Open menu by default. */
  defaultOpen?: boolean;
  /** Hide label visually but keep it for screen readers. */
  labelSrOnly?: boolean;
  /** Debounce delay (milliseconds) for async filtering. */
  asyncDebounceMs?: number;
  /** Items to display in the list. */
  items?: T[];
  /** Convert an item to a string for display. */
  itemToString?: (item: T) => string;
  /** Map a selected item T → external value V. Defaults to identity. */
  mapValue?: (item: T) => V;
  /** Placeholder text to show when no item is selected. */
  placeholder?: string;
  /** Async filter function receiving searchTerm and signal. */
  onFilterAsync?: (params: {
    searchTerm: string;
    signal: AbortSignal;
  }) => Promise<T[]>;
  /** Async callback when dropdown opens. */
  onOpenAsync?: (params: {
    signal: AbortSignal;
  }) => Promise<void>;
  /** Async blur callback. */
  onBlurAsync?: (params: {
    signal: AbortSignal;
  }) => Promise<void>;
  /** Callback when a value is selected (always receives the raw T). */
  onSelectItem?: (value: T) => void;
  /** Callback for clear-button clicks. */
  onClearAsync?: (params: { signal: AbortSignal }) => Promise<void>;
  /** Determine if an item should be disabled. */
  isItemDisabled?: (item: T) => boolean;
  /** Derive link props for an item (href/to/params). */
  getItemLink?: (
    item: T
  ) => string | Partial<Record<string, unknown>> | undefined;
  /** Additional action items to include. */
  actions?: import("../autocomplete/types").ActionItem[];
  /** Allow open when there are no items. */
  allowsEmptyCollection?: boolean;
  /** Tabs for top-level pre-filtering. */
  tabs?: import("../autocomplete/types").Tab<T>[];
  /** Default selected tab key. */
  defaultTabKey?: string;
  /** An optional ref for the root element. */
  rootRef?: React.RefObject<HTMLDivElement | null>;
  /** An optional ref for the listbox element. */
  listboxRef?: React.RefObject<HTMLElement | null>;
  /** An optional ref for the trigger button element. */
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  /** An optional ref for the label element. */
  labelRef?: React.RefObject<HTMLLabelElement | null>;
  /** An optional ref for the clear button element. */
  clearRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * Base return type for useDropdown.
 *
 * @template T Original item type
 * @template V Value type for selection
 * @template Item Type returned by getItems (e.g. T or T|ActionItem)
 * @template ActiveItem Type used for active state (e.g. T or T|ActionItem)
 */
export interface UseDropdownReturnBase<T, V, Item, ActiveItem> {
  /** Get the list of items to render. */
  getItems: () => Item[];

  /** Get selected item(s). */
  getSelectedItem: () => T | T[] | undefined;

  /** True if there is an active (highlighted) item. */
  hasActiveItem: () => boolean;

  /** True if the trigger button has focus. */
  isFocused: () => boolean;

  /** Props for the root <div> (combobox). */
  getRootProps: () => React.HTMLAttributes<HTMLDivElement> & {
    ref: React.Ref<HTMLDivElement>;
  } & {
    [key: `data-${string}`]: string | boolean | undefined;
  };

  /** Props for the <ul> listbox. */
  getListProps<E extends HTMLElement>(): React.HTMLAttributes<E> & {
    ref: React.Ref<E>;
  };

  /** Props for the <label>. */
  getLabelProps: () => React.LabelHTMLAttributes<HTMLLabelElement>;

  /** Props for the trigger <button>. */
  getTriggerProps: () => React.ButtonHTMLAttributes<HTMLButtonElement> & {
    [key: `data-${string}`]: string | boolean | undefined;
  };

  /** Props for the clear button. */
  getClearProps: () => React.ButtonHTMLAttributes<HTMLButtonElement> & {
    [key: `data-${string}`]: string | boolean | undefined;
  };

  /** Props for the disclosure button. */
  getDisclosureProps: () => React.ButtonHTMLAttributes<HTMLButtonElement> & {
    [key: `data-${string}`]: string | boolean | undefined;
  };

  /** Props for each <li> item. */
  getItemProps: (item: T | import("../autocomplete/types").ActionItem) => React.LiHTMLAttributes<HTMLLIElement>;

  /** State helper for an item (or action). */
  getItemState: (item: Item) => import("../autocomplete/types").ItemState;

  /** Props for a group <ul>. */
  getGroupProps: (group: import("../autocomplete/types").Group<T>) => React.HTMLAttributes<HTMLUListElement>;

  /** Props for a group heading <span>. */
  getGroupLabelProps: (
    group: import("../autocomplete/types").Group<T>
  ) => React.HTMLAttributes<HTMLSpanElement>;

  /** True if there is a selected item. */
  hasSelectedItem: () => boolean;

  /** Whether the list is open. */
  isOpen: boolean;

  /** Toggle the open state. */
  setIsOpen: (open: boolean) => void;

  /** Get or set the highlighted index. */
  getHighlightedIndex: () => number | null;
  setHighlightedIndex: (i: number | null) => void;

  /** Get or set the active item/action. */
  getActiveItem: () => ActiveItem | null;
  setActiveItem: (item: ActiveItem | null) => void;

  /** Props for item links. */
  getItemLinkProps: (
    item: T
  ) => React.AnchorHTMLAttributes<HTMLAnchorElement> & { role: "option" };

  /** Clear the selection. */
  clear: () => void;

  /** Props for the tab list container. */
  getTabListProps: () => React.HTMLAttributes<HTMLDivElement>;

  /** Props for an individual tab. */
  getTabProps: (
    tab: import("../autocomplete/types").Tab<T>,
    index: number
  ) => React.HTMLAttributes<HTMLButtonElement>;

  /** State helper for a tab. */
  getTabState: (tab: import("../autocomplete/types").Tab<T>) => import("../autocomplete/types").TabState;

  /** True if the trigger button is disabled. */
  getIsDisabled: () => boolean;

  /** Selected value getters. */
  getSelectedValue: () => V | undefined;
  getSelectedValues: () => V[] | undefined;

  /** Get the display text for the trigger button. */
  getTriggerText: () => string;
}

/**
 * Return type for useDropdown without action items.
 */
export type UseDropdownReturnNoActions<
  T,
  V = T,
> = UseDropdownReturnBase<T, V, T, T>;

/**
 * Return type for useDropdown with action items.
 */
export type UseDropdownReturnWithActions<
  T,
  V = T,
> = UseDropdownReturnBase<T, V, T | import("../autocomplete/types").ActionItem, T | import("../autocomplete/types").ActionItem>;

// ----------------------------------------------------------------
// No-actions variants: getItems(): T[], getSelectedItem(): T | T[]
// ----------------------------------------------------------------

export type UseDropdownUngroupedSingleNoActions<T, V = T> = Omit<
  UseDropdownReturnNoActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => T[];
  getSelectedItem: () => T | undefined;
};

export type UseDropdownUngroupedMultipleNoActions<T, V = T> = Omit<
  UseDropdownReturnNoActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => T[];
  getSelectedItem: () => T[];
};

export type UseDropdownGroupedSingleNoActions<T, V = T> = Omit<
  UseDropdownReturnNoActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => import("../autocomplete/types").Group<T>[];
  getSelectedItem: () => T | undefined;
};

export type UseDropdownGroupedMultipleNoActions<T, V = T> = Omit<
  UseDropdownReturnNoActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => import("../autocomplete/types").Group<T>[];
  getSelectedItem: () => T[];
};

// ----------------------------------------------------------------
// With-actions variants: getItems(): Array<T|ActionItem>, getSelectedItem(): T | T[]
// ----------------------------------------------------------------

export type UseDropdownUngroupedSingleWithActions<T, V = T> = Omit<
  UseDropdownReturnWithActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => Array<T | import("../autocomplete/types").ActionItem>;
  getSelectedItem: () => T | undefined;
};

export type UseDropdownUngroupedMultipleWithActions<T, V = T> = Omit<
  UseDropdownReturnWithActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => Array<T | import("../autocomplete/types").ActionItem>;
  getSelectedItem: () => T[];
};

export type UseDropdownGroupedSingleWithActions<T, V = T> = Omit<
  UseDropdownReturnWithActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => import("../autocomplete/types").Group<T>[];
  getSelectedItem: () => T | undefined;
};

export type UseDropdownGroupedMultipleWithActions<T, V = T> = Omit<
  UseDropdownReturnWithActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => import("../autocomplete/types").Group<T>[];
  getSelectedItem: () => T[];
};