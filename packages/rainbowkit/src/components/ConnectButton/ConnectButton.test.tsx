import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { mainnet } from 'wagmi/chains';
import { renderWithProviders } from '../../../test';
import { ConnectButton } from './ConnectButton';

describe('<ConnectButton />', () => {
  const renderTextButton = () => {
    renderWithProviders(<ConnectButton />, {
      props: {
        chains: [mainnet],
      },
    });

    return screen.getByTestId('rk-connect-button');
  };

  it('Displays the default English label', async () => {
    const button = renderTextButton();
    await waitFor(() => expect(button.textContent).toBe('Connect Wallet'));
  });
});
