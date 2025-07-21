import { ChatIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	Flex,
	Heading,
	IconButton,
	Image,
	Input,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { parseNIP05Address } from "applesauce-core/helpers";
import { useObservableState } from "applesauce-react/hooks";
import { nip19 } from "nostr-tools";
import { useMemo } from "react";
import { Link as RouterLink, useOutletContext } from "react-router-dom";

import { CopyIconButton } from "../../../components/copy-icon-button";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	ExternalLinkIcon,
	KeyIcon,
	LightningIcon,
	VerifiedIcon,
} from "../../../components/icons";
import Share07 from "../../../components/icons/share-07";
import UserAboutContent from "../../../components/user/user-about-content";
import UserAvatar from "../../../components/user/user-avatar";
import UserDnsIdentity from "../../../components/user/user-dns-identity";
import { UserFollowButton } from "../../../components/user/user-follow-button";
import UserName from "../../../components/user/user-name";
import { getTextColor } from "../../../helpers/color";
import { truncatedId } from "../../../helpers/nostr/event";
import { useSharableProfileId } from "../../../hooks/use-shareable-profile-id";
import { useUserDNSIdentity } from "../../../hooks/use-user-dns-identity";
import useUserProfile from "../../../hooks/use-user-profile";
import { useAdditionalRelayContext } from "../../../providers/local/additional-relay";
import { socialGraph$ } from "../../../services/social-graph";
import DNSIdentityWarning from "../../settings/dns-identity/identity-warning";
import { QrIconButton } from "../components/share-qr-button";
import { UserProfileMenu } from "../components/user-profile-menu";
import UserZapButton from "../components/user-zap-button";
import UserJoinedChannels from "./user-joined-channels";
import UserJoinedGroups from "./user-joined-groups";
import UserPinnedEvents from "./user-pinned-events";
import UserProfileBadges from "./user-profile-badges";
import UserRecentEvents from "./user-recent-events";
import UserStatsAccordion from "./user-stats-accordion";

export default function UserAboutTab() {
	const expanded = useDisclosure();
	const { pubkey } = useOutletContext() as { pubkey: string };
	const contextRelays = useAdditionalRelayContext();
	const colorModal = useDisclosure();

	const metadata = useUserProfile({ pubkey, relays: contextRelays });
	const npub = nip19.npubEncode(pubkey);
	const nprofile = useSharableProfileId(pubkey);
	const pubkeyColor = "#" + pubkey.slice(0, 6);

	const parsedNip05 = metadata?.nip05
		? parseNIP05Address(metadata.nip05)
		: undefined;
	const nip05URL = parsedNip05
		? `https://${parsedNip05.domain}/.well-known/nostr.json?name=${parsedNip05.name}`
		: undefined;

	const identity = useUserDNSIdentity(pubkey);

	const socialGraph = useObservableState(socialGraph$);
	const followedBy = useMemo(
		() =>
			socialGraph &&
			Array.from(socialGraph.followedByFriends(pubkey)).sort(
				() => Math.random() - 0.5,
			),
		[pubkey, socialGraph],
	);

	return (
		<Flex
			overflowY="auto"
			overflowX="hidden"
			direction="column"
			gap="2"
			pt={metadata?.banner ? 0 : "2"}
			pb="8"
			minH="90vh"
			w="full"
			flex={1}
		>
			<Box
				pt={!expanded.isOpen ? "20vh" : 0}
				px={!expanded.isOpen ? "2" : 0}
				pb={!expanded.isOpen ? "4" : 0}
				w="full"
				position="relative"
				backgroundImage={!expanded.isOpen ? metadata?.banner : ""}
				backgroundPosition="center"
				backgroundSize="cover"
				backgroundRepeat="no-repeat"
			>
				{expanded.isOpen && <Image src={metadata?.banner} w="full" />}
				<Flex
					bottom="0"
					right="0"
					left="0"
					p="2"
					position="absolute"
					direction={["column", "row"]}
					bg="linear-gradient(180deg, rgb(255 255 255 / 0%) 0%, var(--chakra-colors-chakra-body-bg) 100%)"
					gap="2"
					alignItems={["flex-start", "flex-end"]}
				>
					<UserAvatar pubkey={pubkey} size={["lg", "lg", "xl"]} noProxy />
					<Box overflow="hidden">
						<Heading isTruncated>
							<UserName pubkey={pubkey} />
						</Heading>
						<UserDnsIdentity pubkey={pubkey} />
					</Box>

					<Flex gap="2" ml="auto">
						<UserZapButton pubkey={pubkey} size="sm" variant="link" />

						<IconButton
							as={RouterLink}
							size="sm"
							icon={<ChatIcon />}
							aria-label="Message"
							to={`/messages/${npub ?? pubkey}`}
						/>
						<UserFollowButton pubkey={pubkey} size="sm" showLists />
						<UserProfileMenu
							pubkey={pubkey}
							aria-label="More Options"
							size="sm"
						/>
					</Flex>
				</Flex>
				<IconButton
					icon={expanded.isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
					aria-label="expand"
					onClick={expanded.onToggle}
					top="2"
					right="2"
					variant="solid"
					position="absolute"
				/>
			</Box>
			<UserAboutContent pubkey={pubkey} />

			<Flex gap="2" px="2" direction="column">
				<Flex gap="2">
					<Box w="5" h="5" backgroundColor={pubkeyColor} rounded="full" />
					<Text>Public key color</Text>
					<Link color="blue.500" onClick={colorModal.onOpen}>
						{pubkeyColor}
					</Link>
				</Flex>

				{metadata?.lud16 && (
					<Flex gap="2">
						<LightningIcon boxSize="1.2em" />
						{/* TODO: monero */}
						{/* <Link */}
						{/* 	href={parseLNURLOrAddress(metadata.lud16)?.toString()} */}
						{/* 	isExternal */}
						{/* > */}
						{/* 	{metadata.lud16} */}
						{/* </Link> */}
					</Flex>
				)}
				{nip05URL && (
					<Box>
						<Flex gap="2">
							<VerifiedIcon boxSize="1.2em" />
							<Link href={nip05URL} isExternal>
								<UserDnsIdentity pubkey={pubkey} />
							</Link>
						</Flex>
						{identity && (
							<DNSIdentityWarning identity={identity} pubkey={pubkey} />
						)}
					</Box>
				)}
				{metadata?.website && (
					<Flex gap="2">
						<ExternalLinkIcon boxSize="1.2em" />
						<Link
							href={metadata.website}
							target="_blank"
							color="blue.500"
							isExternal
						>
							{metadata.website}
						</Link>
					</Flex>
				)}
				<Flex gap="2">
					<KeyIcon boxSize="1.2em" />
					<Text>{truncatedId(npub, 10)}</Text>
					<CopyIconButton
						value={npub}
						title="Copy npub"
						aria-label="Copy npub"
						size="xs"
						variant="ghost"
					/>
					<QrIconButton
						pubkey={pubkey}
						title="Show QrCode"
						aria-label="Show QrCode"
						size="xs"
						variant="ghost"
					/>
				</Flex>

				{followedBy && followedBy.length > 0 && (
					<Flex gap="2">
						<Share07 boxSize="1.2em" />
						<Text>
							Followed by{" "}
							{followedBy.slice(0, 3).map((pubkey, i, arr) => (
								<>
									<UserName pubkey={pubkey} fontWeight="normal" />
									<span>{i < arr.length - 1 && ", "}</span>
								</>
							))}
							{followedBy.length > 3 &&
								` and ${followedBy.length - 3} others you follow`}
						</Text>
					</Flex>
				)}
			</Flex>

			<UserProfileBadges pubkey={pubkey} px="2" />
			<UserPinnedEvents pubkey={pubkey} />
			<Box px="2">
				<Heading size="md">Recent events:</Heading>
				<UserRecentEvents pubkey={pubkey} />
			</Box>
			<UserStatsAccordion pubkey={pubkey} />

			<Flex gap="2" wrap="wrap">
				<Button
					as={Link}
					href={`https://nosta.me/${nprofile}`}
					leftIcon={
						<Image src="https://nosta.me/images/favicon-32x32.png" w="1.2em" />
					}
					rightIcon={<ExternalLinkIcon />}
					isExternal
				>
					Nosta.me page
				</Button>
				<Button
					as={Link}
					href={`https://slidestr.net/${npub}`}
					leftIcon={<Image src="https://slidestr.net/slidestr.svg" w="1.2em" />}
					rightIcon={<ExternalLinkIcon />}
					isExternal
				>
					Slidestr Slideshow
				</Button>
				<Button
					as={Link}
					href={`https://nostree.me/${npub}`}
					leftIcon={<Image src="https://nostree.me/favicon.svg" w="1.2em" />}
					rightIcon={<ExternalLinkIcon />}
					isExternal
				>
					Nostree page
				</Button>
			</Flex>
			<UserJoinedChannels pubkey={pubkey} />

			<Modal isOpen={colorModal.isOpen} onClose={colorModal.onClose} size="2xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader p="4">Public Key Color</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display="flex"
						flexDirection="column"
						px="4"
						pt="0"
						pb="4"
						alignItems="center"
					>
						<Input value={pubkey} readOnly />
						<ChevronDownIcon boxSize={10} />
						<Flex w="full" h="10">
							<Flex
								px="2"
								py="1"
								borderWidth="1px"
								borderStart="solid"
								rounded="md"
								borderColor="primary.500"
								alignItems="center"
							>
								{pubkey.slice(0, 6)}
							</Flex>
							<Flex
								borderWidth="1px"
								borderStyle="solid"
								px="2"
								py="1"
								rounded="md"
								flex="1"
								alignItems="center"
							>
								{pubkey.slice(6)}
							</Flex>
						</Flex>
						<ChevronDownIcon boxSize={10} />
						<Box
							px="10"
							py="2"
							backgroundColor={pubkeyColor}
							rounded="md"
							textColor={
								getTextColor(pubkeyColor.replace("#", "")) === "light"
									? "white"
									: "black"
							}
						>
							{pubkeyColor}
						</Box>

						<Text mt="4">
							The public key color is a hex color code created by taking the
							first 6 digits of a users pubkey.
							<br />
							It can be used to help users identify fake accounts or
							impersonators
						</Text>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Flex>
	);
}
