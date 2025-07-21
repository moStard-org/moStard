import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Heading,
	Text,
} from "@chakra-ui/react";

import useCacheRelay from "../../../../hooks/use-cache-relay";
import localSettings from "../../../../services/local-settings";

export default function HostedRelayCard() {
	const cacheRelay = useCacheRelay();
	const enabled = cacheRelay?.url.includes(location.host + "/local-relay");
	const enable = () => {
		localSettings.cacheRelayURL.clear();
	};

	return (
		<Card borderColor={enabled ? "primary.500" : undefined} variant="outline">
			<CardHeader p="4" display="flex" gap="2" alignItems="center">
				<Heading size="md">Hosted Relay</Heading>
				<Button
					size="sm"
					colorScheme="primary"
					ml="auto"
					onClick={enable}
					isDisabled={enabled}
				>
					{enabled ? "Enabled" : "Enable"}
				</Button>
			</CardHeader>
			<CardBody p="4" pt="0">
				<Text mb="2">
					Your installation of moStard is setup with a local relay that can be
					used as a cache
				</Text>
				<Text>Maximum capacity: Unknown</Text>
				<Text>Performance: Unknown, but probably fast...</Text>
			</CardBody>
		</Card>
	);
}
