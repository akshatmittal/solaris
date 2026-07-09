import React, { type ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { Address, SignableMessage } from "viem";

import { type Config, useConnection, useConnectionEffect } from "wagmi";

export type AuthenticationStatus = "loading" | "unauthenticated" | "authenticated";

export interface AuthenticationAdapter<Message extends SignableMessage> {
  getNonce: () => Promise<string>;
  createMessage: (args: { nonce: string; address: Address; chainId: number }) => Promise<Message> | Message;
  verify: (args: { message: Message; signature: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
}

export interface AuthenticationConfig<Message extends SignableMessage> {
  adapter: AuthenticationAdapter<Message>;
  status: AuthenticationStatus;
}

// Right now this function only serves to infer the generic Message type
export function createAuthenticationAdapter<Message extends SignableMessage>(adapter: AuthenticationAdapter<Message>) {
  return adapter;
}

const AuthenticationContext = createContext<AuthenticationConfig<SignableMessage> | null>(null);

interface RainbowKitAuthenticationProviderProps<Message extends SignableMessage> extends AuthenticationConfig<Message> {
  enabled?: boolean;
  children: ReactNode;
}

export function RainbowKitAuthenticationProvider<Message extends SignableMessage = SignableMessage>({
  adapter,
  children,
  enabled = true,
  status,
}: RainbowKitAuthenticationProviderProps<Message>) {
  // When the wallet is disconnected, we want to tell the auth
  // adapter that the user session is no longer active.
  const { connector } = useConnection();
  // Used to track whether an active connector is changed to log user out.
  // Wagmi supports multiple connections.
  const [currentConnectorUid, setCurrentConnectorUid] = useState<string>();

  useConnectionEffect({
    onDisconnect: () => {
      adapter.signOut();
      setCurrentConnectorUid(undefined);
    },
  });

  const handleChangedAccount = useCallback(
    (data: Parameters<Config["_internal"]["events"]["change"]>[0]) => {
      // Only if account changes
      if (data.accounts) {
        // If account is changed we automatically log user out.
        // Current connector uid only should be available only at "authenticated"
        setCurrentConnectorUid(undefined);
        adapter.signOut();
      }
    },
    [adapter],
  );

  // Wait for user authentication before listening to "change" event.
  // Avoid listening immediately after wallet connection due to potential SIWE authentication delay.
  // Ensure to turn off the "change" event listener for cleanup.
  useEffect(() => {
    // Wagmi renders emitter's partially on page load. We wanna make sure
    // the event emitters gets updated before proceeding
    if (typeof connector?.emitter?.on === "function" && status === "authenticated") {
      // Set current connector uid
      setCurrentConnectorUid(connector?.uid);

      // Attach the event listener when status is 'authenticated'
      connector.emitter.on("change", handleChangedAccount);

      // Cleanup function to remove the event listener
      return () => {
        connector.emitter.off("change", handleChangedAccount);
      };
    }
  }, [connector?.emitter, connector?.uid, handleChangedAccount, status]);

  useEffect(() => {
    if (currentConnectorUid && typeof connector?.emitter?.on === "function" && status === "authenticated") {
      // If the current connector is not
      // equal to previous connector then logout
      if (connector?.uid !== currentConnectorUid) {
        setCurrentConnectorUid(undefined);
        adapter.signOut();
      }
    }
  }, [adapter, connector?.emitter, connector?.uid, currentConnectorUid, status]);

  return (
    <AuthenticationContext.Provider
      value={useMemo(() => {
        if (!enabled) return null;

        const contextAdapter: AuthenticationAdapter<SignableMessage> = {
          createMessage: adapter.createMessage,
          getNonce: adapter.getNonce,
          signOut: adapter.signOut,
          verify: ({ message, signature }) => adapter.verify({ message: message as Message, signature }),
        };

        return { adapter: contextAdapter, status };
      }, [enabled, adapter, status])}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthenticationAdapter() {
  const { adapter } = useContext(AuthenticationContext) ?? {};

  if (!adapter) {
    throw new Error("No authentication adapter found");
  }

  return adapter;
}

export function useAuthenticationStatus() {
  const contextValue = useContext(AuthenticationContext);

  return contextValue?.status ?? null;
}
