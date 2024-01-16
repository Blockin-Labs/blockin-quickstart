import { NumberType } from 'bitbadgesjs-proto';
import { getChainForAddress } from 'bitbadgesjs-utils';
import { ChallengeParams } from 'blockin';
import getConfig from 'next/config';
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import { useChainContext } from '../chain_handlers_frontend/ChainContext';
import { verifyAuthenticationAttempt } from '../chain_handlers_frontend/backend_connectors';
import Header from '../components/header';

const { publicRuntimeConfig } = getConfig();

const FRONTEND_URL = publicRuntimeConfig.CODEGEN_URL ?? 'https://bitbadges.io'

const Home: NextPage = () => {
  const chain = useChainContext();

  // const [message, setMessage] = useState<string>('');
  // const [signature, setSignature] = useState<string>('');

  // const authParams = useMemo(() => {
  //   if (!message) return undefined;
  //   return constructChallengeObjectFromString(message, BigIntify);
  // }, [message]);

  const handleChildWindowMessage = async (event: MessageEvent) => {
    if (event.origin === FRONTEND_URL) {
      const dataFromChildWindow = event.data;

      // Check if the message contains a signature field
      if (dataFromChildWindow.signature) {
        // setSignature(dataFromChildWindow.signature);
        console.log(dataFromChildWindow.signature);
      }

      // Handle the message
      if (dataFromChildWindow.message) {
        console.log(dataFromChildWindow.message);
        // setMessage(dataFromChildWindow.message);
      }

      try {
        const res = await verifyAuthenticationAttempt(dataFromChildWindow.message, dataFromChildWindow.signature, {
          expectedChallengeParams: {
            domain: codeGenerationParams.challengeParams.domain,
            statement: codeGenerationParams.challengeParams.statement,
            address: codeGenerationParams.allowAddressSelect ? undefined : codeGenerationParams.challengeParams.address,
            uri: codeGenerationParams.challengeParams.uri,
            nonce: codeGenerationParams.generateNonce ? undefined : codeGenerationParams.challengeParams.nonce,
            expirationDate: codeGenerationParams.challengeParams.expirationDate,
            resources: [],
            assets: [],
          }
        });
        if (!res.success) throw new Error("Authentication failed");

        //TODO: Handle any other frontend logic here
        chain.setAddress(codeGenerationParams.challengeParams.address);
        chain.setChain(getChainForAddress(codeGenerationParams.challengeParams.address));
        chain.setLoggedIn(true);
      } catch (e) {
        console.log(e);
        alert(e);
      }

    }
  };

  // Add a listener to handle messages from the child window
  useEffect(() => {
    window.addEventListener('message', handleChildWindowMessage);

    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleChildWindowMessage);
    };
  }, []);

  //TODO: Customize your code generation parameters here. See the documentation for more details.
  const codeGenerationParams: {
    name: string
    description: string
    image: string
    challengeParams: ChallengeParams<NumberType>
    generateNonce: boolean,
    allowAddressSelect: boolean,
    callbackRequired: boolean,
    storeInAccount: boolean,
  } = {
    name: 'Event Verification',
    description: 'This will give you access to the requested event.',
    image: 'https://bitbadges-ipfs.infura-ipfs.io/ipfs/QmPfdaLWBUxH6ZrWmX1t7zf6zDiNdyZomafBqY5V5Lgwvj',
    challengeParams: {
      domain: 'https://google.com',
      statement: 'By signing in, you agree to our privacy policy and terms of service.',
      address: '0x0f741F4E00453c403151b5e7ca379B4Dc981D685',
      uri: 'https://google.com',
      nonce: '9YClKQzMLtsXD52eT',
      expirationDate: '2025-12-01T16:06:32.205Z',
      resources: [],
      assets: [{
        chain: 'BitBadges',
        collectionId: 1,
        assetIds: [{ start: 9, end: 9 }],
        mustSatisfyForAllAssets: true,
        mustOwnAmounts: { start: 0, end: 0 },
      }],
    },
    generateNonce: false,
    allowAddressSelect: true,
    callbackRequired: true,
    storeInAccount: false,
  };

  const openChildWindow = () => {
    let url = FRONTEND_URL + '/auth/codegen?';
    for (const [key, value] of Object.entries(codeGenerationParams)) {
      if (value) {
        if (typeof value === 'object') {
          const valueString = JSON.stringify(value);
          const encodedValue = encodeURIComponent(valueString);
          url = url.concat(`${key}=${encodedValue}&`);
        }
        else {
          url = url.concat(`${key}=${value}&`);
        }
      }
    }
    // Opens a new window with the specified URL, size, and name.

    const childWindow = window.open(url, '_blank', 'width=600,height=600');

    // You can further customize the child window as needed
    childWindow?.focus();
  };

  return (
    <>
      <Header />
      {<>
        <div className='flex-center'>
          {chain.address && chain.loggedIn ? (
            <div className=''>
              <h3>Logged in as {chain.chain} address {chain.address}</h3>
              <br />
              <div className='flex-center'>
                <button className='blockin-button' onClick={chain.disconnect}>
                  Disconnect
                </button>
              </div>
              <br />
            </div>
          ) : (
            <button className='blockin-button' onClick={openChildWindow}>
              Sign In
            </button>
          )}

        </div>

        <section style={{ textAlign: 'center', marginRight: '10vw', marginLeft: '10vw' }} className='home'>
          <p>
            This quickstart repo starts you off with a basic site that uses Blockin for authentication, but all authentication logic is outsourced (via the BitBadges API). See documentation <a href="https://blockin.gitbook.io/blockin/developer-docs/in-person-authentication" target="_blank" rel="noreferrer" style={{}}>here</a>.
            If you need users to sign anything (transactions, messages, etc) or more advanced logic, it is recommended you use the complete quickstart repo instead.</p>
        </section>
        <br />

        <ul style={{ marginRight: '10vw', marginLeft: '10vw' }}>

          <li><p>CTRL + F to find all TODO comments in this repository. They will guide you through the steps to customize this site for your needs.</p></li>
        </ul >
      </>}
      <div style={{ minHeight: '10vh' }} />
    </>
  )
}


export default Home
