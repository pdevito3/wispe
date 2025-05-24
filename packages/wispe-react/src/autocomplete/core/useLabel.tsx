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
      // TODO don't rely on tailwind here
      className: opts.srOnly ? "sr-only" : undefined,
      "data-label": true,
    }),
    [opts.htmlFor, opts.srOnly]
  );

  return { getLabelProps };
}
