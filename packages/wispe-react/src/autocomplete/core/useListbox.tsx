import React, { useRef } from "react";

export interface UseListboxOptions {
  /** Whether the menu is open */
  isOpen: boolean;
  /** Accessible label for the listbox */
  label: string;
  /** True when there is at least one grouping level */
  hasGroups: boolean;
  /** True when the list of items is empty */
  isEmpty: boolean;
  /** Number of items (flattened) */
  size: number;
}

export function useListbox(opts: UseListboxOptions) {
  const listboxRef = useRef<HTMLUListElement | null>(null);
  const getListProps = React.useCallback(
    () => ({
      id: "autocomplete-listbox",
      role: "listbox",
      "aria-label": opts.label,
      ref: listboxRef,
      tabIndex: -1,
      "data-listbox": true,
      "data-state": opts.isOpen ? "open" : "closed",
      "data-has-groups": opts.hasGroups ? "true" : undefined,
      "data-empty": opts.isEmpty ? "true" : undefined,
      "data-size": opts.size,
    }),
    [opts.isOpen, opts.label, opts.hasGroups, opts.isEmpty, opts.size]
  );

  return { getListProps, listboxRef };
}
