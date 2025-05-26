import { useEffect, useState } from "react";

// // Credit: base from https://github.com/tailwindlabs/headlessui/blob/c13e6b77529e81441a6efaf821495d6e98f340cc/packages/%40headlessui-react/src/hooks/use-id.ts
const state = { serverHandoffComplete: false };

export function useServerHandoffComplete() {
  const [serverHandoffComplete, setServerHandoffComplete] = useState(
    state.serverHandoffComplete
  );

  useEffect(() => {
    if (serverHandoffComplete === true) return;

    setServerHandoffComplete(true);
  }, [serverHandoffComplete]);

  useEffect(() => {
    if (state.serverHandoffComplete === false)
      state.serverHandoffComplete = true;
  }, []);

  return serverHandoffComplete;
}
