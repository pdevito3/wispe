// source https://github.com/mantinedev/mantine/blob/master/src/mantine-hooks/src/use-debounced-value/use-debounced-value.ts

import { useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(
  value: T,
  wait: number,
  options: { leading?: boolean } = { leading: false }
): readonly [T, () => void] {
  const [_value, setValue] = useState(value);
  const mountedRef = useRef(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const cooldownRef = useRef(false);

  const cancel = () => {
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (mountedRef.current) {
      if (!cooldownRef.current && options.leading) {
        cooldownRef.current = true;
        setValue(value);
      } else {
        cancel();
        timeoutRef.current = window.setTimeout(() => {
          cooldownRef.current = false;
          setValue(value);
        }, wait);
      }
    }
  }, [value, options.leading, wait]);

  useEffect(() => {
    mountedRef.current = true;
    return cancel;
  }, []);

  return [_value, cancel] as const;
}
