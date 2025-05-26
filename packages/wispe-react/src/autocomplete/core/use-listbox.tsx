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
  /** Optional external ref for the listbox */
  listboxRef?: React.RefObject<HTMLElement>;
  /** Base internal ID for the autocomplete */
  internalId: string;
}

export function useListbox(opts: UseListboxOptions) {
  const innerListboxRef = useRef<HTMLElement | null>(null);
  const listboxRef = opts.listboxRef ?? innerListboxRef;

  const getListProps = React.useCallback(
    () => ({
      id: `${opts.internalId}-listbox`,
      ref: listboxRef,
      role: "listbox",
      "aria-label": opts.label,
      tabIndex: -1,
      "data-listbox": true,
      "data-state": opts.isOpen ? "open" : "closed",
      "data-has-groups": opts.hasGroups ? "true" : undefined,
      "data-empty": opts.isEmpty ? "true" : undefined,
      "data-size": opts.size,
    }),
    [
      opts.internalId,
      opts.label,
      opts.isOpen,
      opts.hasGroups,
      opts.isEmpty,
      opts.size,
      listboxRef,
    ]
  );

  return { getListProps, listboxRef };
}
