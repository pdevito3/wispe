import React, { useCallback, useRef } from "react";
import { getTriggerId } from "../../utils/trigger-utils";
import type { ActionItem } from "../../autocomplete/types";

export interface UseTriggerOptions<T> {
  /** Currently active (highlighted) item, if any */
  activeItem: T | ActionItem | null;
  /** Full flattened list of items (including any ActionItem) */
  flattenedItems: Array<T | ActionItem>;
  /** Number of tabs configured */
  tabsCount: number;
  /** Whether empty collections may open the menu */
  allowsEmptyCollection: boolean;
  /** Set the open/closed state of the listbox */
  setIsOpen(open: boolean): void;
  /** Move focus to a particular item */
  setActiveItem(item: T | ActionItem | null): void;
  /** Centralized key‑down handler */
  handleKeyDown(e: React.KeyboardEvent<HTMLElement>): void;
  /** Callback when a real item is chosen */
  onSelect(item: T): void;
  /** Optional async callback when dropdown opens */
  onOpenAsync?: (params: {
    signal: AbortSignal;
  }) => Promise<void>;
  /** Optional async blur hook */
  onBlurAsync?: (params: {
    signal: AbortSignal;
  }) => Promise<void>;
  /** Set focus state */
  setIsFocused(isFocused: boolean): void;
  /** Whether the trigger is disabled */
  disabled?: boolean;
  /** Optional external ref for the trigger button element */
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  /** Base internal ID for the dropdown */
  internalId: string;
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Text to display on the trigger button */
  triggerText: string;
}

export function useTrigger<T>(opts: UseTriggerOptions<T>) {
  const handleTriggerClick = useCallback(
    async () => {
      if (opts.disabled) return;

      if (opts.isOpen) {
        opts.setIsOpen(false);
      } else if (opts.allowsEmptyCollection || opts.flattenedItems.length > 0) {
        opts.setIsOpen(true);
        if (opts.onOpenAsync) {
          const controller = new AbortController();
          try {
            await opts.onOpenAsync({
              signal: controller.signal,
            });
          } catch (err) {
            if (!(err instanceof Error && err.name === "AbortError")) {
              console.error(err);
            }
          }
        }
        // Auto-highlight first item when opening
        if (opts.flattenedItems.length && !opts.activeItem) {
          opts.setActiveItem(opts.flattenedItems[0]);
        }
      }
    },
    [opts]
  );

  const innerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = opts.triggerRef ?? innerTriggerRef;

  const getTriggerProps = React.useCallback(
    (): React.ButtonHTMLAttributes<HTMLButtonElement> &
      React.RefAttributes<HTMLButtonElement | null> & {
        [key: `data-${string}`]: string | boolean | undefined;
      } => ({
      id: getTriggerId(opts.internalId),
      ref: triggerRef,
      type: "button",
      disabled: opts.disabled ?? undefined,
      onClick: handleTriggerClick,
      onKeyDown: opts.handleKeyDown,
      onFocus: () => {
        opts.setIsFocused(true);
        // Don't auto-open on focus for dropdowns - only open on explicit click
      },
      onBlur: async () => {
        opts.setIsFocused(false);
        // Don't auto-close dropdown on blur - let click outside handler manage this
        
        if (opts.onBlurAsync) {
          const controller = new AbortController();
          try {
            await opts.onBlurAsync({
              signal: controller.signal,
            });
          } catch (err) {
            if (!(err instanceof Error && err.name === "AbortError")) {
              console.error(err);
            }
          }
        }
      },
      "aria-haspopup": "listbox",
      "aria-expanded": opts.isOpen,
      "aria-controls": `${opts.internalId}-listbox`,
      "aria-activedescendant":
        opts.activeItem != null
          ? `option-${opts.flattenedItems.indexOf(opts.activeItem)}`
          : undefined,
      "aria-description":
        opts.tabsCount > 0
          ? "Use Up and Down arrows to navigate options, Left and Right arrows to switch tabs, Enter to select, Escape to close."
          : "Use Up and Down arrows to navigate options, Enter to select, Escape to close.",

      // Data attributes for styling
      "data-trigger": true,
      "data-state": opts.isOpen ? "open" : "closed",
      "data-disabled": opts.disabled ? "true" : undefined,
      "data-placeholder": opts.triggerText === "" ? "true" : undefined,
    }),
    [handleTriggerClick, triggerRef, opts]
  );

  return { getTriggerProps, triggerRef };
}