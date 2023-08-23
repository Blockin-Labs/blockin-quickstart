import type { AppProps } from 'next/app';
import { ChainContextProvider } from '../chain_handlers_frontend/ChainContext';
import { AlgorandContextProvider } from '../chain_handlers_frontend/algorand/AlgorandContext';
import { CosmosContextProvider } from '../chain_handlers_frontend/cosmos/CosmosContext';
import { EthereumContextProvider } from '../chain_handlers_frontend/ethereum/EthereumContext';
import '../styles/globals.css';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const chains = [mainnet]
const projectId = '' //TODO: Add your own WalletConnect project ID here

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
})
const ethereumClient = new EthereumClient(wagmiClient, chains)
const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiClient}>
        <EthereumContextProvider>
          <AlgorandContextProvider>
            <CosmosContextProvider>
              <ChainContextProvider>

                <Web3Modal projectId={projectId} ethereumClient={ethereumClient}
                  themeMode="dark"
                />
                <Component {...pageProps} />

              </ChainContextProvider>
            </CosmosContextProvider>

          </AlgorandContextProvider>
        </EthereumContextProvider>

      </WagmiConfig>
    </QueryClientProvider >
  )
}

export default App
