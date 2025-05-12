'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create React Query client
const queryClient = new QueryClient();

// Create wagmi config
const { connectors } = getDefaultWallets({
  appName: 'MilegoMaker Gallery',
  projectId: '3fbb7cf2d2b736b0270551f87e43836a', // Temporary development ID - replace with your own for production
  chains: [mainnet]
});

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  },
  connectors
});

export function Web3Provider({ children }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[mainnet]}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
} 