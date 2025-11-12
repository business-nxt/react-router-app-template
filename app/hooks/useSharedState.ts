import { useCallback, useSyncExternalStore } from "react";
import { useSearchParams } from "react-router";
import { PostMessageOptions, useBroadcastChannel } from "./useBroadcastChannel";

// Singleton state store - shared across all instances in this browsing context
let sharedState: any = null;
const listeners = new Set<() => void>();

function getState() {
  return sharedState;
}

function updateState(newState: any) {
  console.log(`[StateStore] Updating shared state:`, newState);
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

  const [searchParams] = useSearchParams();
  const elementNo = searchParams.get("elementNo") || "no-element";

  const { postMessage, instance_id } = useBroadcastChannel({
    actions: {
      "set-state": ({ data, isOwnMessage, sender_id }) => {
        console.log(
          `[useSharedState][elementNo:${elementNo}][instance:${instance_id.slice(0, 6)}] Received set-state:`,
          {
            data,
            isOwnMessage,
            sender_id: sender_id?.slice(0, 6),
            currentSharedState: sharedState,
          }
        );

        if (!data) return;

        // Always update the shared state from broadcast messages
        // This ensures all instances in this iframe see the same state
        console.log(
          `[useSharedState][elementNo:${elementNo}][instance:${instance_id.slice(0, 6)}] Updating shared state to:`,
          data
        );
        updateState(data);
      },
    },
  });

  const setState = useCallback(
    (data: any, options?: PostMessageOptions) => {
      console.log(
        `[useSharedState][elementNo:${elementNo}][instance:${instance_id.slice(0, 6)}] setState called:`,
        {
          newData: data,
          currentState: internalState,
          options,
        }
      );

      // If there's a delay, schedule both the local update and broadcast
      if (options?.delay) {
        console.log(
          `[useSharedState][elementNo:${elementNo}] Scheduling state update with delay: ${options.delay}ms`
        );
        setTimeout(() => {
          console.log(
            `[useSharedState][elementNo:${elementNo}] Executing delayed state update`
          );
          updateState(data);
          postMessage("set-state", data);
        }, options.delay);
      } else {
        // Update shared state immediately - all instances in this iframe will see it
        updateState(data);

        console.log(
          `[useSharedState][elementNo:${elementNo}] Broadcasting to other iframes...`
        );
        // Broadcast to other tabs/iframes
        postMessage("set-state", data);
      }
    },
    [postMessage, internalState, elementNo, instance_id]
  );

  return {
    state: internalState,
    setState,
    postMessage,
  };
}
