import { useCallback } from "react";
import type { Group } from "../types";

/**
 * Core hook for rendering a grouped list.
 * Returns prop getters for the <ul role="group"> and its heading.
 */
export function useGroup<T>() {
  const getGroupProps = useCallback((group: Group<T>) => group.listProps, []);

  const getGroupLabelProps = useCallback(
    (group: Group<T>) => group.header.headingProps,
    []
  );

  return { getGroupProps, getGroupLabelProps };
}
