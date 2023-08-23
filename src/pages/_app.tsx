import type { AppProps } from 'next/app';
import { ChainContextProvider } from '../chain_handlers_frontend/ChainContext';
import { AlgorandContextProvider } from '../chain_handlers_frontend/algorand/AlgorandContext';
import { EthereumContextProvider } from '../chain_handlers_frontend/ethereum/EthereumContext';
import '../styles/globals.css';
import { CosmosContextProvider } from '../chain_handlers_frontend/cosmos/CosmosContext';


const App = ({ Component, pageProps }: AppProps) => {
  return (
    <EthereumContextProvider>
      <AlgorandContextProvider>
        <CosmosContextProvider>
          <ChainContextProvider>
            <Component {...pageProps} />
          </ChainContextProvider>
        </CosmosContextProvider>

      </AlgorandContextProvider>
    </EthereumContextProvider>
  )
}

export default App
