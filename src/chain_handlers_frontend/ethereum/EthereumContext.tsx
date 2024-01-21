import { disconnect as disconnectWeb3 } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import { ethers } from 'ethers';
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { useAccount } from "wagmi";
import Web3Modal from "web3modal";
import { ChainSpecificContextType } from '../ChainContext';
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

  selectedChainInfo: {},
  connected: false,
  setConnected: () => { },
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
    selectedChainInfo,
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