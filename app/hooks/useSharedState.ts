import { useCallback, useEffect, useState } from "react";
import { getStateFromWorker } from "~/utils/getStateFromWorker";
import { PostMessageOptions, useSharedWorker } from "./useSharedWorker";

export function useSharedState() {
  const [internalState, setInternalState] = useState<any | null>();

  useEffect(() => {
    getStateFromWorker().then((data) => {
      setInternalState(data);
    });
  }, []);

  const { postMessage } = useSharedWorker({
    actions: {
      "set-state": ({ data }) => {
        console.log("state update", data);
        if (data) {
          setInternalState(data);
        }
      },
    },
  });

  const setState = useCallback(
    (data: any, options?: PostMessageOptions) => {
      console.log("setting state in callback", data);
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
