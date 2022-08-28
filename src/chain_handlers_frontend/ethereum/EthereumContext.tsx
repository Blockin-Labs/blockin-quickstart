import WalletConnectProvider from '@walletconnect/web3-provider';
import { PresetResource } from 'blockin';
import { ethers } from 'ethers';
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
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
    signChallenge: async () => { return {} },
    ownedAssetIds: [],
    displayedResources: [],
    selectedChainInfo: {},
    connected: false,
    setConnected: () => { }
})


type Props = {
    children?: React.ReactNode
};

export const EthereumContextProvider: React.FC<Props> = ({ children }) => {
    const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
    const [address, setAddress] = useState<string>('')
    const [connected, setConnected] = useState<boolean>(false);
    const [chainId, setChainId] = useState<string>('Mainnet');

    const resolveAddressToENS = async (address: string) => {
        if (address) {
            const ensAddress = await ethers.getDefaultProvider('homestead', { quorum: 1 }).lookupAddress(address);
            if (ensAddress) return ensAddress;
        }
        return undefined;
    }
    const selectedChainInfo = { getNameForAddress: resolveAddressToENS };
    const displayedResources: PresetResource[] = []; //This can be dynamic based on Chain ID if you want to give different token addresses for different Chain IDs

    //If you would like to support this, you can call this with a useEffect every time connected or address is updated
    const ownedAssetIds: string[] = [];



    const connect = async () => {
        const providerOptions = {
            // Example with WalletConnect provider
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: "27e484dcd9e3efcfd25a83a78777cdf1"
                }
            }
        };

        //TODO: Update dynamically based on provider
        const web3ModalInstance = web3Modal ? web3Modal : new Web3Modal({
            network: "mainnet", // optional
            cacheProvider: false, // optional
            providerOptions // required
        });
        setWeb3Modal(web3ModalInstance);
        web3ModalInstance.clearCachedProvider();

        const instance = await web3ModalInstance.connect();
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = provider.getSigner();
        setConnected(true);
        setAddress(await signer.getAddress());
    }

    const disconnect = async () => {
        setAddress('');
        setConnected(false);
    };

    const signChallenge = async (message: string) => {
        let accounts = await window.ethereum.request({ method: 'eth_accounts' })

        const from = accounts[0];
        const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
        const sign = await window.ethereum.request({
            method: 'personal_sign',
            params: [msg, from],
        });

        return { originalBytes: new Uint8Array(Buffer.from(msg, 'utf8')), signatureBytes: new Uint8Array(Buffer.from(sign, 'utf8')), message: 'Success' }
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