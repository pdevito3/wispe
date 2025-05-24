import { useCallback, useReducer } from "react";
import type { ActionItem } from "../types";

export function useActiveItem<T>({
  activeItemProp,
  highlightedIndexProp,
  flattenedItems,
  setActiveItemProp,
  setHighlightedIndexProp,
}: {
  activeItemProp: T | null | undefined;
  highlightedIndexProp: number | null | undefined;
  flattenedItems: (T | ActionItem)[];
  setActiveItemProp: ((item: T | null) => void) | undefined;
  setHighlightedIndexProp: ((index: number | null) => void) | undefined;
}) {
  type NavState = {
    activeItem: T | ActionItem | null;
    highlightedIndex: number | null;
  };

  type NavAction =
    | {
        type: "SET_ACTIVE_ITEM";
        payload: { item: T | ActionItem | null; index: number | null };
      }
    | {
        type: "SET_HIGHLIGHTED_INDEX";
        payload: { item: T | ActionItem | null; index: number | null };
      };

  function navReducer(state: NavState, action: NavAction): NavState {
    switch (action.type) {
      case "SET_ACTIVE_ITEM":
      case "SET_HIGHLIGHTED_INDEX":
        return {
          activeItem: action.payload.item,
          highlightedIndex: action.payload.index,
        };
      default:
        return state;
    }
  }

  const [navState, dispatchNav] = useReducer(navReducer, {
    activeItem: null,
    highlightedIndex: null,
  });

  const activeItem: T | ActionItem | null =
    activeItemProp !== undefined ? activeItemProp : navState.activeItem;
  const highlightedIndex: number | null =
    highlightedIndexProp !== undefined
      ? highlightedIndexProp
      : navState.highlightedIndex;

  // Wrappers that update both pieces via reducer + external setters
  const setActiveItem = useCallback(
    (item: T | ActionItem | null) => {
      const index =
        item !== null ? flattenedItems.findIndex((i) => i === item) : null;
      // only pass real T back to any external prop
      setActiveItemProp?.((item as T) || null);
      setHighlightedIndexProp?.(index);
      dispatchNav({ type: "SET_ACTIVE_ITEM", payload: { item, index } });
    },
    [flattenedItems, setActiveItemProp, setHighlightedIndexProp]
  );

  const setHighlightedIndex = useCallback(
    (index: number | null) => {
      const item = index !== null ? flattenedItems[index] : null;
      // only pass real T back to any external prop
      setActiveItemProp?.((item as T) || null);
      setHighlightedIndexProp?.(index);
      dispatchNav({ type: "SET_HIGHLIGHTED_INDEX", payload: { item, index } });
    },
    [flattenedItems, setActiveItemProp, setHighlightedIndexProp]
  );
  return { activeItem, setActiveItem, highlightedIndex, setHighlightedIndex };
}
