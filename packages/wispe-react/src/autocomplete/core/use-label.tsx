import React, { useCallback, useRef } from "react";
import { getInputId } from "../../utils/input-utils";

export interface UseLabelOptions {
  srOnly?: boolean;
  labelRef?: React.RefObject<HTMLLabelElement>;
  /** Base internal ID for the autocomplete */
  internalId: string;
}

export function useLabel(opts: UseLabelOptions) {
  const innerLabelRef = useRef<HTMLLabelElement | null>(null);
  const labelRef = opts.labelRef ?? innerLabelRef;

  const getLabelProps = useCallback(
    (): React.LabelHTMLAttributes<HTMLLabelElement> &
      React.RefAttributes<HTMLLabelElement> & {
        [key: `data-${string}`]: boolean;
      } => ({
      ref: labelRef,
      id: `${opts.internalId}-label`,
      htmlFor: getInputId(opts.internalId),
      style: opts.srOnly
        ? {
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            borderWidth: 0,
          }
        : undefined,
      "data-label": true,
    }),
    [labelRef, opts.htmlFor, opts.internalId, opts.srOnly]
  );

  return { getLabelProps, labelRef };
}
