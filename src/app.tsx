import { lazy, Suspense } from "react";
import { Spinner } from "@chakra-ui/react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import GlobalStyles from "./styles";

import { ErrorBoundary } from "./components/error-boundary";
import AppLayout from "./components/layout";
import { RouteProviders } from "./providers/route";

import TaskManagerProvider from "./views/task-manager/provider";

// one off views
import NoteFoundView from "./views/404";
import NostrLinkView from "./views/link";
import HomeView from "./views/home";
import ThreadView from "./views/thread";
import SearchView from "./views/search";
import NotificationsView from "./views/notifications";
import OtherStuffView from "./views/other-stuff";

const TracksView = lazy(() => import("./views/tracks"));
const MapView = lazy(() => import("./views/map"));
const HashTagView = lazy(() => import("./views/hashtag"));

// routes
import signinRoutes from "./views/signin/routes";
import signupRoutes from "./views/signup/routes";
import userRoutes from "./views/user/routes";
import newRoutes from "./views/new/routes";
import settingsRoutes from "./views/settings/routes";
import relaysRoutes from "./views/relays/routes";
import videosRoutes from "./views/videos/routes";
import picturesRoutes from "./views/pictures/routes";
import streamsRoutes from "./views/streams/routes";
import toolsRoutes from "./views/tools/routes";
import discoveryRoutes from "./views/discovery/routes";
import wikiRoutes from "./views/wiki/routes";
import filesRoutes from "./views/files/routes";
import messagesRoutes from "./views/messages/routes";
import listsRoutes from "./views/lists/routes";
import bookmarksRoutes from "./views/bookmarks/routes";
import articlesRoutes from "./views/articles/routes";
import torrentsRoutes from "./views/torrents/routes";
import channelsRoutes from "./views/channels/routes";
import groupsRoutes from "./views/groups/routes";
import relayChatRoutes from "./views/relay-chat/routes";
import badgesRoutes from "./views/badges/routes";
import emojisRoutes from "./views/emojis/routes";

// Redirect old hash routing
const hashPath = window.location.hash.match(/^#(\/.+)/);
if (hashPath) window.history.replaceState({}, "", hashPath[1]);

const RootPage = () => {
	return (
		<RouteProviders>
			<AppLayout />
		</RouteProviders>
	);
};

const NoLayoutPage = () => {
	return (
		<RouteProviders>
			<Outlet />
		</RouteProviders>
	);
};

const router = createBrowserRouter(
	[
		{ path: "*", Component: NoteFoundView },
		{
			path: "signin",
			Component: NoLayoutPage,
			children: signinRoutes,
		},
		{
			path: "signup",
			Component: NoLayoutPage,
			children: signupRoutes,
		},
		{
			Component: RootPage,
			children: [
				{ index: true, Component: HomeView },
				{ path: "notes", Component: HomeView },
				{ path: "new", children: newRoutes },
				{ path: "messages", children: messagesRoutes },
				{ path: "user/:pubkey", children: userRoutes },
				{ path: "u/:pubkey", children: userRoutes },
				{ path: "note/:id", Component: ThreadView },
				{ path: "n/:id", Component: ThreadView },
				{ path: "search", Component: SearchView },
				{ path: "other-stuff", Component: OtherStuffView },
				{ path: "settings", children: settingsRoutes },
				{ path: "relays", children: relaysRoutes },
				{ path: "notifications", Component: NotificationsView },
				{ path: "pictures", children: picturesRoutes },
				{ path: "streams", children: streamsRoutes },
				{ path: "groups", children: groupsRoutes },
				{ path: "relay-chat", children: relayChatRoutes },
				{ path: "tools", children: toolsRoutes },
				{ path: "discovery", children: discoveryRoutes },
				{ path: "wiki", children: wikiRoutes },
				{ path: "l/:link", Component: NostrLinkView },
				{ path: "t/:hashtag", Component: HashTagView },

				// other stuff
				{ path: "articles", children: articlesRoutes },
				{ path: "bookmarks", children: bookmarksRoutes },
				{ path: "lists", children: listsRoutes },
				{ path: "files", children: filesRoutes },
				{ path: "tracks", Component: TracksView },
				{ path: "map", Component: MapView },
				{ path: "videos", children: videosRoutes },
				{ path: "torrents", children: torrentsRoutes },
				{ path: "channels", children: channelsRoutes },
				{ path: "badges", children: badgesRoutes },
				{ path: "emojis", children: emojisRoutes },
			],
		},
	],
	{ future: { v7_relativeSplatPath: true } },
);

export const App = () => (
	<ErrorBoundary>
		<GlobalStyles />
		<TaskManagerProvider parentRouter={router}>
			<Suspense fallback={<Spinner />}>
				<RouterProvider router={router} />
			</Suspense>
		</TaskManagerProvider>
	</ErrorBoundary>
);
