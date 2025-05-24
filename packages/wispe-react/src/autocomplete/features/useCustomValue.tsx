import { useCallback } from "react";

export function useCustomValue<T>({
  items,
  inputValue,
  itemToString,
  allowsCustomItems,
}: {
  items: T[];
  inputValue: string;
  itemToString: (item: T) => string;
  allowsCustomItems: boolean;
}) {
  const isCustomItem = useCallback(
    (item: T) => {
      return (
        allowsCustomItems &&
        inputValue.trim() !== "" &&
        itemToString(item) === inputValue &&
        !items.some((it) => itemToString(it) === inputValue)
      );
    },
    [allowsCustomItems, inputValue, itemToString, items]
  );

  return { isCustomItem };
}
