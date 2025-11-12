import { useCallback, useState } from "react";
import { PostMessageOptions, useBroadcastChannel } from "./useBroadcastChannel";

export function useSharedState() {
  const [internalState, setInternalState] = useState<any | null>();

  const { postMessage } = useBroadcastChannel({
    actions: {
      "set-state": ({ data }) => {
        if (data) {
          setInternalState(data);
        }
      },
    },
  });

  const setState = useCallback(
    (data: any, options?: PostMessageOptions) => {
      postMessage("set-state", data, options);
      setInternalState(data);
    },
    [postMessage]
  );

  return {
    state: internalState,
    setState,
    postMessage,
  };
}
