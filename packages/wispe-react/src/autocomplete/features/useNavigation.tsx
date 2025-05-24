// domain/autocomplete/features/useNavigation.tsx
import { useCallback } from "react";
import type { ActionItem } from "../types";

export function useNavigation<T>({
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
}: {
  activeItem: ActionItem | T | null;
  setActiveItem: (item: T | ActionItem | null) => void;
  flattenedItems: (T | ActionItem)[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  allowsEmptyCollection: boolean;
  tabs: Array<{ key: string; filter?: (item: T) => boolean }>;
  activeTabIndex: number;
  setActiveTabIndex: (index: number) => void;
  handleSelect: (item: T) => void;
  optionRefs: React.RefObject<Array<HTMLElement | null>>;
  tabRefs: React.RefObject<Array<HTMLElement | null>>;
}) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const { key } = event;
      const currentIndex = flattenedItems.findIndex((i) => i === activeItem);

      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            if (allowsEmptyCollection || flattenedItems.length > 0) {
              setIsOpen(true);
              if (flattenedItems.length) setActiveItem(flattenedItems[0]);
            }
          } else {
            const next =
              currentIndex < flattenedItems.length - 1 ? currentIndex + 1 : 0;
            setActiveItem(flattenedItems[next]);
            optionRefs.current[next]?.scrollIntoView({ block: "nearest" });
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          if (!isOpen) {
            if (allowsEmptyCollection || flattenedItems.length > 0) {
              setIsOpen(true);
              if (flattenedItems.length)
                setActiveItem(flattenedItems[flattenedItems.length - 1]);
            }
          } else {
            const prev =
              currentIndex > 0 ? currentIndex - 1 : flattenedItems.length - 1;
            setActiveItem(flattenedItems[prev]);
            optionRefs.current[prev]?.scrollIntoView({ block: "nearest" });
          }
          break;

        case "ArrowRight":
          event.preventDefault();
          if (tabs.length > 0) {
            const nextTab = (activeTabIndex + 1) % tabs.length;
            setActiveTabIndex(nextTab);
            tabRefs.current[nextTab]?.focus();
          }
          break;

        case "ArrowLeft":
          event.preventDefault();
          if (tabs.length > 0) {
            const prevTab = (activeTabIndex - 1 + tabs.length) % tabs.length;
            setActiveTabIndex(prevTab);
            tabRefs.current[prevTab]?.focus();
          }
          break;

        case "Enter":
          event.preventDefault();
          if (activeItem) {
            if ((activeItem as ActionItem).__isAction) {
              (activeItem as ActionItem).onAction();
            } else {
              handleSelect(activeItem as T);
            }
          }
          break;

        case "Escape":
          event.preventDefault();
          setIsOpen(false);
          setActiveItem(null);
          break;

        case "Tab":
          setIsOpen(false);
          setActiveItem(null);
          break;
      }
    },
    [
      allowsEmptyCollection,
      flattenedItems,
      activeItem,
      isOpen,
      setIsOpen,
      setActiveItem,
      handleSelect,
      tabs,
      activeTabIndex,
      setActiveTabIndex,
      optionRefs,
      tabRefs,
    ]
  );

  return { handleKeyDown, handleSelect };
}
