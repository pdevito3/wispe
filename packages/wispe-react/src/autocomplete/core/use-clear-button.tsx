// autocomplete/core/useClearButton.tsx
import React, { useCallback, useRef } from "react";

export interface UseClearButtonOptions<T, V> {
  /** current input text */
  inputValue: string;
  /** single-select value (if mode = single) */
  selectedItem?: T;
  /** multi-select values (if mode = multiple) */
  selectedItems: T[];
  /** 'single' or 'multiple' */
  mode: "single" | "multiple";
  /** async clear that fires when the selected value is cleared */
  onClearAsync?: (params: { signal: AbortSignal }) => Promise<void>;
  /** reset the input text */
  setInputValue(value: string): void;
  /** reset the single-select value */
  setSelectedItem?(value: T | undefined): void;
  /** reset the multi-select values */
  setSelectedItems?(values: T[]): void;
  /** clear any active/highlighted item */
  setActiveItem(item: T | null): void;
  /** close the listbox */
  setIsOpen(open: boolean): void;
  /** Optional external ref for the clear button element */
  clearRef?: React.RefObject<HTMLButtonElement | null>;
  /** Base internal ID for the autocomplete */
  internalId: string;
}

export function useClearButton<T, V = T>(opts: UseClearButtonOptions<T, V>) {
  const abortControllerRef = useRef<AbortController | null>(null);
  // always call hook
  const innerClearRef = useRef<HTMLButtonElement | null>(null);
  const clearRef = opts.clearRef ?? innerClearRef;

  const handleClear = useCallback(async () => {
    // reset UI state first
    opts.setInputValue("");
    if (opts.mode === "single") {
      opts.setSelectedItem?.(undefined);
    } else {
      opts.setSelectedItems?.([]);
    }

    // abort any in-flight clear
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (opts.onClearAsync) {
      try {
        await opts.onClearAsync({ signal: controller.signal });
      } catch (err) {
        // ignore only user-aborted calls
        if (!(err instanceof Error && err.name === "AbortError")) {
          console.error(err);
        }
      }
    }

    opts.setActiveItem(null);
    opts.setIsOpen(false);
  }, [opts]);

  const getClearProps =
    useCallback((): React.ButtonHTMLAttributes<HTMLButtonElement> &
      React.RefAttributes<HTMLButtonElement> & {
        [key: `data-${string}`]: string | boolean | undefined;
      } => {
      const disabled =
        opts.inputValue === "" &&
        (opts.mode === "single"
          ? !opts.selectedItem
          : opts.selectedItems.length === 0);

      return {
        id: `${opts.internalId}-clear-button`,
        ref: clearRef,
        type: "button",
        "aria-label": "Clear input",
        onClick: handleClear,
        disabled,
        "data-clear-button": true,
        "data-disabled": disabled ? "true" : undefined,
      };
    }, [
      opts.inputValue,
      opts.mode,
      opts.selectedItem,
      opts.selectedItems.length,
      opts.internalId,
      clearRef,
      handleClear,
    ]);

  return { getClearProps, handleClear, clearRef };
}
