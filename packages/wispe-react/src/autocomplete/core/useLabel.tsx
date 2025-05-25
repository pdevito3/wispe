import React, { useCallback, useRef } from "react";

export interface UseLabelOptions {
  htmlFor: string;
  srOnly?: boolean;
  labelRef?: React.RefObject<HTMLLabelElement>;
}

export function useLabel(opts: UseLabelOptions) {
  const innerLabelRef = useRef<HTMLLabelElement | null>(null);
  const labelRef = opts.labelRef ?? innerLabelRef;

  const getLabelProps = useCallback(
    (): React.LabelHTMLAttributes<HTMLLabelElement> &
      React.RefAttributes<HTMLLabelElement> & {
        [key: `data-${string}`]: boolean;
      } => ({
      htmlFor: opts.htmlFor,
      ref: labelRef,
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
    [labelRef, opts.htmlFor, opts.srOnly]
  );

  return { getLabelProps, labelRef };
}
