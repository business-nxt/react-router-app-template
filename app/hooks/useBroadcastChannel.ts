import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";

const CHANNEL_NAME = "visma-app-sync";

// Singleton channel to prevent multiple instances
let sharedChannel: BroadcastChannel | null = null;
let channelRefCount = 0;

function getSharedChannel(): BroadcastChannel {
  if (!sharedChannel) {
    sharedChannel = new BroadcastChannel(CHANNEL_NAME);
  }
  channelRefCount++;
  return sharedChannel;
}

function releaseSharedChannel(): void {
  channelRefCount--;
  if (channelRefCount === 0 && sharedChannel) {
    sharedChannel.close();
    sharedChannel = null;
  }
}

export interface PostMessageOptions {
  delay?: number;
}

export interface BroadcastMessage {
  type: string;
  data?: any;
  sender_id: string;
  message_id: string;
  reply_to?: string;
  options?: PostMessageOptions;
}

export function useBroadcastChannel(options?: {
  actions?: Record<string, (data: any) => void>;
}) {
  const actions = options?.actions;
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);
  const [id] = useState(nanoid());
  const ref = useRef(actions);
  const handlerRef = useRef<((event: MessageEvent<BroadcastMessage>) => void) | null>(null);

  useEffect(() => {
    ref.current = actions;
  }, [actions]);

  useEffect(() => {
    // Check if BroadcastChannel is supported
    if (typeof BroadcastChannel === "undefined") {
      return;
    }

    const bc = getSharedChannel();
    setChannel(bc);

    // Create a message handler for this instance
    const handleMessage = (event: MessageEvent<BroadcastMessage>) => {
      const message = event.data;

      // Ignore reply messages (handled separately)
      if (message.reply_to) {
        return;
      }

      const currentActions = ref.current;
      if (!currentActions) {
        return;
      }

      if (currentActions[message.type]) {
        currentActions[message.type]({
          data: message.data,
          sender_id: message.sender_id,
          isOwnMessage: message.sender_id === id,
          sendReply: (data: any) => {
            bc.postMessage({
              data,
              reply_to: message.message_id,
              sender_id: id,
              type: "reply",
              message_id: nanoid(),
            } as BroadcastMessage);
          },
        });
      }
    };

    handlerRef.current = handleMessage;
    bc.addEventListener("message", handleMessage);

    return () => {
      if (handlerRef.current) {
        bc.removeEventListener("message", handlerRef.current);
      }
      releaseSharedChannel();
    };
  }, [id]);

  return {
    instance_id: id,
    postMessage: (type: string, data?: any, options?: PostMessageOptions) => {
      const message_id = nanoid();
      const message: BroadcastMessage = {
        data,
        type,
        sender_id: id,
        message_id,
        options,
      };

      // Handle delayed messages
      if (options?.delay) {
        setTimeout(() => {
          channel?.postMessage(message);
        }, options.delay);
      } else {
        channel?.postMessage(message);
      }
    },
  };
}
