import { useCallback } from "react";
import type { Tab, TabState } from "../types";

export function useTabs<T>({
  tabRefs,
  activeTabIndex,
  items,
  tabs,
  setActiveTabIndex,
  handleKeyDown,
  internalId,
}: {
  tabRefs: React.RefObject<Array<HTMLButtonElement | null>>;
  activeTabIndex: number;
  items: T[];
  tabs: Tab<T>[];
  setActiveTabIndex: (index: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  /** Base internal ID for the autocomplete */
  internalId: string;
}) {
  const getTabProps = useCallback(
    (tab: Tab<T>, index: number) => ({
      role: "tab",
      id: `${internalId}-tab-${index}`,
      "aria-selected": index === activeTabIndex || undefined,
      tabIndex: index === activeTabIndex ? 0 : -1,
      onClick: () => setActiveTabIndex(index),
      onKeyDown: handleKeyDown,
      // store the ref for focusing in useNavigation
      ref: (el: HTMLButtonElement | null) => {
        tabRefs.current[index] = el;
      },
      ...tab.tabProps,
    }),
    [activeTabIndex, handleKeyDown, internalId, setActiveTabIndex, tabRefs]
  );

  const getTabListProps = useCallback(
    () => ({
      role: "tablist",
      "data-tablist": true,
    }),
    []
  );

  const getTabState = useCallback(
    (tab: Tab<T>): TabState => ({
      isSelected: tab.key === tabs[activeTabIndex].key,
      isDisabled: false,
      itemCount: items.filter((item) => (tab.filter ? tab.filter(item) : true))
        .length,
    }),
    [activeTabIndex, items, tabs]
  );

  return { getTabProps, getTabListProps, getTabState, tabRefs };
}
