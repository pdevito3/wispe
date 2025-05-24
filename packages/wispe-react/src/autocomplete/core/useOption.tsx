import React, { useCallback, useEffect } from "react";
import type { ActionItem, Mode, OptionState } from "../types";

export function useOption<T>({
  items,
  activeItem,
  selectedItem,
  selectedItems,
  isItemDisabled,
  isCustomItem,
  onSelect,
  mode,
  flattenedItems,
  getItemLink,
  setActiveItem,
  optionRefs,
  close,
}: {
  /** the full, flattened list (including any ActionItem entries) */
  items: Array<T | ActionItem>;
  /** the currently active/highlighted entry */
  activeItem: T | ActionItem | null;
  /** single‑select value */
  selectedItem?: T;
  /** multi‑select values */
  selectedItems?: T[];
  /** pick up disabled state for real items */
  isItemDisabled(item: T): boolean;
  /** detect if a real item is the “custom value” */
  isCustomItem(item: T): boolean;
  /** callback when a real item is chosen */
  onSelect(item: T): void;
  /** the mode of the autocomplete */
  mode: Mode;
  flattenedItems: Array<T | ActionItem>;
  getItemLink?: (
    item: T
  ) => string | Partial<Record<string, unknown>> | undefined;
  setActiveItem(item: T | ActionItem): void;
  optionRefs: React.RefObject<Array<HTMLLIElement | null>>;
  close: () => void;
}) {
  const getItemProps = useCallback(
    (item: T | ActionItem) => {
      // compute index up‐front so both branches can use it
      const index = items.findIndex((i) => i === item);

      // --- action entries ---
      if ((item as ActionItem).__isAction) {
        const action = item as ActionItem;
        return {
          role: "option",
          "data-action-item": true,
          "aria-label": action.label,
          tabIndex: 0,
          onClick: () => action.onAction(),
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              action.onAction();
            }
          },
          // store ref for scrolling
          ref: (el: HTMLLIElement | null) => {
            optionRefs.current[index] = el;
          },
        };
      }

      // --- listbox entries ---
      const nonActionItem = item as T;
      const disabled = isItemDisabled(nonActionItem);
      const isActive = item === activeItem;
      const isSelected =
        mode === "multiple"
          ? Boolean(selectedItems?.includes(nonActionItem))
          : nonActionItem === selectedItem;
      const custom = isCustomItem(nonActionItem);

      return {
        role: "option",
        id: `option-${index}`,
        "aria-posinset": index + 1,
        "aria-setsize": items.length,
        "aria-selected": isSelected,
        "aria-disabled": disabled,
        "data-active": isActive ? "true" : undefined,
        "data-selected": isSelected ? "true" : undefined,
        "data-index": index,
        "data-custom": custom ? "true" : undefined,
        disabled,
        "data-disabled": disabled ? "true" : undefined,
        onClick: disabled ? undefined : () => onSelect(nonActionItem),
        ref: (el: HTMLLIElement | null) => {
          optionRefs.current[index] = el;
        },
      };
    },
    [
      items,
      isItemDisabled,
      activeItem,
      mode,
      selectedItems,
      selectedItem,
      isCustomItem,
      optionRefs,
      onSelect,
    ]
  );

  const getItemState = useCallback(
    (item: T | ActionItem): OptionState => {
      // always treat actions as their own state
      if ((item as ActionItem).__isAction) {
        return {
          isActive: false,
          isDisabled: false,
          isSelected: false,
          isAction: true,
        };
      }

      const nonActionItem = item as T;
      const disabled = isItemDisabled(nonActionItem);
      const selected =
        mode === "multiple"
          ? Boolean(selectedItems?.includes(nonActionItem))
          : nonActionItem === selectedItem;

      return {
        isActive: item === activeItem,
        isDisabled: disabled,
        isSelected: selected,
        isAction: false,
      };
    },
    [activeItem, isItemDisabled, mode, selectedItem, selectedItems]
  );

  const getItemLinkProps = useCallback(
    (item: T): Record<string, unknown> & { role: "option" } => {
      const index = flattenedItems.findIndex((i) => i === item);
      const disabled = isItemDisabled(item);
      const isSelected =
        mode === "multiple"
          ? selectedItems?.includes(item) || false
          : item === selectedItem;

      // user‑returned link value
      const linkResult = getItemLink?.(item);
      // build base props: if string, treat as href; else spread object
      const linkProps: Record<string, unknown> =
        typeof linkResult === "string"
          ? { href: linkResult }
          : linkResult && typeof linkResult === "object"
          ? { ...linkResult }
          : {};

      return {
        role: "option",
        "aria-selected": isSelected,
        "aria-posinset": index + 1,
        "aria-setsize": flattenedItems.length,
        "aria-disabled": disabled || undefined,
        id: `option-${index}`,
        tabIndex: disabled ? -1 : 0,

        // spread whatever the consumer needs (href, to, params, etc)
        ...linkProps,

        onClick: !disabled
          ? (e: React.MouseEvent) => {
              // don't use handleSelect(item) for link
              e.stopPropagation();
              close();
            }
          : undefined,
      };
    },
    [
      flattenedItems,
      isItemDisabled,
      mode,
      selectedItems,
      selectedItem,
      getItemLink,
    ]
  );

  // Automatically highlight when exactly one option remains
  useEffect(() => {
    // only run when there's exactly one item and it isn’t already active
    if (flattenedItems.length === 1 && activeItem !== flattenedItems[0]) {
      setActiveItem(flattenedItems[0] as T | ActionItem);
    }
  }, [flattenedItems, activeItem, setActiveItem]);

  return { getItemProps, getItemState, getItemLinkProps };
}
