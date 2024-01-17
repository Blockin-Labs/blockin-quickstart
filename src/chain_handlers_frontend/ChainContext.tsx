import { createContext, useContext, useEffect } from 'react';
//react cookie
import { useCookies } from 'react-cookie';
import { checkSignIn, signOut } from './backend_connectors';

export type SignChallengeResponse = {
  message: string;
  signature: string
}

export type ChainContextType = ChainSpecificContextType & {
  chain: string, //Should be consistent with the ChainSelect Props for the UI button
  loggedIn: boolean,
}

export type ChainSpecificContextType = {
  address: string,
  disconnect: () => {},
}

const ChainContext = createContext<ChainContextType>({
  loggedIn: false,
  disconnect: async () => { },
  address: '',
  chain: 'Default',
});

type Props = {
  children?: React.ReactNode
};

export const ChainContextProvider: React.FC<Props> = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['blockinsession']);

  const session = cookies.blockinsession ? cookies.blockinsession : undefined;
  const loggedIn = session !== undefined;
  const address = session?.address ?? '';
  const chain = session?.chain ?? 'Ethereum';


  useEffect(() => {
    checkSignIn().then((res) => {
      if (res.signedIn) {
        setCookie('blockinsession', JSON.stringify({ address: res.address, chain: res.chain }));
      } else {
        removeCookie('blockinsession');
      }
    });
  }, [removeCookie, setCookie]);

  const disconnect = async () => {
    removeCookie('blockinsession');
    await signOut();
  }

  const chainContext: ChainContextType = {
    chain,
    loggedIn,
    address,
    disconnect,
  };

  return <ChainContext.Provider value={chainContext}>
    {children}
  </ChainContext.Provider>;
}


export const useChainContext = () => useContext(ChainContext);

