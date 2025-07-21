import { Link, Text } from "@chakra-ui/react";
import type { ComponentMap } from "applesauce-react/hooks";
import { Link as RouterLink } from "react-router-dom";

import BipDefinition from "./components/bip";
import { ImageGallery } from "./components/gallery";
import { InlineEmoji } from "./components/ininle-emoji";
import MoneroDefinition from "./components/monero";
import { NostrMentionCard } from "./components/mention";
import NipDefinition from "./components/nip";

export const components: ComponentMap = {
  text: ({ node }) => <Text as="span">{node.value}</Text>,
  mention: NostrMentionCard,
  emoji: ({ node }) => <InlineEmoji url={node.url} code={node.code} />,
  hashtag: ({ node }) => (
    <Link as={RouterLink} to={`/t/${node.hashtag}`} color="blue.500">
      #{node.name}
    </Link>
  ),
  nip: NipDefinition,
  bip: BipDefinition,
  gallery: ({ node }) => <ImageGallery images={node.links} />,
  monero: MoneroDefinition,
};
