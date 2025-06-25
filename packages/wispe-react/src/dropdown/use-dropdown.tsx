import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useStableId } from "../hooks/use-id";
import { useActiveItem } from "../autocomplete/core/use-active-item";
import { useClearButton } from "../autocomplete/core/use-clear-button";
import { useDisclosure } from "../autocomplete/core/use-disclosure-button";
import { useLabel } from "../autocomplete/core/use-label";
import { useListbox } from "../autocomplete/core/use-listbox";
import { useOption } from "../autocomplete/core/use-option";
import { useDropdownRoot } from "./core/use-root";
import { useTrigger } from "./core/use-trigger";
import { useFiltering } from "../autocomplete/features/use-filtering";
import { useGroup } from "../autocomplete/features/use-group";
import { useGrouping } from "../autocomplete/features/use-grouping";
import { useNavigation } from "../autocomplete/features/use-navigation";
import { useTabs } from "../autocomplete/features/use-tabs";
import type {
  ActionItem,
  GroupingOptions,
  UseDropdownGroupedMultipleNoActions,
  UseDropdownGroupedMultipleWithActions,
  UseDropdownGroupedSingleNoActions,
  UseDropdownGroupedSingleWithActions,
  UseDropdownOptions,
  UseDropdownUngroupedMultipleNoActions,
  UseDropdownUngroupedMultipleWithActions,
  UseDropdownUngroupedSingleNoActions,
  UseDropdownUngroupedSingleWithActions,
} from "./types";

export function useDropdown<T, V = T>(
  options: UseDropdownOptions<T, V> & {
    actions?: undefined;
    state?: { grouping?: undefined };
    mode?: "single";
  }
): UseDropdownUngroupedSingleNoActions<T, V>;

export function useDropdown<T, V = T>(
  options: UseDropdownOptions<T, V> & {
    actions?: undefined;
    state?: { grouping?: undefined };
    mode: "multiple";
  }
): UseDropdownUngroupedMultipleNoActions<T, V>;

export function useDropdown<T, V = T>(
  options: UseDropdownOptions<T, V> & {
    actions?: undefined;
    state: { grouping: GroupingOptions<T>[] };
    mode?: "single";
  }
): UseDropdownGroupedSingleNoActions<T, V>;

export function useDropdown<T, V = T>(
  options: UseDropdownOptions<T, V> & {
    actions?: undefined;
    state: { grouping: GroupingOptions<T>[] };
    mode: "multiple";
  }
): UseDropdownGroupedMultipleNoActions<T, V>;

export function useDropdown<T, V = T>(
  options: UseDropdownOptions<T, V> & {
    actions: ActionItem[];
    state?: { grouping?: undefined };
    mode?: "single";
  }
): UseDropdownUngroupedSingleWithActions<T, V>;

export function useDropdown<T, V = T>(
  options: UseDropdownOptions<T, V> & {
    actions: ActionItem[];
    state?: { grouping?: undefined };
    mode: "multiple";
  }
): UseDropdownUngroupedMultipleWithActions<T, V>;

export function useDropdown<T, V = T>(
  options: UseDropdownOptions<T, V> & {
    actions: ActionItem[];
    state: { grouping: GroupingOptions<T>[] };
    mode?: "single";
  }
): UseDropdownGroupedSingleWithActions<T, V>;

export function useDropdown<T, V = T>(
  options: UseDropdownOptions<T, V> & {
    actions: ActionItem[];
    state: { grouping: GroupingOptions<T>[] };
    mode: "multiple";
  }
): UseDropdownGroupedMultipleWithActions<T, V>;

export function useDropdown<T, V = T>({
  mode: modeProp = "single",
  state = {},
  defaultOpen = false,
  labelSrOnly = false,
  asyncDebounceMs = 0,
  placeholder = "",
  onSelectItem,
  onOpenAsync,
  onBlurAsync,
  items: itemsProp = [],
  onFilterAsync,
  itemToString,
  onClearAsync,
  isItemDisabled: isItemDisabledProp,
  getItemLink,
  actions,
  allowsEmptyCollection = false,
  tabs = [],
  defaultTabKey,
  rootRef: rootRefProp,
  listboxRef: listboxRefProp,
  triggerRef: triggerRefProp,
  labelRef: labelRefProp,
  clearRef: clearRefProp,
  mapValue = (item: T) => item as unknown as V,
}: UseDropdownOptions<T, V>):
  | UseDropdownUngroupedSingleNoActions<T>
  | UseDropdownUngroupedMultipleNoActions<T>
  | UseDropdownGroupedSingleNoActions<T>
  | UseDropdownGroupedMultipleNoActions<T>
  | UseDropdownUngroupedSingleWithActions<T>
  | UseDropdownUngroupedMultipleWithActions<T>
  | UseDropdownGroupedSingleWithActions<T>
  | UseDropdownGroupedMultipleWithActions<T> {
  const mode = modeProp;

  const {
    isOpen: isOpenProp,
    setIsOpen: setIsOpenProp,
    activeItem: activeItemProp,
    setActiveItem: setActiveItemProp,
    highlightedIndex: highlightedIndexProp,
    setHighlightedIndex: setHighlightedIndexProp,
    disabled,
    defaultValue,
    grouping: groupingProp,

    selectedValue: selectedValueProp,
    setSelectedValue: setSelectedValueProp,
    selectedValues: selectedValuesProp,
    setSelectedValues: setSelectedValuesProp,
  } = state;
  const internalId = useStableId();

  // Internal items state (for filtering)
  const [items, setItems] = useState<T[]>(itemsProp);

  // SINGLE mode: internal T-state + controlled V-state
  const [selectedItemState, setSelectedItemState] = useState<T | undefined>(
    defaultValue
  );
  const internalSelectedItem = useMemo<T | undefined>(() => {
    if (selectedValueProp !== undefined) {
      return items.find((item) => mapValue(item) === selectedValueProp);
    }
    return selectedItemState;
  }, [items, mapValue, selectedItemState, selectedValueProp]);
  const setInternalSelectedItem = useCallback(
    (item: T) => {
      if (mode === "single") setSelectedItemState(item);
    },
    [mode]
  );
  const externalSelectedValue = useMemo<V | undefined>(() => {
    if (selectedValueProp !== undefined) return selectedValueProp;
    return internalSelectedItem !== undefined
      ? mapValue(internalSelectedItem)
      : undefined;
  }, [selectedValueProp, internalSelectedItem, mapValue]);

  // MULTIPLE mode: internal T[]-state + controlled V[]-state
  const [selectedItemsState, setSelectedItemsState] = useState<T[]>([]);
  const internalSelectedItems = useMemo<T[]>(() => {
    if (selectedValuesProp !== undefined) {
      return items.filter((item) =>
        selectedValuesProp.includes(mapValue(item))
      );
    }
    return selectedItemsState;
  }, [items, mapValue, selectedItemsState, selectedValuesProp]);
  const setInternalSelectedItems = useCallback(
    (list: T[]) => {
      if (mode === "multiple") setSelectedItemsState(list);
    },
    [mode]
  );
  const externalSelectedValues = useMemo<V[]>(() => {
    if (selectedValuesProp !== undefined) return selectedValuesProp;
    return selectedItemsState.map(mapValue);
  }, [selectedValuesProp, selectedItemsState, mapValue]);

  // Exposed to other features
  const selectedItem = mode === "single" ? internalSelectedItem : undefined;
  const selectedItems = mode === "multiple" ? internalSelectedItems : [];

  // Open state
  const [isOpenState, setIsOpenState] = useState<boolean>(defaultOpen);
  const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenState;
  const setIsOpen = setIsOpenProp ?? setIsOpenState;

  // Tabs, grouping, filtering, navigation, etc.
  const [activeTabIndex, setActiveTabIndex] = useState<number>(() => {
    if (tabs.length === 0) return -1;
    const defIdx = defaultTabKey
      ? tabs.findIndex((t) => t.key === defaultTabKey)
      : -1;
    return defIdx >= 0 ? defIdx : 0;
  });

  const itemToStringFn = useCallback(
    (item: T) => (itemToString ? itemToString(item) : String(item)),
    [itemToString]
  );

  // Generate trigger text based on selection
  const triggerText = useMemo(() => {
    if (mode === "single") {
      return internalSelectedItem ? itemToStringFn(internalSelectedItem) : placeholder;
    } else {
      if (internalSelectedItems.length === 0) return placeholder;
      if (internalSelectedItems.length === 1) return itemToStringFn(internalSelectedItems[0]);
      return `${internalSelectedItems.length} items selected`;
    }
  }, [mode, internalSelectedItem, internalSelectedItems, itemToStringFn, placeholder]);

  const { grouped, flattenedItems, groupingOptions, ungroupedWithActions } =
    useGrouping<T>({
      allowsCustomItems: false, // dropdowns don't support custom items
      inputValue: "", // no input value for dropdowns
      itemToString: itemToStringFn,
      actions,
      grouping: groupingProp ?? [],
      items,
      tabs,
      activeTabIndex,
      internalId,
    });

  const isItemDisabled = useCallback(
    (item: T) => isItemDisabledProp?.(item) ?? false,
    [isItemDisabledProp]
  );

  const { activeItem, setActiveItem, highlightedIndex, setHighlightedIndex } =
    useActiveItem({
      activeItemProp,
      highlightedIndexProp,
      flattenedItems,
      setActiveItemProp,
      setHighlightedIndexProp,
    });

  const [isFocused, setIsFocused] = useState(false);

  // Handle selection
  const handleSelect = useCallback(
    (item: T) => {
      if (isItemDisabled(item)) return;

      if (mode === "single") {
        onSelectItem?.(item);
        if (setSelectedValueProp) {
          setSelectedValueProp(mapValue(item));
        } else {
          setInternalSelectedItem(item);
        }
        setIsOpen(false);
      } else {
        const newList = internalSelectedItems.includes(item)
          ? internalSelectedItems.filter((i) => i !== item)
          : [...internalSelectedItems, item];

        onSelectItem?.(item);
        if (setSelectedValuesProp) {
          setSelectedValuesProp(newList.map(mapValue));
        } else {
          setInternalSelectedItems(newList);
        }
      }

      setActiveItem(null);
    },
    [
      isItemDisabled,
      mode,
      onSelectItem,
      mapValue,
      setInternalSelectedItem,
      setInternalSelectedItems,
      setSelectedValueProp,
      setSelectedValuesProp,
      internalSelectedItems,
      setIsOpen,
      setActiveItem,
    ]
  );

  // when controlled selectedValueProp changes, update internal state
  useEffect(() => {
    if (mode === "single" && selectedValueProp !== undefined) {
      // Find the item that matches the selected value
      const matchingItem = items.find((item) => mapValue(item) === selectedValueProp);
      if (matchingItem !== internalSelectedItem) {
        setSelectedItemState(matchingItem);
      }
    } else if (mode === "multiple" && selectedValuesProp !== undefined) {
      // Find the items that match the selected values
      const matchingItems = items.filter((item) =>
        selectedValuesProp.includes(mapValue(item))
      );
      if (matchingItems !== internalSelectedItems) {
        setSelectedItemsState(matchingItems);
      }
    }
  }, [mode, selectedValueProp, selectedValuesProp, items, mapValue, internalSelectedItem, internalSelectedItems]);

  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const { getItemState, getItemProps, getItemLinkProps } = useOption<T>({
    optionRefs,
    items,
    activeItem,
    selectedItem,
    selectedItems,
    isItemDisabled,
    isCustomItem: () => false, // dropdowns don't support custom items
    onSelect: handleSelect,
    mode,
    flattenedItems,
    getItemLink,
    setActiveItem,
    close: () => setIsOpen(false),
    internalId,
  });

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { handleKeyDown } = useNavigation<T>({
    activeItem,
    setActiveItem,
    flattenedItems,
    isOpen,
    setIsOpen,
    allowsEmptyCollection,
    tabs,
    activeTabIndex,
    setActiveTabIndex,
    handleSelect,
    optionRefs,
    tabRefs,
  });

  const onFilterAsyncRef = useRef(onFilterAsync);
  useEffect(() => {
    onFilterAsyncRef.current = onFilterAsync;
  }, [onFilterAsync]);
  const prevItemsPropRef = useRef<T[]>(itemsProp);
  function arraysShallowEqual<A>(a: A[], b: A[]) {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  useEffect(() => {
    if (!arraysShallowEqual(prevItemsPropRef.current, itemsProp)) {
      setItems(itemsProp);
      prevItemsPropRef.current = itemsProp;
    }
  }, [itemsProp]);

  useEffect(() => {
    if (defaultValue && mode === "single") {
      setInternalSelectedItem(defaultValue);
    }
  }, [
    defaultValue,
    mode,
    setInternalSelectedItem,
  ]);

  useFiltering<T>({
    inputValue: "", // no input filtering for dropdowns
    setItems,
    onFilterAsyncRef,
    asyncDebounceMs,
  });

  const { getDisclosureProps } = useDisclosure({
    isOpen,
    setIsOpen,
    allowsEmptyCollection,
    itemsLength: flattenedItems.length,
    internalId,
  });

  const clearSelectedItem = setSelectedValueProp
    ? (_: unknown) => {
        // clear the controlled value
        setSelectedValueProp(undefined as unknown as V);
      }
    : setInternalSelectedItem;
  const clearSelectedItems = setSelectedValuesProp
    ? (_: unknown) => {
        // clear the controlled value
        setSelectedValuesProp([]);
      }
    : setInternalSelectedItems;

  const { getClearProps, handleClear } = useClearButton<T, V>({
    inputValue: "", // no input value for dropdowns
    selectedItem,
    selectedItems,
    mode,
    onClearAsync,
    setInputValue: () => {}, // no-op for dropdowns
    setSelectedItem: clearSelectedItem,
    setSelectedItems: clearSelectedItems,
    setActiveItem,
    setIsOpen,
    clearRef: clearRefProp,
    internalId,
  });

  const { getTabListProps, getTabState, getTabProps } = useTabs<T>({
    tabRefs,
    activeTabIndex,
    items,
    tabs,
    setActiveTabIndex,
    handleKeyDown,
    internalId,
  });

  const { getRootProps } = useDropdownRoot<T>({
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
  });

  const { getListProps } = useListbox({
    isOpen,
    hasGroups: groupingOptions.length > 0,
    isEmpty: flattenedItems.length === 0,
    size: flattenedItems.length,
    listboxRef: listboxRefProp,
    internalId,
  });

  const { getTriggerProps } = useTrigger({
    activeItem,
    flattenedItems,
    tabsCount: tabs.length,
    allowsEmptyCollection,
    setIsOpen,
    setActiveItem,
    handleKeyDown,
    onSelect: handleSelect,
    onOpenAsync,
    onBlurAsync,
    setIsFocused,
    disabled,
    triggerRef: triggerRefProp,
    internalId,
    isOpen,
    triggerText,
  });

  const { getLabelProps } = useLabel({
    srOnly: labelSrOnly,
    labelRef: labelRefProp,
    internalId,
  });

  const { getGroupProps, getGroupLabelProps } = useGroup();

  return {
    getItems: () => {
      if (groupingOptions.length) {
        return grouped;
      }
      return ungroupedWithActions as T[];
    },
    getSelectedItem: () => (mode === "multiple" ? selectedItems : selectedItem),
    hasActiveItem: () => !!activeItem,
    isFocused: () => isFocused,
    getRootProps,
    getListProps,
    getLabelProps,
    getTriggerProps,
    getClearProps,
    getDisclosureProps,
    getItemProps,
    getItemState,
    getGroupProps,
    getGroupLabelProps,
    hasSelectedItem: () =>
      mode === "multiple"
        ? selectedItems.length > 0
        : selectedItem !== undefined,
    getSelectedValue: () => externalSelectedValue,
    getSelectedValues: () => externalSelectedValues,
    isOpen,
    setIsOpen,
    getHighlightedIndex: () => highlightedIndex,
    setHighlightedIndex,
    getActiveItem: () => activeItem,
    setActiveItem,
    getItemLinkProps,
    clear: handleClear,
    getTabListProps,
    getTabProps,
    getTabState,
    getIsDisabled: () => disabled,
    getTriggerText: () => triggerText,
  } as unknown as
    | UseDropdownUngroupedSingleNoActions<T>
    | UseDropdownUngroupedMultipleNoActions<T>
    | UseDropdownGroupedSingleNoActions<T>
    | UseDropdownGroupedMultipleNoActions<T>
    | UseDropdownUngroupedSingleWithActions<T>
    | UseDropdownUngroupedMultipleWithActions<T>
    | UseDropdownGroupedSingleWithActions<T>
    | UseDropdownGroupedMultipleWithActions<T>;
}