export { ConnectButton } from "./components/ConnectButton/ConnectButton";
export { ChainSelectButton } from "./components/ChainSelectButton/ChainSelectButton";
export { WalletButton, type WalletButtonRendererProps } from "./components/WalletButton/WalletButton";
export {
  SolarisEthereumProvider,
  type SolarisEthereumProviderProps,
} from "./components/SolarisEthereumProvider/SolarisEthereumProvider";
export { getDefaultConfig } from "./config/getDefaultConfig";
export { getDefaultWallets } from "./wallets/getDefaultWallets";
export { getWalletConnectConnector } from "./wallets/getWalletConnectConnector";
export { connectorsForWallets } from "./wallets/connectorsForWallets";
export { useAccountModal, useChainModal, useConnectModal } from "./components/SolarisEthereumProvider/ModalContext";
export { useAddRecentTransaction } from "./transactions/useAddRecentTransaction";
export {
  SolarisAuthenticationProvider,
  createAuthenticationAdapter,
} from "./components/SolarisEthereumProvider/AuthenticationContext";
export type { Wallet, WalletList, WalletDetailsParams, SolarisWalletConnectParameters } from "./wallets/Wallet";
export type { Theme } from "./components/SolarisEthereumProvider/SolarisEthereumProvider";
export type { ChainSelectButtonProps, ChainStatus } from "./components/ChainSelectButton/ChainSelectButton";
export type {
  AuthenticationStatus,
  AuthenticationConfig,
} from "./components/SolarisEthereumProvider/AuthenticationContext";
export type { DisclaimerComponent } from "./components/SolarisEthereumProvider/AppContext";
export type { AvatarComponent } from "./components/SolarisEthereumProvider/AvatarContext";
export type { SolarisChain as Chain } from "./components/SolarisEthereumProvider/SolarisChainContext";
export { lightTheme } from "./themes/lightTheme";
export { darkTheme } from "./themes/darkTheme";
export { midnightTheme } from "./themes/midnightTheme";
export { cssStringFromTheme } from "./css/cssStringFromTheme";
export { cssObjectFromTheme } from "./css/cssObjectFromTheme";
