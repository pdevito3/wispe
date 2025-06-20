import { useCallback, useEffect, useRef } from "react";

export function useAutocompleteRoot<T>({
  isOpen,
  isFocused,
  mode,
  selectedItem,
  selectedItems,
  inputValue,
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
  inputValue: string;
  setIsOpen: (isOpen: boolean) => void;
  setActiveItem: (item: T | null) => void;
  setHighlightedIndex: (index: number | null) => void;
  /** Optional external ref for the root element */
  rootRef?: React.RefObject<HTMLDivElement | null>;
  /** Base internal ID for the autocomplete */
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
      "aria-controls": id,
      "data-combobox": true,
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
      "data-has-value": inputValue.trim() !== "" ? "true" : undefined,
    };
  }, [
    rootRef,
    internalId,
    isOpen,
    isFocused,
    mode,
    selectedItems.length,
    selectedItem,
    inputValue,
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
