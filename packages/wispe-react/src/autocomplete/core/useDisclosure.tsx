import React from "react";

export interface UseDisclosureOptions {
  /** whether the listbox is currently open */
  isOpen: boolean;
  /** allow opening even when empty */
  allowsEmptyCollection: boolean;
  /** number of flattened items in the list */
  itemsLength: number;
  /** toggle open/closed */
  setIsOpen(open: boolean): void;
}

export function useDisclosure(opts: UseDisclosureOptions) {
  const handleDisclosure = React.useCallback(() => {
    if (opts.isOpen) {
      opts.setIsOpen(false);
    } else if (opts.allowsEmptyCollection || opts.itemsLength > 0) {
      opts.setIsOpen(true);
    }
  }, [opts]);

  const getDisclosureProps = React.useCallback(
    (): React.ButtonHTMLAttributes<HTMLButtonElement> & {
      [key: `data-${string}`]: string | boolean | undefined;
    } => ({
      type: "button",
      "aria-label": opts.isOpen ? "Close options" : "Open options",
      onClick: handleDisclosure,
      "data-disclosure-button": true,
      "data-state": opts.isOpen ? "open" : "closed",
    }),
    [opts.isOpen, handleDisclosure]
  );

  return { getDisclosureProps };
}
