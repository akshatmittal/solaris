import React, { useCallback, useRef } from "react";

import * as stylex from "@stylexjs/stylex";
import { UserRejectedRequestError } from "viem";
import { useConnection, useSignMessage } from "wagmi";

import { reset } from "../../css/reset";
import { colors, motion } from "../../css/vars.stylex";
import { isMobile } from "../../utils/isMobile";
import { ActionButton } from "../Button/ActionButton";
import { DialogHeader } from "../Dialog/DialogHeader";
import { SignatureIcon } from "../Icons/FeatureIcons";
import { IconTile } from "../Icons/IconTile";
import { useAuthenticationAdapter } from "../RainbowKitProvider/AuthenticationContext";
import { Text } from "../Text/Text";

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
    padding: 16,
    paddingBottom: 16,
  },
  content: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginInline: "auto",
    marginTop: -32,
    maxWidth: 296,
    // Overlaps the header row; let clicks reach the close button.
    pointerEvents: "none",
    textAlign: "center",
  },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  actions: {
    alignItems: "stretch",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingInline: 8,
  },
  cancel: {
    alignSelf: "center",
    borderRadius: 9999,
    color: colors.modalText,
    fontSize: 15,
    fontWeight: 500,
    minHeight: 44,
    opacity: { default: 1, ":hover": 0.7 },
    paddingInline: 12,
    transitionDuration: motion.fast,
    transitionProperty: "opacity",
    transitionTimingFunction: "ease-out",
  },
});

export function SignIn({ onClose, onCloseModal }: { onClose: () => void; onCloseModal: () => void }) {
  const [{ status, ...state }, setState] = React.useState<{
    status: "idle" | "creatingMessage" | "signing" | "verifying";
    errorMessage?: string;
    nonce?: string;
  }>({ status: "idle" });

  const authAdapter = useAuthenticationAdapter();

  const getNonce = useCallback(async () => {
    setState((x) => ({ ...x, errorMessage: undefined, status: "creatingMessage" }));
    try {
      const nonce = await authAdapter.getNonce();
      setState((x) => ({ ...x, nonce, status: "idle" }));
    } catch {
      setState((x) => ({
        ...x,
        errorMessage: "Error preparing message, please retry!",
        status: "idle",
      }));
    }
  }, [authAdapter]);

  // Pre-fetch nonce when screen is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  const onceRef = useRef(false);
  React.useEffect(() => {
    if (onceRef.current) return;
    onceRef.current = true;

    getNonce();
  }, [getNonce]);

  const mobile = isMobile();
  const { address, chain: activeChain } = useConnection();
  const { mutateAsync: signMessage } = useSignMessage();
  const canRetryNonce = status === "idle" && !state.nonce && !!state.errorMessage;

  const signIn = async () => {
    try {
      const chainId = activeChain?.id;
      const { nonce } = state;

      if (!address || !chainId || !nonce) {
        return;
      }

      setState((x) => ({
        ...x,
        errorMessage: undefined,
      }));

      let message: Awaited<ReturnType<typeof authAdapter.createMessage>>;
      try {
        const messageResult = authAdapter.createMessage({ address, chainId, nonce });

        if (messageResult instanceof Promise) {
          setState((x) => ({ ...x, status: "creatingMessage" }));
        }

        message = await messageResult;
      } catch {
        return setState((x) => ({
          ...x,
          errorMessage: "Error preparing message, please retry!",
          status: "idle",
        }));
      }

      let signature: string;

      try {
        setState((x) => ({ ...x, status: "signing" }));

        signature = await signMessage({
          message,
        });
      } catch (error) {
        if (error instanceof UserRejectedRequestError) {
          // It's not really an "error" so we silently ignore and reset to idle state
          return setState((x) => ({
            ...x,
            status: "idle",
          }));
        }

        return setState((x) => ({
          ...x,
          errorMessage: "Error signing message, please retry!",
          status: "idle",
        }));
      }

      setState((x) => ({ ...x, status: "verifying" }));

      try {
        const verified = await authAdapter.verify({ message, signature });

        if (verified) {
          // This will ensure that 'connectModalOpen' state doesn't
          // stay to true after a successful authentication
          onCloseModal();
          return;
        }

        throw new Error();
      } catch {
        // Backends usually consume the nonce on verify, so the retry fetches a new one.
        return setState((x) => ({
          ...x,
          errorMessage: "Error verifying signature, please retry!",
          nonce: undefined,
          status: "idle",
        }));
      }
    } catch {
      setState((x) => ({
        ...x,
        errorMessage: "Oops, something went wrong!",
        status: "idle",
      }));
    }
  };

  return (
    <div {...stylex.props(styles.container)}>
      <DialogHeader onClose={onClose} />
      <div {...stylex.props(styles.content)}>
        <IconTile>
          <SignatureIcon />
        </IconTile>
        <div {...stylex.props(styles.text)}>
          <Text
            align="center"
            color="modalText"
            size="18"
            weight="semibold"
          >
            Verify Account
          </Text>
          <Text
            align="center"
            color="modalTextSecondary"
            size="14"
            weight="regular"
          >
            Sign a message in your wallet to confirm you own this account. It does not send a transaction or cost gas.
          </Text>
          {status === "idle" && state.errorMessage ? (
            <Text
              align="center"
              color="error"
              size="14"
              weight="semibold"
            >
              {state.errorMessage}
            </Text>
          ) : null}
        </div>
      </div>
      <div {...stylex.props(styles.actions)}>
        <ActionButton
          disabled={status !== "idle" || (!state.nonce && !canRetryNonce)}
          fullWidth
          label={
            canRetryNonce
              ? "Retry"
              : !state.nonce || status === "creatingMessage"
                ? "Preparing message…"
                : status === "signing"
                  ? "Waiting for signature…"
                  : status === "verifying"
                    ? "Verifying signature…"
                    : "Sign Message"
          }
          onClick={canRetryNonce ? getNonce : signIn}
          size={mobile ? "large" : "medium"}
          testId="auth-message-button"
        />
        {mobile ? (
          <ActionButton
            fullWidth
            label="Cancel"
            onClick={onClose}
            size="large"
            type="secondary"
          />
        ) : (
          <button
            {...stylex.props(reset.button, styles.cancel)}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
