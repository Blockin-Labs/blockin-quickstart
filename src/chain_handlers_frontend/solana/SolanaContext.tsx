
import { notification } from 'antd';
import { Asset, PresetUri } from 'blockin';
import { Dispatch, SetStateAction, createContext, useCallback, useContext, useState } from 'react';
import { ChainSpecificContextType } from '../ChainContext';


export type SolanaContextType = ChainSpecificContextType & {
  solanaProvider: any;
  setSolanaProvider: Dispatch<SetStateAction<any | undefined>>;
}

export const SolanaContext = createContext<SolanaContextType>({
  address: '',
  setAddress: () => { },
  connect: async () => { },
  disconnect: async () => { },
  chainId: 'Mainnet',
  setChainId: () => { },
  signChallenge: async () => { return { message: '', signature: '' } },
  ownedAssetIds: [],
  displayedResources: [],
  selectedChainInfo: {},
  connected: false,
  setConnected: () => { },
  solanaProvider: undefined,
  setSolanaProvider: () => { },
  displayedAssets: [],
})

type Props = {
  children?: React.ReactNode
};

export const SolanaContextProvider: React.FC<Props> = ({ children }) => {
  const [chainId, setChainId] = useState<string>('Mainnet');

  const [solanaProvider, setSolanaProvider] = useState<any>();
  const [address, setAddress] = useState<string>('');

  const connected = address ? true : false;
  const setConnected = () => { }
  const displayedAssets: Asset<bigint>[] = []; //This can be dynamic based on Chain ID if you want to give different token addresses for different Chain IDs
  const getProvider = () => {

    if ('phantom' in window) {
      const phantomWindow = window as any;
      const provider = phantomWindow.phantom?.solana;
      setSolanaProvider(provider);
      if (provider?.isPhantom) {
        return provider;
      }

      window.open('https://phantom.app/', '_blank');
    }
  };

  const selectedChainInfo = {}
  const displayedResources: PresetUri[] = []; //This can be dynamic based on Chain ID if you want to give different token addresses for different Chain IDs

  //If you would like to support this, you can call this with a useEffect every time connected or address is updated
  const ownedAssetIds: string[] = [];

  const connect = async () => {
    await connectAndPopulate(address ?? '');
  }

  const connectAndPopulate = useCallback(async (address: string) => {
    if (!address) {
      try {
        const provider = getProvider(); // see "Detecting the Provider"

        const resp = await provider.request({ method: "connect" });
        const address = resp.publicKey.toBase58();

        setSolanaProvider(provider);
        setAddress(address);
      } catch (e) {
        console.error(e);
        notification.error({
          message: 'Error connecting to wallet',
          description: 'Make sure you have Phantom installed and are logged in.',
        })
      }
    }
  }, []);


  const disconnect = async () => {
    setAddress('');
    await solanaProvider?.request({ method: "disconnect" });
  };

  const signChallenge = async (message: string) => {
    const encodedMessage = new TextEncoder().encode(message);
    const provider = solanaProvider;
    const signedMessage = await provider.request({
      method: "signMessage",
      params: {
        message: encodedMessage,
        display: "utf8",
      },
    });

    return { message: message, signature: signedMessage.signature };
  }

  const solanaContext: SolanaContextType = {
    connected,
    setConnected,
    chainId,
    setChainId,
    connect,
    disconnect,
    ownedAssetIds,
    selectedChainInfo,
    displayedResources,
    signChallenge,
    address,
    setAddress: () => { },
    setSolanaProvider,
    solanaProvider,
    displayedAssets
  };


  return <SolanaContext.Provider value={solanaContext}>
    {children}
  </ SolanaContext.Provider>
}

export const useSolanaContext = () => useContext(SolanaContext)  