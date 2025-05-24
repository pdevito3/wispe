import React, { useCallback, useEffect, useRef } from "react";
import { useDebouncedValue } from "../../hooks/use-debounced-value";

export function useFiltering<T>({
  inputValue,
  setItems,
  onFilterAsyncRef,
  asyncDebounceMs = 0,
}: {
  inputValue: string;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  onFilterAsyncRef: React.RefObject<
    | ((params: { searchTerm: string; signal: AbortSignal }) => Promise<T[]>)
    | undefined
  >;
  asyncDebounceMs: number;
}) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const debouncedAsyncOperation = useCallback(
    async (value: string) => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      try {
        const filterFn = onFilterAsyncRef.current;
        if (filterFn) {
          const results = await filterFn({
            searchTerm: value,
            signal: abortControllerRef.current!.signal,
          });
          setItems(results);
        }
      } catch (err) {
        if (!(err instanceof Error && err.name === "AbortError"))
          console.error(err);
      }
    },
    [abortControllerRef, onFilterAsyncRef, setItems]
  );

  const [debouncedInputValue] = useDebouncedValue(inputValue, asyncDebounceMs);
  useEffect(() => {
    if (onFilterAsyncRef.current) debouncedAsyncOperation(debouncedInputValue);
  }, [debouncedInputValue, debouncedAsyncOperation, onFilterAsyncRef]);

  return { debouncedAsyncOperation };
}
