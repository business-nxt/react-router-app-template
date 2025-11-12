import { useCallback, useSyncExternalStore } from "react";
import { PostMessageOptions, useBroadcastChannel } from "./useBroadcastChannel";

// Singleton state store - shared across all instances in this browsing context
let sharedState: any = null;
const listeners = new Set<() => void>();

function getState() {
  return sharedState;
}

function updateState(newState: any) {
  sharedState = newState;
  // Notify all subscribers
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSharedState() {
  // Use external store to share state across all hook instances
  const internalState = useSyncExternalStore(subscribe, getState, getState);

  const { postMessage } = useBroadcastChannel({
    actions: {
      "set-state": ({ data }) => {
        if (!data) return;

        // Always update the shared state from broadcast messages
        // This ensures all instances in this iframe see the same state
        updateState(data);
      },
    },
  });

  const setState = useCallback(
    (data: any, options?: PostMessageOptions) => {
      // If there's a delay, schedule both the local update and broadcast
      if (options?.delay) {
        setTimeout(() => {
          updateState(data);
          postMessage("set-state", data);
        }, options.delay);
      } else {
        // Update shared state immediately - all instances in this iframe will see it
        updateState(data);
        // Broadcast to other tabs/iframes
        postMessage("set-state", data);
      }
    },
    [postMessage]
  );

  return {
    state: internalState,
    setState,
    postMessage,
  };
}
