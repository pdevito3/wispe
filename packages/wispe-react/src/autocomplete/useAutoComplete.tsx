import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useActiveItem } from "../autocomplete/core/useActiveItem";
import { useAutocompleteRoot } from "../autocomplete/core/useAutocompleteRoot";
import { useClearButton } from "../autocomplete/core/useClearButton";
import { useDisclosure } from "../autocomplete/core/useDisclosure";
import { useInput } from "../autocomplete/core/useInput";
import { useLabel } from "../autocomplete/core/useLabel";
import { useListbox } from "../autocomplete/core/useListbox";
import { useOption } from "../autocomplete/core/useOption";
import { useCustomValue } from "../autocomplete/features/useCustomValue";
import { useFiltering } from "../autocomplete/features/useFiltering";
import { useGroup } from "../autocomplete/features/useGroup";
import { useGrouping } from "../autocomplete/features/useGrouping";
import { useNavigation } from "../autocomplete/features/useNavigation";
import { useTabs } from "../autocomplete/features/useTabs";
import type {
  ActionItem,
  GroupingOptions,
  UseAutoCompleteGroupedMultipleNoActions,
  UseAutoCompleteGroupedMultipleWithActions,
  UseAutoCompleteGroupedSingleNoActions,
  UseAutoCompleteGroupedSingleWithActions,
  UseAutoCompleteOptions,
  UseAutoCompleteUngroupedMultipleNoActions,
  UseAutoCompleteUngroupedMultipleWithActions,
  UseAutoCompleteUngroupedSingleNoActions,
  UseAutoCompleteUngroupedSingleWithActions,
} from "../autocomplete/types";

export function useAutoComplete<T, V = T>(
  options: UseAutoCompleteOptions<T, V> & {
    actions?: undefined;
    state?: { grouping?: undefined };
    mode?: "single";
  }
): UseAutoCompleteUngroupedSingleNoActions<T, V>;

export function useAutoComplete<T, V = T>(
  options: UseAutoCompleteOptions<T, V> & {
    actions?: undefined;
    state?: { grouping?: undefined };
    mode: "multiple";
  }
): UseAutoCompleteUngroupedMultipleNoActions<T, V>;

export function useAutoComplete<T, V = T>(
  options: UseAutoCompleteOptions<T, V> & {
    actions?: undefined;
    state: { grouping: GroupingOptions<T>[] };
    mode?: "single";
  }
): UseAutoCompleteGroupedSingleNoActions<T, V>;

export function useAutoComplete<T, V = T>(
  options: UseAutoCompleteOptions<T, V> & {
    actions?: undefined;
    state: { grouping: GroupingOptions<T>[] };
    mode: "multiple";
  }
): UseAutoCompleteGroupedMultipleNoActions<T, V>;

export function useAutoComplete<T, V = T>(
  options: UseAutoCompleteOptions<T, V> & {
    actions: ActionItem[];
    state?: { grouping?: undefined };
    mode?: "single";
  }
): UseAutoCompleteUngroupedSingleWithActions<T, V>;

export function useAutoComplete<T, V = T>(
  options: UseAutoCompleteOptions<T, V> & {
    actions: ActionItem[];
    state?: { grouping?: undefined };
    mode: "multiple";
  }
): UseAutoCompleteUngroupedMultipleWithActions<T, V>;

export function useAutoComplete<T, V = T>(
  options: UseAutoCompleteOptions<T, V> & {
    actions: ActionItem[];
    state: { grouping: GroupingOptions<T>[] };
    mode?: "single";
  }
): UseAutoCompleteGroupedSingleWithActions<T, V>;

export function useAutoComplete<T, V = T>(
  options: UseAutoCompleteOptions<T, V> & {
    actions: ActionItem[];
    state: { grouping: GroupingOptions<T>[] };
    mode: "multiple";
  }
): UseAutoCompleteGroupedMultipleWithActions<T, V>;

export function useAutoComplete<T, V = T>({
  mode: modeProp = "single",
  state = {},
  defaultOpen = false,
  labelSrOnly = false,
  asyncDebounceMs = 0,
  allowsCustomItems = false,
  onInputValueChange,
  onSelectItem,
  onInputValueChangeAsync,
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
  mapValue = (item: T) => item as unknown as V,
}: UseAutoCompleteOptions<T, V>):
  | UseAutoCompleteUngroupedSingleNoActions<T>
  | UseAutoCompleteUngroupedMultipleNoActions<T>
  | UseAutoCompleteGroupedSingleNoActions<T>
  | UseAutoCompleteGroupedMultipleNoActions<T>
  | UseAutoCompleteUngroupedSingleWithActions<T>
  | UseAutoCompleteUngroupedMultipleWithActions<T>
  | UseAutoCompleteGroupedSingleWithActions<T>
  | UseAutoCompleteGroupedMultipleWithActions<T> {
  const mode = modeProp;

  const {
    inputValue: inputValueProp,
    setInputValue: setInputValueProp,
    isOpen: isOpenProp,
    setIsOpen: setIsOpenProp,
    activeItem: activeItemProp,
    setActiveItem: setActiveItemProp,
    highlightedIndex: highlightedIndexProp,
    setHighlightedIndex: setHighlightedIndexProp,
    disabled,
    label: labelProp = "",
    defaultValue,
    grouping: groupingProp,

    selectedValue: selectedValueProp,
    setSelectedValue: setSelectedValueProp,
    selectedValues: selectedValuesProp,
    setSelectedValues: setSelectedValuesProp,
  } = state;

  // Input state
  const [inputValueState, setInputValueState] = useState<string>(
    inputValueProp ?? ""
  );
  const inputValue =
    inputValueProp !== undefined ? inputValueProp : inputValueState;
  const setInputValue = setInputValueProp ?? setInputValueState;

  // ——— Controlled/uncontrolled selected state ———

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
  const { grouped, flattenedItems, groupingOptions, ungroupedWithActions } =
    useGrouping<T>({
      allowsCustomItems,
      inputValue,
      itemToString: itemToStringFn,
      actions,
      grouping: groupingProp ?? [],
      items,
      tabs,
      activeTabIndex,
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
        setInputValue(itemToStringFn(item));
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
        setInputValue("");
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
      setInputValue,
      itemToStringFn,
      setIsOpen,
      setActiveItem,
    ]
  );

  const { isCustomItem } = useCustomValue<T>({
    items,
    inputValue,
    itemToString: itemToStringFn,
    allowsCustomItems,
  });

  const optionRefs = useRef<Array<HTMLLIElement | null>>([]);
  const { getItemState, getItemProps, getItemLinkProps } = useOption<T>({
    optionRefs,
    items,
    activeItem,
    selectedItem,
    selectedItems,
    isItemDisabled,
    isCustomItem,
    onSelect: handleSelect,
    mode,
    flattenedItems,
    getItemLink,
    setActiveItem,
    close: () => setIsOpen(false),
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
      setInputValue(itemToStringFn(defaultValue));
    }
  }, [
    defaultValue,
    mode,
    setInternalSelectedItem,
    setInputValue,
    itemToStringFn,
  ]);

  const { debouncedAsyncOperation } = useFiltering<T>({
    inputValue,
    setItems,
    onFilterAsyncRef,
    asyncDebounceMs,
  });

  const { getDisclosureProps } = useDisclosure({
    isOpen,
    setIsOpen,
    allowsEmptyCollection,
    itemsLength: flattenedItems.length,
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
    inputValue,
    selectedItem,
    selectedItems,
    mode,
    onClearAsync,
    setInputValue,
    setSelectedItem: clearSelectedItem,
    setSelectedItems: clearSelectedItems,
    setActiveItem,
    setIsOpen,
  });

  const { getTabListProps, getTabState, getTabProps } = useTabs<T>({
    tabRefs,
    activeTabIndex,
    items,
    tabs,
    setActiveTabIndex,
    handleKeyDown,
  });

  const { getRootProps } = useAutocompleteRoot<T>({
    isOpen,
    isFocused,
    mode,
    selectedItem,
    selectedItems,
    inputValue,
    setIsOpen,
    setActiveItem,
    setHighlightedIndex,
  });

  const { getListProps } = useListbox({
    isOpen,
    label: labelProp,
    hasGroups: groupingOptions.length > 0,
    isEmpty: flattenedItems.length === 0,
    size: flattenedItems.length,
  });

  const { getInputProps } = useInput({
    inputValue,
    setInputValue,
    handleKeyDown,
    activeItem,
    flattenedItems,
    tabsCount: tabs.length,
    allowsEmptyCollection,
    setIsOpen,
    setActiveItem,
    onBlurAsync,
    onInputValueChangeAsync,
    onFilterAsyncRef,
    debouncedAsyncOperation,
    onInputValueChange,
    setIsFocused,
    disabled,
  });

  const { getLabelProps } = useLabel({
    htmlFor: "autocomplete-input",
    srOnly: labelSrOnly,
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
    getInputProps,
    inputValue,
    setInputValue,
    getClearProps,
    getDisclosureProps,
    getItemProps,
    getItemState,
    getGroupProps,
    getGroupLabelProps,
    hasSelectedItem: () =>
      mode === "multiple"
        ? externalSelectedValues.length > 0
        : externalSelectedValue !== undefined,
    getSelectedValue: () => externalSelectedValue,
    getSelectedValues: () => externalSelectedValues,
    isOpen,
    setIsOpen,
    isCustomItem,
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
  } as unknown as
    | UseAutoCompleteUngroupedSingleNoActions<T>
    | UseAutoCompleteUngroupedMultipleNoActions<T>
    | UseAutoCompleteGroupedSingleNoActions<T>
    | UseAutoCompleteGroupedMultipleNoActions<T>
    | UseAutoCompleteUngroupedSingleWithActions<T>
    | UseAutoCompleteUngroupedMultipleWithActions<T>
    | UseAutoCompleteGroupedSingleWithActions<T>
    | UseAutoCompleteGroupedMultipleWithActions<T>;
}
