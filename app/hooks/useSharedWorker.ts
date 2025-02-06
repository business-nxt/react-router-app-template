import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import AddinWorker from "~/workers/addin-worker?sharedworker";

interface PostMessageOptions {
  delay?: number;
}

export function useSharedWorker(options?: {
  actions?: Record<string, (data: any) => void>;
}) {
  const actions = options?.actions;
  const [worker, setWorker] = useState<SharedWorker | null>(null);
  const [id] = useState(nanoid());
  const ref = useRef(actions);
  useEffect(() => {
    ref.current = actions;
  }, [actions]);

  useEffect(() => {
    const abort = new AbortController();
    const worker = new AddinWorker();
    setWorker(worker);
    worker.port.addEventListener(
      "message",
      (e) => {
        if (!e.data) return;
        if (e.data.reply_to) return;
        const actions = ref.current;
        if (!actions) return;
        if (actions[e.data.type]) {
          actions[e.data.type]({
            data: e.data.data,
            sender_id: e.data.sender_id,
            sendReply: (data: any) => {
              worker.port.postMessage({
                data,
                reply_to: e.data.message_id,
                sender_id: id,
              });
            },
          });
        }
      },
      {
        signal: abort.signal,
      }
    );
    worker.port.start();
    worker.onerror = (e) => {
      console.error(e);
    };
    return () => {
      worker.port.close();
      abort.abort();
      console.log("closing worker", id);
    };
  }, [id]);

  return {
    instance_id: id,
    postMessage: (type: string, data?: any, options?: PostMessageOptions) => {
      const id = nanoid();
      worker?.port.postMessage({
        data,
        type,
        sender_id: id,
        message_id: id,
        options,
      });
    },
  };
}
