import React from "react";

export interface UseLabelOptions {
  htmlFor: string;
  srOnly?: boolean;
}

export function useLabel(opts: UseLabelOptions) {
  const getLabelProps = React.useCallback(
    (): React.LabelHTMLAttributes<HTMLLabelElement> & {
      [key: `data-${string}`]: boolean;
    } => ({
      htmlFor: opts.htmlFor,
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
    [opts.htmlFor, opts.srOnly]
  );

  return { getLabelProps };
}
