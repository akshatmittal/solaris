import React, { type ReactNode, useContext } from "react";

import { touchableStyles } from "../../css/touchableStyles";
import { t } from "../../translations";
import { Box } from "../Box/Box";
import { CloseButton } from "../CloseButton/CloseButton";
import { DisclaimerLink } from "../Disclaimer/DisclaimerLink";
import { DisclaimerText } from "../Disclaimer/DisclaimerText";
import { BackIcon } from "../Icons/Back";
import { InfoButton } from "../InfoButton/InfoButton";
import { AppContext } from "../RainbowKitProvider/AppContext";
import { Text } from "../Text/Text";
import { ScrollClassName, sidebar, sidebarCompactMode } from "./DesktopOptions.css";

export interface ConnectModalShellViewProps {
  compactModeEnabled: boolean;
  onClose: () => void;
  onCompactInfoClick: () => void;
  onRightPaneBack?: () => void;
  rightPaneContent: ReactNode;
  rightPaneHeaderLabel?: ReactNode;
  showRightPane: boolean;
  showSidebar: boolean;
  titleId: string;
  walletList: ReactNode;
}

/**
 * Chain-agnostic desktop connect-modal chrome: the wallet-list sidebar
 * (with compact-mode header and disclaimer/learn-more footer) plus the
 * right-hand pane with its back/label/close header. The EVM DesktopOptions
 * and the Solana connect modal both parameterize this shell.
 */
export function ConnectModalShellView({
  compactModeEnabled,
  onClose,
  onCompactInfoClick,
  onRightPaneBack,
  rightPaneContent,
  rightPaneHeaderLabel,
  showRightPane,
  showSidebar,
  titleId,
  walletList,
}: ConnectModalShellViewProps) {
  const { disclaimer: Disclaimer } = useContext(AppContext);

  return (
    <Box
      display="flex"
      flexDirection="row"
      style={{ maxHeight: compactModeEnabled ? 468 : 504 }}
    >
      {showSidebar && (
        <Box
          className={compactModeEnabled ? sidebarCompactMode : sidebar}
          display="flex"
          flexDirection="column"
          marginTop="16"
        >
          <Box
            display="flex"
            justifyContent="space-between"
          >
            {compactModeEnabled && Disclaimer && (
              <Box
                marginLeft="16"
                width="28"
              >
                <InfoButton onClick={onCompactInfoClick} />
              </Box>
            )}
            {compactModeEnabled && !Disclaimer && (
              <Box
                marginLeft="16"
                width="28"
              />
            )}
            <Box
              marginLeft={compactModeEnabled ? "0" : "6"}
              paddingBottom="8"
              paddingTop="2"
              paddingX="18"
            >
              <Text
                as="h1"
                color="modalText"
                id={titleId}
                size="18"
                weight="heavy"
                testId={"connect-header-label"}
              >
                {t("connect.title")}
              </Text>
            </Box>
            {compactModeEnabled && (
              <Box marginRight="16">
                <CloseButton onClose={onClose} />
              </Box>
            )}
          </Box>
          <Box
            className={ScrollClassName}
            paddingBottom="18"
          >
            {walletList}
          </Box>
          {compactModeEnabled && (
            <>
              <Box
                background="generalBorder"
                height="1"
                marginTop="-1"
              />
              {Disclaimer ? (
                <Box
                  paddingX="24"
                  paddingY="16"
                  textAlign="center"
                >
                  <Disclaimer
                    Link={DisclaimerLink}
                    Text={DisclaimerText}
                  />
                </Box>
              ) : (
                <Box
                  alignItems="center"
                  display="flex"
                  justifyContent="space-between"
                  paddingX="24"
                  paddingY="16"
                >
                  <Box paddingY="4">
                    <Text
                      color="modalTextSecondary"
                      size="14"
                      weight="medium"
                    >
                      {t("connect.new_to_ethereum.description")}
                    </Text>
                  </Box>
                  <Box
                    alignItems="center"
                    display="flex"
                    flexDirection="row"
                    gap="4"
                    justifyContent="center"
                  >
                    <Box
                      className={touchableStyles({
                        active: "shrink",
                        hover: "grow",
                      })}
                      cursor="pointer"
                      onClick={onCompactInfoClick}
                      paddingY="4"
                      style={{ willChange: "transform" }}
                      transition="default"
                    >
                      <Text
                        color="accentColor"
                        size="14"
                        weight="bold"
                      >
                        {t("connect.new_to_ethereum.learn_more.label")}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
      {showRightPane && (
        <>
          {!compactModeEnabled && (
            <Box
              background="generalBorder"
              minWidth="1"
              width="1"
            />
          )}
          <Box
            display="flex"
            flexDirection="column"
            margin="16"
            style={{ flexGrow: 1 }}
          >
            <Box
              alignItems="center"
              display="flex"
              justifyContent="space-between"
              marginBottom="12"
            >
              <Box width="28">
                {onRightPaneBack && (
                  <Box
                    as="button"
                    className={touchableStyles({
                      active: "shrinkSm",
                      hover: "growLg",
                    })}
                    color="accentColor"
                    onClick={onRightPaneBack}
                    paddingX="8"
                    paddingY="4"
                    style={{
                      boxSizing: "content-box",
                      height: 17,
                      willChange: "transform",
                    }}
                    transition="default"
                    type="button"
                  >
                    <BackIcon />
                  </Box>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                style={{ flexGrow: 1 }}
              >
                {rightPaneHeaderLabel && (
                  <Text
                    color="modalText"
                    size="18"
                    textAlign="center"
                    weight="heavy"
                  >
                    {rightPaneHeaderLabel}
                  </Text>
                )}
              </Box>
              <CloseButton onClose={onClose} />
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              style={{ minHeight: compactModeEnabled ? 396 : 432 }}
            >
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                gap="6"
                height="full"
                justifyContent="center"
                marginX="8"
              >
                {rightPaneContent}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
