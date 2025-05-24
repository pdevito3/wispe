import React from "react";
import type { ActionItem, Group, GroupingOptions, Tab } from "../types";

export function useGrouping<T>({
  allowsCustomItems,
  inputValue,
  itemToString,
  actions,
  grouping,
  items,
  tabs,
  activeTabIndex,
}: {
  allowsCustomItems: boolean;
  inputValue: string;
  itemToString: (item: T) => string;
  actions?: ActionItem[];
  grouping?: GroupingOptions<T>[];
  items: T[];
  tabs: Tab<T>[];
  activeTabIndex: number;
}) {
  // Normalize the grouping definitions array
  const groupingOptions = React.useMemo(
    () => (Array.isArray(grouping) ? grouping : grouping ? [grouping] : []),
    [grouping]
  );

  // Recursively create nested groups exactly as in the original hook
  const createGroups = React.useCallback(
    (itemsToGroup: T[], level = 0): Group<T>[] => {
      if (level >= groupingOptions.length) return [];
      const { key: propKey, label: propLabel } = groupingOptions[level];
      const map = itemsToGroup.reduce<Record<string, T[]>>((acc, item) => {
        const raw = item[propKey];
        const k = String(raw ?? "");
        (acc[k] ??= []).push(item);
        return acc;
      }, {});

      return Object.entries(map).map(([groupKey, groupItems]) => {
        const sub = createGroups(groupItems, level + 1);
        const grp: Group<T> = {
          key: groupKey,
          items: groupItems,
          label: propLabel,
          listProps: {
            role: "group",
            "aria-label": propLabel,
            "data-group": true,
            "data-group-key": groupKey,
            "data-group-level": level.toString(),
            "data-has-subgroups": sub.length > 0 ? "true" : undefined,
          },
          header: {
            label: groupKey,
            headingProps: {
              role: "presentation",
              "data-group-label": true,
              "data-group-key": groupKey,
            },
          },
        };
        if (sub.length) grp.groups = sub;
        return grp;
      });
    },
    [groupingOptions]
  );

  // Flatten nested groups back to a flat list
  const flattenGroups = React.useCallback((groupsList: Group<T>[]): T[] => {
    return groupsList.reduce<T[]>(
      (acc, grp) =>
        grp.groups && grp.groups.length
          ? acc.concat(flattenGroups(grp.groups))
          : acc.concat(grp.items),
      []
    );
  }, []);

  // Compute grouped structure and flattened items
  // const grouped = groupingOptions.length ? createGroups(filteredItems) : [];
  const grouped = React.useMemo(
    () => (groupingOptions.length ? createGroups(items) : []),
    [items, groupingOptions, createGroups]
  );

  // Apply tab‐level filter before other filters
  const filteredTabItems: T[] =
    tabs.length && activeTabIndex >= 0
      ? items.filter((item) =>
          tabs[activeTabIndex].filter
            ? tabs[activeTabIndex].filter!(item)
            : true
        )
      : items;

  // ---- ungrouped items + optional “create custom” item as before ----
  const ungroupedItemsWithCustom: T[] = (() => {
    if (
      allowsCustomItems &&
      inputValue.trim() !== "" &&
      !filteredTabItems.some((it) => itemToString(it) === inputValue)
    ) {
      return [...filteredTabItems, inputValue as unknown as T];
    }
    return filteredTabItems;
  })();

  // ---- now weave in any ActionItem[] from options.actions ----  // ----------------------------------------------------------------
  // New: auto‑inject the __isAction flag on every action item
  // ----------------------------------------------------------------
  const builtActions: ActionItem[] = (actions ?? []).map((a) => ({
    ...a,
    __isAction: true as const,
  }));
  const ungroupedWithActions: Array<T | ActionItem> = (() => {
    const base = ungroupedItemsWithCustom;
    // filter out “empty‐only” if we have items
    const visible = builtActions.filter(
      (a) => !a.showWhenEmpty || base.length === 0
    );
    const top = visible.filter((a) => a.placement === "top");
    const bottom = visible.filter((a) => a.placement !== "top");
    return [...top, ...base, ...bottom];
  })();

  // ---- final flattenedItems now includes real items + ActionItems ----
  const flattenedItems: Array<T | ActionItem> = groupingOptions.length
    ? (flattenGroups(grouped) as Array<T | ActionItem>)
    : ungroupedWithActions;

  return {
    grouped,
    flattenedItems,
    groupingOptions,
    ungroupedWithActions,
  };
}
