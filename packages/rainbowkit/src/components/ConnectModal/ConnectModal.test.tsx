import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { mainnet } from 'wagmi/chains';
import { renderWithProviders } from '../../../test';
import { ConnectModal } from './ConnectModal';

describe('<ConnectModal />', () => {
  const renderHeaderLabelModal = async () => {
    renderWithProviders(<ConnectModal onClose={() => {}} open={true} />, {
      props: {
        chains: [mainnet],
      },
    });

    return screen.getByTestId('rk-connect-header-label');
  };

  it('Displays the default English title', async () => {
    const modal = await renderHeaderLabelModal();
    await waitFor(() => expect(modal.textContent).toBe('Connect a Wallet'));
  });
});
