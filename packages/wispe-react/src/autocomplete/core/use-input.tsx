import React, { useCallback, useRef } from "react";
import { getInputId } from "../../utils/input-utils";

export interface UseInputOptions<T> {
  /** Current input text */
  inputValue: string;
  /** Centralized key‑down handler */
  handleKeyDown(e: React.KeyboardEvent<HTMLElement>): void;
  /** Currently active (highlighted) item, if any */
  activeItem: T | null;
  /** Full flattened list of items (including any ActionItem) */
  flattenedItems: Array<T>;
  /** Number of tabs configured */
  tabsCount: number;
  /** Whether empty collections may open the menu */
  allowsEmptyCollection: boolean;
  /** Set the open/closed state of the listbox */
  setIsOpen(open: boolean): void;
  /** Move focus to a particular item */
  setActiveItem(item: T | null): void;
  /** Ref to the latest async filter function */
  onFilterAsyncRef: React.RefObject<
    | ((params: { searchTerm: string; signal: AbortSignal }) => Promise<T[]>)
    | undefined
  >;
  /** Debounced call into async filter */
  debouncedAsyncOperation(value: string): Promise<void>;
  /** Optional async blur hook */
  onBlurAsync?: (params: {
    value: string;
    signal: AbortSignal;
  }) => Promise<void>;

  onInputValueChangeAsync?: (params: {
    value: string;
    signal: AbortSignal;
  }) => Promise<void>;
  onInputValueChange?: (value: string) => void;
  setInputValue(value: string): void;
  setIsFocused(isFocused: boolean): void;
  disabled?: boolean;
  /** Optional external ref for the input element */
  inputRef?: React.RefObject<HTMLInputElement>;
  /** Base internal ID for the autocomplete */
  internalId: string;
}

export function useInput<T>(opts: UseInputOptions<T>) {
  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      opts.setInputValue(v);
      opts.onInputValueChange?.(v);

      if (opts.onInputValueChangeAsync) {
        const controller = new AbortController();
        try {
          await opts.onInputValueChangeAsync({
            value: v,
            signal: controller.signal,
          });
        } catch (err) {
          if (!(err instanceof Error && err.name === "AbortError")) {
            console.error(err);
          }
        }
      }
    },
    [opts]
  );

  const innerInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = opts.inputRef ?? innerInputRef;

  const getInputProps = React.useCallback(
    (): React.InputHTMLAttributes<HTMLInputElement> &
      React.RefAttributes<HTMLInputElement> & {
        [key: `data-${string}`]: string | boolean | undefined;
      } => ({
      id: getInputId(opts.internalId),
      ref: inputRef,
      value: opts.inputValue,
      disabled: opts.disabled ?? undefined,
      onChange: handleInputChange,
      onKeyDown: opts.handleKeyDown,
      onFocus: async () => {
        opts.setIsFocused(true);
        if (opts.onFilterAsyncRef.current) {
          await opts.debouncedAsyncOperation(opts.inputValue);
        }
        // only open if we have items or it's explicitly allowed
        if (opts.allowsEmptyCollection || opts.flattenedItems.length > 0) {
          opts.setIsOpen(true);
          if (opts.flattenedItems.length && !opts.activeItem) {
            opts.setActiveItem(opts.flattenedItems[0]);
          }
        }
      },
      onBlur: async () => {
        opts.setIsFocused(false);
        if (opts.onBlurAsync) {
          const controller = new AbortController();
          try {
            await opts.onBlurAsync({
              value: opts.inputValue,
              signal: controller.signal,
            });
          } catch (err) {
            if (!(err instanceof Error && err.name === "AbortError")) {
              console.error(err);
            }
          }
        }
      },
      autoComplete: "off",
      "aria-autocomplete": "list",
      "aria-controls": getInputId(opts.internalId),
      "aria-activedescendant":
        opts.activeItem != null
          ? `option-${opts.flattenedItems.indexOf(opts.activeItem)}`
          : undefined,
      "aria-description":
        opts.tabsCount > 0
          ? "Use Up and Down arrows to navigate options, Left and Right arrows to switch tabs, Enter to select, Escape to close."
          : "Use Up and Down arrows to navigate options, Enter to select, Escape to close.",

      // now allowed by our index‑signature
      "data-input": true,
      "data-value": opts.inputValue,
      "data-has-value": opts.inputValue.trim() !== "" ? "true" : undefined,
      "data-autocomplete": "list",
      "aria-disabled": opts.disabled ? "true" : undefined,
    }),
    [handleInputChange, inputRef, opts]
  );

  return { getInputProps, inputRef };
}
