import { nanoid } from "nanoid";
import AddinWorker from "~/workers/addin-worker?sharedworker";

export async function getStateFromWorker() {
  return new Promise((resolve, reject) => {
    const abort = new AbortController();
    const worker = new AddinWorker();
    const timeout = setTimeout(() => {
      abort.abort();
      reject("timeout");
    }, 1000);
    const message_id = nanoid();
    worker.port.addEventListener(
      "message",
      (e) => {
        if (e.data.reply_to === message_id) {
          clearTimeout(timeout);
          resolve(e.data.data);
        }
      },
      {
        signal: abort.signal,
      }
    );

    worker.port.start();
    worker.port.postMessage({ type: "get-state", message_id });
  });
}
