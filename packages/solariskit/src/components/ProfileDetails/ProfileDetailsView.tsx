import React, { type ReactNode, useCallback, useEffect, useState } from "react";

import { t } from "../../translations";
import { isMobile } from "../../utils/isMobile";
import { Avatar } from "../Avatar/Avatar";
import { Box } from "../Box/Box";
import { CloseButton } from "../CloseButton/CloseButton";
import { CopiedIcon } from "../Icons/Copied";
import { CopyIcon } from "../Icons/Copy";
import { DisconnectIcon } from "../Icons/Disconnect";
import { Text } from "../Text/Text";
import { ProfileDetailsAction } from "./ProfileDetailsAction";

export interface ProfileDetailsViewProps {
  accountName: string;
  address: string;
  avatarImageUrl?: string;
  balanceLabel?: string;
  onClose: () => void;
  onDisconnect: () => void;
  transactions?: ReactNode;
}

export function ProfileDetailsView({
  accountName,
  address,
  avatarImageUrl,
  balanceLabel,
  onClose,
  onDisconnect,
  transactions,
}: ProfileDetailsViewProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const copyAddressAction = useCallback(() => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
  }, [address]);

  useEffect(() => {
    if (copiedAddress) {
      const timer = setTimeout(() => {
        setCopiedAddress(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [copiedAddress]);

  const titleId = "rk_profile_title";
  const mobile = isMobile();

  return (
    <Box
      display="flex"
      flexDirection="column"
    >
      <Box
        background="profileForeground"
        padding="16"
      >
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          gap={mobile ? "16" : "12"}
          justifyContent="center"
          margin="8"
          style={{ textAlign: "center" }}
        >
          <Box
            style={{
              position: "absolute",
              right: 16,
              top: 16,
              willChange: "transform",
            }}
          >
            <CloseButton onClose={onClose} />
          </Box>{" "}
          <Box marginTop={mobile ? "24" : "0"}>
            <Avatar
              address={address}
              imageUrl={avatarImageUrl}
              size={mobile ? 82 : 74}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={mobile ? "4" : "0"}
            textAlign="center"
          >
            <Box textAlign="center">
              <Text
                as="h1"
                color="modalText"
                id={titleId}
                size={mobile ? "20" : "18"}
                weight="heavy"
              >
                {accountName}
              </Text>
            </Box>
            {balanceLabel && (
              <Box textAlign="center">
                <Text
                  as="h1"
                  color="modalTextSecondary"
                  id={titleId}
                  size={mobile ? "16" : "14"}
                  weight="semibold"
                >
                  {balanceLabel}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          gap="8"
          margin="2"
          marginTop="16"
        >
          <ProfileDetailsAction
            action={copyAddressAction}
            icon={copiedAddress ? <CopiedIcon /> : <CopyIcon />}
            label={copiedAddress ? t("profile.copy_address.copied") : t("profile.copy_address.label")}
          />
          <ProfileDetailsAction
            action={onDisconnect}
            icon={<DisconnectIcon />}
            label={t("profile.disconnect.label")}
            testId="disconnect-button"
          />
        </Box>
      </Box>
      {transactions ? (
        <>
          <Box
            background="generalBorder"
            height="1"
            marginTop="-1"
          />
          <Box>{transactions}</Box>
        </>
      ) : null}
    </Box>
  );
}
