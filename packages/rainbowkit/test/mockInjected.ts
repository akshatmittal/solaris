import type { Address } from 'viem';
import { vi } from 'vitest';
import { injectedWallet } from '../src/wallets/walletConnectors/injectedWallet/injectedWallet';

export const injectedTestAccounts: readonly [Address, ...Address[]] = [
  '0x1111111111111111111111111111111111111111',
  '0x2222222222222222222222222222222222222222',
  '0x3333333333333333333333333333333333333333',
];

const sharedRequest = async ({ method }: { method: string; params?: unknown[] }) => {
  switch (method) {
    case 'eth_requestAccounts':
    case 'eth_accounts':
      return [injectedTestAccounts[0]];
    case 'eth_chainId':
      return '0x1';
    case 'personal_sign':
      return '0xmocked_signature';
    default:
      throw new Error(`Unhandled method: ${method}`);
  }
};

export const mockInjected1193Provider = () => ({
  request: vi.fn(sharedRequest),
  on: vi.fn(),
  removeListener: vi.fn(),
  emit: vi.fn(),
});

export const mockInjected6963Provider = () => ({
  info: {
    uuid: 'browser-wallet',
    name: 'Browser Wallet',
    icon: 'data:image/svg+xml;base64,browser_wallet_icon',
    rdns: 'com.browser.wallet',
  },
  provider: {
    request: vi.fn(sharedRequest),
    on: vi.fn(),
    removeListener: vi.fn(),
    emit: vi.fn(),
  },
});

export { injectedWallet } from '../src/wallets/walletConnectors/injectedWallet/injectedWallet';

export const mockWallet = {
  setupEIP1193: () => {
    if (typeof window !== 'undefined') {
      (window as any).ethereum = mockInjected1193Provider();
    }
  },

  setupEIP6963: () => {
    const provider = mockInjected6963Provider();

    if (typeof window !== 'undefined') {
      const announceProvider = () => {
        const event = new CustomEvent('eip6963:announceProvider', {
          detail: provider,
        });
        window.dispatchEvent(event);
      };

      announceProvider();
      window.addEventListener('eip6963:requestProvider', announceProvider);

      (window as any).__eip6963Listeners =
        (window as any).__eip6963Listeners || [];
      (window as any).__eip6963Listeners.push(announceProvider);
    }
  },

  cleanup: () => {
    if (typeof window !== 'undefined') {
      delete (window as any).ethereum;

      const listeners = (window as any).__eip6963Listeners;
      if (listeners) {
        for (const listener of listeners) {
          window.removeEventListener('eip6963:requestProvider', listener);
        }
        delete (window as any).__eip6963Listeners;
      }
    }
  },
};

export {
  walletConnectServer,
  setupMatchMedia,
  setupLocalStorage,
  setupWalletConnectMocks,
  cleanupWalletConnectMocks,
  closeWalletConnectServer,
} from './mockWalletConnect';
