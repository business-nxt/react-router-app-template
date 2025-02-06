import localforage from "localforage";

const ports: MessagePort[] = [];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

self.addEventListener(
  "connect",
  async function (e: any) {
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
          const state = await localforage.getItem("state");
          await localforage.setItem("state", {
            ...(state ?? {}),
            ...e.data.data,
          });
        }

        if (e.data.type === "set-state") {
          await localforage.setItem("state", e.data.data);
        }

        if (e.data.type === "get-state") {
          const state = await localforage.getItem("state");
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
