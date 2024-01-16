/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

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
  address: string,
  setAddress: Dispatch<SetStateAction<string>>,

  //These are assumed to remain constant, but included because they are chain-specific
  disconnect: () => {},
}

const ChainContext = createContext<ChainContextType>({
  loggedIn: false,
  setLoggedIn: () => { },
  disconnect: async () => { },
  address: '',
  setAddress: () => { },
  chain: 'Default',
  setChain: () => { },
});

type Props = {
  children?: React.ReactNode
};

export const ChainContextProvider: React.FC<Props> = ({ children }) => {
  const [chain, setChain] = useState<string>('Ethereum');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  const disconnect = async () => {
    setLoggedIn(false);
    setAddress('');

    //TODO: Handle disconnecting from session
  }

  const chainContext: ChainContextType = {
    chain,
    setChain,
    loggedIn,
    setLoggedIn,
    address,
    setAddress,
    disconnect,
  };

  return <ChainContext.Provider value={chainContext}>
    {children}
  </ChainContext.Provider>;
}


export const useChainContext = () => useContext(ChainContext);

