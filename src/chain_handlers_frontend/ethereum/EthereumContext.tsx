import { PresetAsset, PresetUri } from 'blockin';
import { ethers } from 'ethers';
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import Web3Modal from "web3modal";
import { ChainSpecificContextType } from '../ChainContext';
import { disconnect as disconnectWeb3 } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount } from "wagmi";
export type EthereumContextType = ChainSpecificContextType & {
  web3Modal?: Web3Modal,
  setWeb3Modal: Dispatch<SetStateAction<Web3Modal | undefined>>;
}

export const EthereumContext = createContext<EthereumContextType>({
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

export const EthereumContextProvider: React.FC<Props> = ({ children }) => {
  const web3AccountContext = useAccount();
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  const [address, setAddress] = useState<string>('')
  const [connected, setConnected] = useState<boolean>(false);
  const [chainId, setChainId] = useState<string>('Mainnet');
  const { open } = useWeb3Modal();

  const resolveAddressToENS = async (address: string) => {
    //TODO: Uses default provider, but you can use your own for quicker resolution
    if (address) {
      const ensAddress = await ethers.getDefaultProvider('homestead', { quorum: 1 }).lookupAddress(address);
      if (ensAddress) return ensAddress;
    }
    return undefined;
  }
  const selectedChainInfo = { getNameForAddress: resolveAddressToENS };
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
    await open()

  }

  const disconnect = async () => {
    setAddress('');
    setConnected(false);
    await disconnectWeb3();
  };

  const signChallenge = async (message: string) => {
    let accounts = await window.ethereum.request({ method: 'eth_accounts' })

    const from = accounts[0];
    const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
    const sign = await window.ethereum.request({
      method: 'personal_sign',
      params: [msg, from],
    });

    return { message, signature: sign }
  }

  const ethereumContext: EthereumContextType = {
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

  return <EthereumContext.Provider value={ethereumContext}>
    {children}
  </ EthereumContext.Provider>
}

export const useEthereumContext = () => useContext(EthereumContext)  