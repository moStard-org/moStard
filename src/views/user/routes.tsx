import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import UserView from ".";
import UserAboutTab from "./about";
import UserNotesTab from "./notes";
import UserArticlesTab from "./articles";
import UserPicturePostsTab from "./media-posts";

// other stuff
const UserStreamsTab = lazy(() => import("./streams"));
const UserTracksTab = lazy(() => import("./tracks"));
const UserFilesTab = lazy(() => import("./files"));
const UserVideosTab = lazy(() => import("./videos"));
const UserReactionsTab = lazy(() => import("./reactions"));
const UserListsTab = lazy(() => import("./lists"));
const UserFollowersTab = lazy(() => import("./followers"));
const UserFollowingTab = lazy(() => import("./following"));
const UserEmojiPacksTab = lazy(() => import("./emoji-packs"));
const UserRelaysTab = lazy(() => import("./relays"));
const UserReportsTab = lazy(() => import("./reports"));
const UserMutedByTab = lazy(() => import("./muted-by"));
const UserMessagesTab = lazy(() => import("./messages"));
const UserTorrentsTab = lazy(() => import("./torrents"));

export default [
	{
		Component: UserView,
		children: [
			{ index: true, Component: UserAboutTab },
			{ path: "about", Component: UserAboutTab },
			{ path: "notes", Component: UserNotesTab },
			{ path: "articles", Component: UserArticlesTab },
			{ path: "media", Component: UserPicturePostsTab },
			{ path: "streams", Component: UserStreamsTab },
			{ path: "tracks", Component: UserTracksTab },
			{ path: "videos", Component: UserVideosTab },
			{ path: "files", Component: UserFilesTab },
			{ path: "reactions", Component: UserReactionsTab },
			{ path: "lists", Component: UserListsTab },
			{ path: "followers", Component: UserFollowersTab },
			{ path: "following", Component: UserFollowingTab },
			{ path: "emojis", Component: UserEmojiPacksTab },
			{ path: "relays", Component: UserRelaysTab },
			{ path: "reports", Component: UserReportsTab },
			{ path: "muted-by", Component: UserMutedByTab },
			{ path: "dms", Component: UserMessagesTab },
			{ path: "torrents", Component: UserTorrentsTab },
		],
	},
] satisfies RouteObject[];
