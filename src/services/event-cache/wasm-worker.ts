import { WorkerRelayInterface } from "@snort/worker-relay";
import WorkerVite from "@snort/worker-relay/src/worker?worker";
import { markFromCache } from "applesauce-core/helpers";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { NostrEvent } from "nostr-tools";
import { Observable, tap } from "rxjs";

import { logger } from "../../helpers/debug";
import localSettings from "../preferences";
import { EventCache } from "./interface";

// NOTE: importing this module will cause the WASM to be loaded into memory

const log = logger.extend(`wasm-worker`);

const workerScript = import.meta.env.DEV
  ? new URL("@snort/worker-relay/dist/esm/worker.mjs", import.meta.url)
  : new WorkerVite();

export const worker = new WorkerRelayInterface(workerScript);
await worker.init({ databasePath: "nostrudel.db", insertBatchSize: 100 });

// every minute, prune the database
setInterval(() => {
  const days = localSettings.wasmPersistForDays.value;
  if (days) {
    log(`Removing all events older than ${days} days in WASM relay`);
    worker.delete(["REQ", "prune", { until: dayjs().subtract(days, "days").unix() }]);
  }
}, 60_000);

const wasmWorkerCache: EventCache = {
  type: "wasm-worker",
  read(filters) {
    return new Observable<NostrEvent>((observer) => {
      const id = nanoid();

      worker
        .query(["REQ", id, ...filters])
        .then((events) => {
          for (let event of events) observer.next(event);
        })
        .catch((err) => observer.error(err))
        .finally(() => observer.complete());
    }).pipe(tap((e) => markFromCache(e)));
  },
  async write(events) {
    return Promise.all(events.map((event) => worker.event(event)));
  },
  async clear() {
    await worker.wipe();
  },
};

if (import.meta.env.DEV) {
  // @ts-expect-error
  window.workerRelay = worker;
}

export default wasmWorkerCache;
