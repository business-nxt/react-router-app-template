import localforage from "localforage";

const ports: MessagePort[] = [];

// In-memory fallback for Safari third-party context
let inMemoryState: any = null;
let storageAvailable = true;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Test if storage is available
async function testStorage(): Promise<boolean> {
  try {
    const testKey = "__storage_test__";
    await localforage.setItem(testKey, "test");
    await localforage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn("IndexedDB not available, using in-memory storage fallback:", error);
    return false;
  }
}

// Get state with fallback
async function getState(): Promise<any> {
  if (!storageAvailable) {
    return inMemoryState;
  }
  try {
    return await localforage.getItem("state");
  } catch (error) {
    console.warn("Failed to get state from storage, using in-memory fallback:", error);
    storageAvailable = false;
    return inMemoryState;
  }
}

// Set state with fallback
async function setState(state: any): Promise<void> {
  // Always update in-memory state
  inMemoryState = state;

  if (!storageAvailable) {
    return;
  }

  try {
    await localforage.setItem("state", state);
  } catch (error) {
    console.warn("Failed to set state in storage, using in-memory fallback:", error);
    storageAvailable = false;
  }
}

self.addEventListener(
  "connect",
  async function (e: any) {
    // Test storage availability on first connection
    if (ports.length === 0) {
      storageAvailable = await testStorage();
      if (!storageAvailable) {
        console.log("Using in-memory storage fallback for shared worker");
      }
    }

    const port: MessagePort = e.ports[0];
    ports.push(e.ports[0]);
    port.addEventListener(
      "message",
      async function (e) {
        if (e.data.options?.delay) {
          console.log("delaying", e.data.options.delay);
          await sleep(e.data.options.delay);
        }
        if (e.data.type === "update-state") {
          const state = await getState();
          await setState({
            ...(state ?? {}),
            ...e.data.data,
          });
        }

        if (e.data.type === "set-state") {
          await setState(e.data.data);
        }

        if (e.data.type === "get-state") {
          const state = await getState();
          port.postMessage({ data: state, reply_to: e.data.message_id });
          return;
        }

        for (let i = 0; i < ports.length; i++) {
          ports[i].postMessage(e.data);
        }
      },
      true
    );
    port.start();
  },
  true
);

self.addEventListener("close", (e) => {
  ports.splice(ports.indexOf(e.target as MessagePort), 1);
});
