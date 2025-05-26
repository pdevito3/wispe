import React, { useState } from "react";
import { useIsoMorphicEffect } from "./use-isomorphic-effect";
import { useServerHandoffComplete } from "./use-server-handoff-complete";

// Credit: base from https://github.com/tailwindlabs/headlessui/blob/c13e6b77529e81441a6efaf821495d6e98f340cc/packages/%40headlessui-react/src/hooks/use-id.ts

// We used a "simple" approach first which worked for SSR and rehydration on the client. However we
// didn't take care of the Suspense case. To fix this we used the approach the @reach-ui/auto-id
// uses.
//
// Credits: https://github.com/reach/reach-ui/blob/develop/packages/auto-id/src/index.tsx

let id = 0;
function generateId() {
  return ++id;
}

function usePre18Id() {
  const ready = useServerHandoffComplete();
  const [id, setId] = useState(ready ? generateId : null);

  useIsoMorphicEffect(() => {
    if (id === null) setId(generateId());
  }, [id]);

  return id != null ? "" + id : undefined;
}

// At module load time, see if React.useId exists.
// If it does, use it. Otherwise, fall back to a no-op.
const useMaybeReactId: () => string | undefined =
  React.useId ?? (() => undefined);

export function useStableId(): string {
  const reactId = useMaybeReactId();
  const pre18Id = usePre18Id();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return reactId ?? pre18Id!;
}
