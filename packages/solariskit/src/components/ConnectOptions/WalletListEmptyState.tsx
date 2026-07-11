import React from "react";

import { t } from "../../translations";
import { Box } from "../Box/Box";
import { ActionButton } from "../Button/ActionButton";
import { Text } from "../Text/Text";

export function WalletListEmptyState({
  getWalletUrl,
  showAction = true,
}: {
  getWalletUrl: string;
  showAction?: boolean;
}) {
  return (
    <Box
      alignItems="center"
      display="flex"
      flexDirection="column"
      paddingX="16"
      paddingY="24"
      role="status"
      textAlign="center"
      width="full"
    >
      <Text
        as="h2"
        color="modalText"
        size="16"
        weight="bold"
      >
        {t("connect.empty.title")}
      </Text>
      <Box marginTop="4">
        <Text
          as="p"
          color="modalTextSecondary"
          size="14"
        >
          {t("connect.empty.description")}
        </Text>
      </Box>
      {showAction ? (
        <Box marginTop="16">
          <ActionButton
            href={getWalletUrl}
            label={t("intro.get.label")}
            type="secondary"
          />
        </Box>
      ) : null}
    </Box>
  );
}
