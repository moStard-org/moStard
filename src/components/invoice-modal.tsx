import { useState } from "react";
import {
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  type ModalProps,
  useDisclosure,
} from "@chakra-ui/react";

import { ExternalLinkIcon } from "./icons";
import QrCodeSvg from "./qr-code/qr-code-svg";
import { CopyIconButton } from "./copy-icon-button";
import { useBreakpointValue } from "../providers/global/breakpoint-provider";

type CommonProps = { address?: string; amount: number; onPaid: () => void };

export function InvoiceModalContent({ address, amount, onPaid }: CommonProps) {
  const showQr = useDisclosure({ isOpen: true });
  const [payingApp, setPayingApp] = useState(false);
  let uri = "";
  // TODO: tx_payment_id
  if (Number.isNaN("amount")) {
    uri = `monero:${address?.replace(/\s/g, "")}`;
  } else {
    uri = `monero:${address?.replace(/\s/g, "")}?tx_amount=${amount}`;
  }

  const payWithApp = async () => {
    setPayingApp(true);
    window.open(uri);

    const listener = () => {
      if (document.visibilityState === "visible") {
        if (onPaid) onPaid();
        document.removeEventListener("visibilitychange", listener);
        setPayingApp(false);
      }
    };
    setTimeout(() => {
      document.addEventListener("visibilitychange", listener);
    }, 1000 * 2);
  };

  return (
    <Flex gap="2" direction="column">
      {showQr.isOpen && <QrCodeSvg content={uri} xmrIcon />}
      <Flex gap="2">
        <Input value={uri} readOnly />
        <CopyIconButton
          value={uri}
          aria-label="Copy Invoice"
          variant="solid"
          size="md"
        />
      </Flex>
      <Flex gap="2">
        <Button
          leftIcon={<ExternalLinkIcon />}
          onClick={payWithApp}
          flex={1}
          variant="solid"
          size="md"
          isLoading={payingApp}
        >
          Pay in Wallet
        </Button>
      </Flex>
    </Flex>
  );
}

export default function InvoiceModal({
  address,
  amount,
  onClose,
  onPaid,
  ...props
}: Omit<ModalProps, "children"> & CommonProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Modal onClose={onClose} size={isMobile ? "full" : "xl"} {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody padding="4">
          <InvoiceModalContent
            address={address}
            amount={amount}
            onPaid={() => {
              if (onPaid) onPaid();
              onClose();
            }}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
