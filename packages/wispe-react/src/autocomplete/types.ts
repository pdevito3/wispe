/**
 * Types and interfaces for the autocomplete component and hook.
 */

/**
 * Selection mode: 'single' for one selection or 'multiple' for several selections.
 */
export type Mode = "single" | "multiple";

/**
 * Configuration for grouping items in the list.
 */
export interface GroupingOptions<T> {
  /** Property name on item to group by. */
  key: keyof T;
  /** Optional aria-label or overall label for the group list. */
  label: string;
}

/**
 * Represents a group of items in a grouped list.
 */
export interface Group<T> {
  /** Unique identifier for this group (the group-by value). */
  key: string;
  /** Items in this group (always the entire set even if nested groups). */
  items: T[];
  /** Optional sub-groups for further levels of nesting. */
  groups?: Group<T>[];
  /** Aria-label for the group's list container. */
  label: string;

  /**
   * Props for the <ul> that allow any `data-*` attributes.
   */
  listProps: React.HTMLAttributes<HTMLUListElement> & {
    [key: `data-${string}`]: string | boolean | undefined;
  };

  header: {
    /** Text to render as the group's heading. */
    label: string;
    /**
     * Props for the <span> heading, allowing any `data-*` attributes.
     */
    headingProps: React.HTMLAttributes<HTMLSpanElement> & {
      [key: `data-${string}`]: string | boolean | undefined;
    };
  };
}

// ----------------------------------------------------------------
// ActionItem: represents “action” entries in the list (e.g., "Create new...")
// ----------------------------------------------------------------
/**
 * Represents a special action entry in the options list.
 */
export interface ActionItem {
  /** Marker so we can detect action items at runtime. */
  __isAction?: true;
  /** Text to render for this action. */
  label: string;
  /** Callback to invoke when the action is selected. */
  onAction: () => void;
  /** Placement of the action: 'top' or 'bottom' (default 'bottom'). */
  placement?: "top" | "bottom";
  /** Render only when the list of real items is empty. */
  showWhenEmpty?: boolean;
}

/**
 * Represents a pre-filtering tab in the autocomplete list.
 */
export interface Tab<T> {
  /** Unique key for this tab. */
  key: string;
  /** Text to render on the tab. */
  label: string;
  /** Optional filter to apply before other filters. */
  filter?: (item: T) => boolean;
  /** Optional custom props for the tab button. */
  tabProps?: React.HTMLAttributes<HTMLButtonElement>;
}

/**
 * Controlled state for the autocomplete hook.*
 * @template T  the type of each option item
 * @template V  the external value type (defaults to T)
 */
export interface UseAutocompleteState<T, V = T> {
  /** Current input text. */
  inputValue?: string;
  /** External setter for the inputValue. */
  setInputValue?: (value: string) => void;
  /** Whether the listbox is open. */
  isOpen?: boolean;
  /** External setter for the open state. */
  setIsOpen?: (isOpen: boolean) => void;
  /** One or more grouping definitions. */
  grouping?: GroupingOptions<T>[];
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
  /** Whether the input is disabled. */
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
 * Options to configure the useAutoComplete hook.
 *
 * @template T  the type of each option item
 * @template V  the external value type (defaults to T)
 */
export interface UseAutoCompleteOptions<T, V = T> {
  /** 'single' for one selection, 'multiple' for multiple selections. */
  mode?: Mode;

  /** Controlled vs. uncontrolled state. */
  state?: UseAutocompleteState<T, V>;

  /** Open menu by default. */
  defaultOpen?: boolean;
  /** Hide label visually but keep it for screen readers. */
  labelSrOnly?: boolean;
  /** Debounce delay (milliseconds) for async filtering. */
  asyncDebounceMs?: number;
  /** Allow values not present in the list. */
  allowsCustomItems?: boolean;
  /** Items to display in the list. */
  items?: T[];
  /** Convert an item to a string for display. */
  itemToString?: (item: T) => string;
  /** Map a selected item T → external value V. Defaults to identity. */
  mapValue?: (item: T) => V;
  /** Sync callback when input value changes. */
  onInputValueChange?: (value: string) => void;
  /** Async filter function receiving searchTerm and signal. */
  onFilterAsync?: (params: {
    searchTerm: string;
    signal: AbortSignal;
  }) => Promise<T[]>;
  /** Async input-change callback receiving value and signal. */
  onInputValueChangeAsync?: (params: {
    value: string;
    signal: AbortSignal;
  }) => Promise<void>;
  /** Async blur callback receiving value and signal. */
  onBlurAsync?: (params: {
    value: string;
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
  actions?: ActionItem[];
  /** Allow open when there are no items. */
  allowsEmptyCollection?: boolean;
  /** Tabs for top-level pre-filtering. */
  tabs?: Tab<T>[];
  /** Default selected tab key. */
  defaultTabKey?: string;
  /** An optional ref for the root element. */
  rootRef?: React.RefObject<HTMLDivElement | null>;
  /** An optional ref for the listbox element. */
  listboxRef?: React.RefObject<HTMLElement | null>;
  /** An optional ref for the input element. */
  inputRef?: React.RefObject<HTMLInputElement | null>;
  /** An optional ref for the label element. */
  labelRef?: React.RefObject<HTMLLabelElement | null>;
  /** An optional ref for the clear button element. */
  clearRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * State shape for an individual item.
 */
export interface ItemState {
  /** True if the item is active (highlighted). */
  isActive: boolean;
  /** True if the item is selected. */
  isSelected: boolean;
  /** True if the item is disabled. */
  isDisabled: boolean;
  /** True if the entry is an action item. */
  isAction: boolean;
}

/**
 * State shape for an individual tab.
 */
export interface TabState {
  /** True if this tab is selected. */
  isSelected: boolean;
  /** True if this tab is disabled. */
  isDisabled: boolean;
  /** Number of items under this tab. */
  itemCount: number;
}

// ----------------------------------------------------------------
// 1) Define two distinct return types:
//    - NoActions → getItems(): T[]
//    - WithActions → getItems(): Array<T|ActionItem>
// ----------------------------------------------------------------

/**
 * Base return type for useAutoComplete.
 *
 * @template T Original item type
 * @template V Value type for selection
 * @template Item Type returned by getItems (e.g. T or T|ActionItem)
 * @template ActiveItem Type used for active state (e.g. T or T|ActionItem)
 */
export interface UseAutoCompleteReturnBase<T, V, Item, ActiveItem> {
  /** Get the list of items to render. */
  getItems: () => Item[];

  /** Get selected item(s). */
  getSelectedItem: () => T | T[] | undefined;

  /** True if there is an active (highlighted) item. */
  hasActiveItem: () => boolean;

  /** True if the input or list has focus. */
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

  /** Props for the <input>. */
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement> & {
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
  getItemProps: (item: T | ActionItem) => React.LiHTMLAttributes<HTMLLIElement>;

  /** State helper for an item (or action). */
  getItemState: (item: Item) => ItemState;

  /** Props for a group <ul>. */
  getGroupProps: (group: Group<T>) => React.HTMLAttributes<HTMLUListElement>;

  /** Props for a group heading <span>. */
  getGroupLabelProps: (
    group: Group<T>
  ) => React.HTMLAttributes<HTMLSpanElement>;

  /** True if there is a selected item. */
  hasSelectedItem: () => boolean;

  /** Whether the list is open. */
  isOpen: boolean;

  /** Toggle the open state. */
  setIsOpen: (open: boolean) => void;

  /** Detect custom input values. */
  isCustomItem: (item: T) => boolean;

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

  /** Clear the input and selection. */
  clear: () => void;

  /** Props for the tab list container. */
  getTabListProps: () => React.HTMLAttributes<HTMLDivElement>;

  /** Props for an individual tab. */
  getTabProps: (
    tab: Tab<T>,
    index: number
  ) => React.HTMLAttributes<HTMLButtonElement>;

  /** State helper for a tab. */
  getTabState: (tab: Tab<T>) => TabState;

  /** Get or set the input value (used for tabs). */
  getInputValue: () => string;
  setInputValue: (value: string) => void;

  /** True if the input is disabled. */
  getIsDisabled: () => boolean;

  /** Selected value getters. */
  getSelectedValue: () => V | undefined;
  getSelectedValues: () => V[] | undefined;
}

/**
 * Return type for useAutoComplete without action items.
 */
export type UseAutoCompleteReturnNoActions<
  T,
  V = T,
> = UseAutoCompleteReturnBase<T, V, T, T>;
/**
 * Return type for useAutoComplete with action items.
 */
export type UseAutoCompleteReturnWithActions<
  T,
  V = T,
> = UseAutoCompleteReturnBase<T, V, T | ActionItem, T | ActionItem>;

// ----------------------------------------------------------------
// No-actions variants: getItems(): T[], getSelectedItem(): T | T[]
// ----------------------------------------------------------------

export type UseAutoCompleteUngroupedSingleNoActions<T, V = T> = Omit<
  UseAutoCompleteReturnNoActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => T[];
  getSelectedItem: () => T | undefined;
};

export type UseAutoCompleteUngroupedMultipleNoActions<T, V = T> = Omit<
  UseAutoCompleteReturnNoActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => T[];
  getSelectedItem: () => T[];
};

export type UseAutoCompleteGroupedSingleNoActions<T, V = T> = Omit<
  UseAutoCompleteReturnNoActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => Group<T>[];
  getSelectedItem: () => T | undefined;
};

export type UseAutoCompleteGroupedMultipleNoActions<T, V = T> = Omit<
  UseAutoCompleteReturnNoActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => Group<T>[];
  getSelectedItem: () => T[];
};

// ----------------------------------------------------------------
// With-actions variants: getItems(): Array<T|ActionItem>, getSelectedItem(): T | T[]
// ----------------------------------------------------------------

export type UseAutoCompleteUngroupedSingleWithActions<T, V = T> = Omit<
  UseAutoCompleteReturnWithActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => Array<T | ActionItem>;
  getSelectedItem: () => T | undefined;
};

export type UseAutoCompleteUngroupedMultipleWithActions<T, V = T> = Omit<
  UseAutoCompleteReturnWithActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => Array<T | ActionItem>;
  getSelectedItem: () => T[];
};

export type UseAutoCompleteGroupedSingleWithActions<T, V = T> = Omit<
  UseAutoCompleteReturnWithActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => Group<T>[];
  getSelectedItem: () => T | undefined;
};

export type UseAutoCompleteGroupedMultipleWithActions<T, V = T> = Omit<
  UseAutoCompleteReturnWithActions<T, V>,
  "getItems" | "getSelectedItem"
> & {
  getItems: () => Group<T>[];
  getSelectedItem: () => T[];
};
