import { useCallback, useEffect, useRef } from "react";
import type { ActionItem } from "../../autocomplete/types";

export function useDropdownRoot<T>({
  isOpen,
  isFocused,
  mode,
  selectedItem,
  selectedItems,
  setIsOpen,
  setActiveItem,
  setHighlightedIndex,
  rootRef: rootRefProp,
  internalId,
}: {
  isOpen: boolean;
  isFocused: boolean;
  mode: "single" | "multiple";
  selectedItem?: T;
  selectedItems: T[];
  setIsOpen: (isOpen: boolean) => void;
  setActiveItem: (item: T | ActionItem | null) => void;
  setHighlightedIndex: (index: number | null) => void;
  /** Optional external ref for the root element */
  rootRef?: React.RefObject<HTMLDivElement | null>;
  /** Base internal ID for the dropdown */
  internalId: string;
}) {
  const innerRootRef = useRef<HTMLDivElement | null>(null);
  const rootRef = rootRefProp ?? innerRootRef;

  const getRootProps = useCallback((): React.HTMLAttributes<HTMLDivElement> & {
    ref: React.Ref<HTMLDivElement | null>;
  } & { [key: `data-${string}`]: string | boolean | undefined } => {
    const id = `${internalId}-root`;

    return {
      ref: rootRef,
      id: id,
      role: "combobox",
      "aria-expanded": isOpen,
      "aria-haspopup": "listbox",
      "aria-controls": `${internalId}-listbox`,
      "data-dropdown": true,
      "data-expanded": isOpen ? true : false,
      "data-focused": isFocused ? true : undefined,
      "data-mode": mode,
      "data-has-selected":
        mode === "multiple"
          ? selectedItems.length > 0
            ? "true"
            : undefined
          : selectedItem
            ? "true"
            : undefined,
    };
  }, [
    rootRef,
    internalId,
    isOpen,
    isFocused,
    mode,
    selectedItems.length,
    selectedItem,
  ]);

  // Close the listbox when clicking outside
  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveItem(null);
        setHighlightedIndex(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [setIsOpen, setActiveItem, setHighlightedIndex, rootRef]);

  return { getRootProps, rootRef };
}