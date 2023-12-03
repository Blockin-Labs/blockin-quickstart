import {
  SigningStargateClient
} from "@cosmjs/stargate";
import { verifyADR36Amino } from '@keplr-wallet/cosmos';
import { AccountData, Window as KeplrWindow } from "@keplr-wallet/types";
import { convertToCosmosAddress } from 'bitbadgesjs-utils';
import { PresetAsset, PresetUri, SupportedChainMetadata } from 'blockin';
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { ChainSpecificContextType } from '../ChainContext';

const HOSTNAME = 'api.bitbadges.io';
export const COSMOS_LOGO = 'https://cryptologos.cc/logos/cosmos-atom-logo.png';


declare global {
  interface Window extends KeplrWindow { }
}

export type CosmosContextType = ChainSpecificContextType & {
  signer?: SigningStargateClient;
  setSigner: Dispatch<SetStateAction<SigningStargateClient | undefined>>;
}

export const CosmosContext = createContext<CosmosContextType>({
  signer: undefined,
  setSigner: () => { },
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
  displayedAssets: [],
})


type Props = {
  children?: React.ReactNode
};

export const CosmosContextProvider: React.FC<Props> = ({ children }) => {
  const [address, setAddress] = useState<string>('')
  const [connected, setConnected] = useState<boolean>(false);
  const [chainId, setChainId] = useState<string>('bitbadges_1-1');
  const [signer, setSigner] = useState<SigningStargateClient>();
  const [cosmosAddress, setCosmosAddress] = useState<string>('');

  const selectedChainInfo: SupportedChainMetadata = {
    name: 'Cosmos',
    logo: COSMOS_LOGO,
    abbreviation: 'COSM'
  };
  const displayedResources: PresetUri[] = []; //This can be dynamic based on Chain ID if you want to give different token addresses for different Chain IDs
  const displayedAssets: PresetAsset<bigint>[] = []; //This can be dynamic based on Chain ID if you want to give different token addresses for different Chain IDs

  //If you would like to support this, you can call this with a useEffect every time connected or address is updated
  const ownedAssetIds: string[] = [];

  useEffect(() => {
    if (address) {
      setAddress(address);
      setCosmosAddress(convertToCosmosAddress(address));

      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [address])

  const connect = async () => {
    console.log('Connecting to Cosmos');
    const { keplr } = window
    if (!keplr || !window || !window.getOfflineSigner) {
      alert("You need to install Keplr")
      return
    }

    console.log('Connecting to Cosmos');
    const offlineSigner = window.getOfflineSigner(chainId);
    const signingClient = await SigningStargateClient.connectWithSigner(
      `http://${HOSTNAME}:26657`,
      offlineSigner,
    )

    const account: AccountData = (await offlineSigner.getAccounts())[0]
    setSigner(signingClient);
    setConnected(true);
    setAddress(account.address);
  }

  const disconnect = async () => {
    setAddress('');
    setConnected(false);
  };

  const signChallenge = async (message: string) => {
    let sig = await window.keplr?.signArbitrary("bitbadges_1-2", cosmosAddress, message);

    if (!sig) sig = { signature: '', pub_key: { type: '', value: '' } };

    const signatureBuffer = Buffer.from(sig.signature, 'base64');
    const uint8Signature = new Uint8Array(signatureBuffer); // Convert the buffer to an Uint8Array
    const pubKeyValueBuffer = Buffer.from(sig.pub_key.value, 'base64'); // Decode the base64 encoded value
    const pubKeyUint8Array = new Uint8Array(pubKeyValueBuffer); // Convert the buffer to an Uint8Array

    const isRecovered = verifyADR36Amino('cosmos', cosmosAddress, message, pubKeyUint8Array, uint8Signature, 'secp256k1');
    if (!isRecovered) {
      throw new Error('Signature verification failed');
    }

    return {
      message: message,
      signature: sig.pub_key.value + ':' + sig.signature,
    }
  }

  const cosmosContext: CosmosContextType = {
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
    signer,
    setSigner,
    displayedAssets
  };


  return <CosmosContext.Provider value={cosmosContext}>
    {children}
  </ CosmosContext.Provider>
}

export const useCosmosContext = () => useContext(CosmosContext)  