import "./polyfill";

import { GlobalProviders } from "./providers/global";
import { registerServiceWorker } from "./services/worker";

import "./services/debug-api";
import "./services/lifecycle";
import "./services/username-search";
import "./services/decryption-cache";

// setup dayjs
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTimePlugin from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTimePlugin);
dayjs.extend(localizedFormat);

// register nostr: protocol handler
if (import.meta.env.PROD) {
	try {
		navigator.registerProtocolHandler(
			"web+nostr",
			new URL("/l/%s", location.origin).toString(),
		);
	} catch (e) {
		console.log("Failed to register handler");
	}
}

// mount react app
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { logger } from "./helpers/debug";
import { IS_SERVICE_WORKER_SUPPORTED } from "./env";

logger("Rendering app");
const root = document.getElementById("root")!;
createRoot(root).render(
	<GlobalProviders>
		<App />
	</GlobalProviders>,
);

// Register service worker if supported
if (IS_SERVICE_WORKER_SUPPORTED) registerServiceWorker();
