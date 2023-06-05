import { WALLETCONNECT_PROJECT_ID } from '@lenster/data/constants';
import { ApolloProvider, webClient } from '@lenster/lens/apollo';
import getLivepeerTheme from '@lib/getLivepeerTheme';
import { createReactClient, LivepeerConfig, studioProvider } from '@livepeer/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import type { Chain } from 'wagmi';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import ErrorBoundary from '../ErrorBoundary';
import Layout from '../Layout';
import FeatureFlagsProvider from './FeatureFlagsProvider';
import LanguageProvider from './LanguageProvider';
import LeafwatchProvider from './LeafwatchProvider';
import UserSigNoncesProvider from './UserSigNoncesProvider';

// Web3
export const linea = {
  id: 59_140,
  name: 'Linea',
  network: 'linea',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH'
  },
  rpcUrls: {
    public: { http: ['https://rpc.goerli.linea.build'] },
    default: { http: ['https://rpc.goerli.linea.build'] }
  },
  blockExplorers: {
    default: { name: 'BlockScout', url: 'https://explorer.goerli.linea.build/' }
  }
} as const satisfies Chain;

export const CHAIN_ID = linea.id;

const { chains, publicClient } = configureChains(
  [linea],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: `https://rpc.goerli.linea.build`
      })
    })
  ]
);

const connectors = [
  new InjectedConnector({ chains, options: { shimDisconnect: true } }),
  new WalletConnectConnector({
    options: { projectId: WALLETCONNECT_PROJECT_ID },
    chains
  })
];

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: '' })
});

const queryClient = new QueryClient();
const apolloClient = webClient;

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <LanguageProvider>
      <ErrorBoundary>
        <FeatureFlagsProvider />
        <LeafwatchProvider />
        <WagmiConfig config={wagmiConfig}>
          <ApolloProvider client={apolloClient}>
            <UserSigNoncesProvider />
            <QueryClientProvider client={queryClient}>
              <LivepeerConfig client={livepeerClient} theme={getLivepeerTheme}>
                <ThemeProvider defaultTheme="light" attribute="class">
                  <Layout>{children}</Layout>
                </ThemeProvider>
              </LivepeerConfig>
            </QueryClientProvider>
          </ApolloProvider>
        </WagmiConfig>
      </ErrorBoundary>
    </LanguageProvider>
  );
};

export default Providers;
