import { disconnect as disconnectWeb3 } from "@wagmi/core";
import { PresetAsset, PresetUri } from 'blockin';
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from "wagmi";
import Web3Modal from "web3modal";
import { ChainSpecificContextType } from '../ChainContext';
export type SimulatedContextType = ChainSpecificContextType & {
  web3Modal?: Web3Modal,
  setWeb3Modal: Dispatch<SetStateAction<Web3Modal | undefined>>;
}

export const SimulatedContext = createContext<SimulatedContextType>({
  web3Modal: undefined,
  setWeb3Modal: () => { },
  connect: async () => { },
  disconnect: async () => { },
  chainId: 'Mainnet',
  setChainId: () => { },
  address: '',
  setAddress: () => { },
  signChallenge: async () => { return { message: '', signature: '' } },
  ownedAssetIds: [],
  displayedResources: [],
  selectedChainInfo: {},
  connected: false,
  setConnected: () => { },
  displayedAssets: [],
})


type Props = {
  children?: React.ReactNode
};

export const SimulatedContextProvider: React.FC<Props> = ({ children }) => {
  const web3AccountContext = useAccount();
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const [address, setAddress] = useState<string>('')
  const [connected, setConnected] = useState<boolean>(false);
  const [chainId, setChainId] = useState<string>('Mainnet');

  const selectedChainInfo = {};
  const displayedResources: PresetUri[] = []; //This can be dynamic based on Chain ID if you want to give different token addresses for different Chain IDs
  const displayedAssets: PresetAsset<bigint>[] = []; //This can be dynamic based on Chain ID if you want to give different token addresses for different Chain IDs
  //If you would like to support this, you can call this with a useEffect every time connected or address is updated
  const ownedAssetIds: string[] = [];

  useEffect(() => {
    async function setDetails() {
      if (web3AccountContext.address) {
        setAddress(web3AccountContext.address);

        setConnected(true);
      } else {
        setConnected(false);
      }
    }

    setDetails();
  }, [web3AccountContext.address,])

  const connect = async () => {
    setConnected(true);
    setAddress('0x1234567890123456789012345678901234567890');
  }

  const disconnect = async () => {
    setAddress('');
    setConnected(false);
    await disconnectWeb3();
  };

  const signChallenge = async () => {
    return { message: '', signature: '' };
  }

  const simulatedContext: SimulatedContextType = {
    connected,
    setConnected,
    chainId,
    setChainId,
    connect,
    disconnect,
    ownedAssetIds,
    selectedChainInfo,
    displayedResources,
    displayedAssets,
    signChallenge,
    address,
    setAddress,
    web3Modal,
    setWeb3Modal
  };

  return <SimulatedContext.Provider value={simulatedContext}>
    {children}
  </ SimulatedContext.Provider>
}

export const useSimulatedContext = () => useContext(SimulatedContext)  