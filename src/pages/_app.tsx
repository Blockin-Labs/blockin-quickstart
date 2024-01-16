import type { AppProps } from 'next/app';
import { ChainContextProvider } from '../chain_handlers_frontend/ChainContext';
import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChainContextProvider>
      <Component {...pageProps} />
    </ChainContextProvider>
  )
}

export default App
