/* eslint-disable react-hooks/exhaustive-deps */
import { SupportedChainMetadata } from 'blockin';
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
// import { useAlgorandContext } from './algorand/AlgorandContext';
import getConfig from 'next/config';
import { useCosmosContext } from './cosmos/CosmosContext';
import { useEthereumContext } from './ethereum/EthereumContext';
import { useSimulatedContext } from './simulated/SimulatedContext';
import { useSolanaContext } from './solana/SolanaContext';

const { publicRuntimeConfig } = getConfig();

export type SignChallengeResponse = {
  message: string;
  signature: string
}

export type ChainContextType = ChainSpecificContextType & {
  //Global
  chain: string, //Should be consistent with the ChainSelect Props for the UI button
  setChain: Dispatch<SetStateAction<string>>,

  loggedIn: boolean,
  setLoggedIn: Dispatch<SetStateAction<boolean>>,
}

export type ChainSpecificContextType = {
  //Chain Specific
  connected: boolean,
  setConnected: Dispatch<SetStateAction<boolean>>,

  chainId: string,
  setChainId: Dispatch<SetStateAction<string>>,

  address: string,
  setAddress: Dispatch<SetStateAction<string>>,

  //These are assumed to remain constant, but included because they are chain-specific
  disconnect: () => {},
  connect: () => {},
  signChallenge: (challenge: string) => Promise<SignChallengeResponse>,
  
  selectedChainInfo: SupportedChainMetadata | undefined,
}

const ChainContext = createContext<ChainContextType>({
  connected: false,
  setConnected: () => { },
  loggedIn: false,
  setLoggedIn: () => { },
  connect: async () => { },
  disconnect: async () => { },
  chainId: '1',
  setChainId: async () => { },
  address: '',
  setAddress: () => { },
  signChallenge: async () => { return { message: '', signature: '' } },
  chain: 'Default',
  setChain: () => { },
  selectedChainInfo: {},
});

type Props = {
  children?: React.ReactNode
};

export const ChainContextProvider: React.FC<Props> = ({ children }) => {
  const [chain, setChain] = useState<string>(publicRuntimeConfig.IS_DEMO ? 'Simulated' : 'Ethereum');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const ethereumContext = useEthereumContext();
  // const algorandContext = useAlgorandContext();
  const cosmosContext = useCosmosContext();
  const simulatedContext = useSimulatedContext();
  const solanaContext = useSolanaContext();

  useEffect(() => {
    if (chain === 'Ethereum') {
      ethereumContext.setChainId('eth');
    } else if (chain === 'Simulated') {
    } else if (chain === 'Cosmos') {

    } else if (chain === 'Polygon') {
      ethereumContext.setChainId('polygon');
    } else if (chain === 'Avalanche') {
      ethereumContext.setChainId('avalanche');
    } else if (chain === 'BSC') {
      ethereumContext.setChainId('bsc');
    }
    // } else if (chain === 'Algorand Mainnet') {
    //   algorandContext.setChainId('Mainnet');
    // } else if (chain === 'Algorand Testnet') {
    //   algorandContext.setChainId('Testnet');
    // }
  }, [chain, setChain, ethereumContext]);

  let currentChainContext: ChainSpecificContextType;
  // if (chain?.startsWith('Algorand')) {
  //   // currentChainContext = algorandContext;
  // } 

  if (chain?.startsWith('Cosmos')) {
    currentChainContext = cosmosContext;
  } else if (chain?.startsWith('Simulated')) {
    currentChainContext = simulatedContext;
  } else if (chain?.startsWith('Solana')) {
    currentChainContext = solanaContext;
  } else {
    currentChainContext = ethereumContext;
  }


  const chainContext: ChainContextType = {
    chain,
    setChain,
    loggedIn,
    setLoggedIn,
    ...currentChainContext
  };

  return <ChainContext.Provider value={chainContext}>
    {children}
  </ChainContext.Provider>;
}


export const useChainContext = () => useContext(ChainContext);

