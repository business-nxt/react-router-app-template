import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";

const CHANNEL_NAME = "visma-app-sync";

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

  useEffect(() => {
    ref.current = actions;
  }, [actions]);

  useEffect(() => {
    // Check if BroadcastChannel is supported
    if (typeof BroadcastChannel === "undefined") {
      console.warn("BroadcastChannel not supported in this browser");
      return;
    }

    const bc = new BroadcastChannel(CHANNEL_NAME);
    setChannel(bc);

    bc.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      const message = event.data;

      // Ignore messages from self
      if (message.sender_id === id) {
        return;
      }

      // Ignore reply messages (handled separately)
      if (message.reply_to) {
        return;
      }

      const currentActions = ref.current;
      if (!currentActions) return;

      if (currentActions[message.type]) {
        currentActions[message.type]({
          data: message.data,
          sender_id: message.sender_id,
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

    bc.onerror = (error) => {
      console.error("BroadcastChannel error:", error);
    };

    return () => {
      bc.close();
      console.log("closing broadcast channel", id);
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
