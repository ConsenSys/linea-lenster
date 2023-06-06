import { ApolloProvider, webClient } from '@lenster/lens/apollo';
import getRpc from '@lenster/lib/getRpc';
import getLivepeerTheme from '@lib/getLivepeerTheme';
import { createReactClient, LivepeerConfig, studioProvider } from '@livepeer/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lineaTestnet } from '@wagmi/chains';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import ErrorBoundary from '../ErrorBoundary';
import Layout from '../Layout';
import FeatureFlagsProvider from './FeatureFlagsProvider';
import LanguageProvider from './LanguageProvider';
import LeafwatchProvider from './LeafwatchProvider';
import UserSigNoncesProvider from './UserSigNoncesProvider';

const { chains, publicClient } = configureChains(
  [lineaTestnet],
  [jsonRpcProvider({ rpc: (chain) => ({ http: getRpc(chain.id) }) })]
);

const connectors = [new InjectedConnector({ chains, options: { shimDisconnect: true } })];

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
