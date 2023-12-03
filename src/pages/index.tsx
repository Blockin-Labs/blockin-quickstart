import { NumberType } from 'bitbadgesjs-proto';
import { ChallengeParams } from 'blockin';
import getConfig from 'next/config';
import { NextPage } from 'next/types';
import { useEffect, useState } from 'react';
import { getAndVerifyMessageForSignature } from '../chain_handlers_frontend/backend_connectors';
import Header from '../components/header';

const { publicRuntimeConfig } = getConfig();

const IS_DEMO = publicRuntimeConfig.IS_DEMO
const FRONTEND_URL = publicRuntimeConfig.CODEGEN_URL ?? 'https://bitbadges.io'

const Home: NextPage = () => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [verificationMessage, setVerificationMessage] = useState<string>('');

  const handleChildWindowMessage = (event: MessageEvent) => {
    if (event.origin === FRONTEND_URL) {
      const dataFromChildWindow = event.data;

      // Check if the message contains the QR code data
      if (dataFromChildWindow.signature) {
        setSignature(dataFromChildWindow.signature);
        setQrCodeData(dataFromChildWindow.signature);
        // You can now store the QR code data in your database or take further actions.
      }

      if (dataFromChildWindow.message) {
        // Handle the message
        console.log(dataFromChildWindow.message);
        setMessage(dataFromChildWindow.message);
        console.log(message);
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

  const codeGenerationParams: {
    name: string
    description: string
    image: string
    challengeParams: ChallengeParams<NumberType>
    generateNonce: boolean,
    allowAddressSelect: boolean,
    callbackRequired: boolean
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
      assets: [],
    },
    generateNonce: true,
    allowAddressSelect: true,
    callbackRequired: true
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
    const childWindow = window.open(url, '_blank', 'width=500,height=600');

    // You can further customize the child window as needed
    childWindow?.focus();
  };

  return (
    <>
      <Header />

      {IS_DEMO && <>
        <main>
          <section className='home'>
            <h2>Welcome to the Blockin Demo!</h2>
            <p>You may select the Simulated option to interact with this demo without connecting a wallet.</p>
            <hr />
            <p>Learn more about Blockin by checking out the <a href="https://blockin.gitbook.io/blockin/" target="_blank" rel="noreferrer" style={{}}>documentation</a> or the <a href="https://github.com/Blockin-Labs" target="_blank" rel="noreferrer" style={{}}>source code</a>!</p>
          </section>
        </main>
      </>}
      {!IS_DEMO && <>
        <section style={{ textAlign: 'center', marginRight: '20vw', marginLeft: '20vw' }} className='home'>
          <h2 >Welcome to the Blockin Quickstart Site using Next.js!</h2>
          <p>This quickstart repo starts you with a template for Web 3.0 sign-in with Blockin. CTRL + F TODO to find all the places you need to handle and implement your own logic.</p>
        </section>

        <ul style={{ marginRight: '20vw', marginLeft: '20vw' }}>
          <li>Learn Next.js by visiting their respective documentation, if the framework is new to you.</li>
          <li>Create a valid .env file. See .env.example for an example env file. You may not need / want all variables.</li>
          <li>Edit the ChainDrivers as needed for your requirements.</li>
          <li>To verify assets from a snapshot rather than from an API, you can use the options to the verifyChallenge call for each ChainDriver. See the Blockin docs for more details.</li>
          <li>You will have to implement custom logic, like generating and verify nonces yourself or ensuring sign ins are one-time use only; see the Blockin docs.</li>
        </ul>
      </>}
      <br />
      <br />
      <div className='flex' style={{ marginRight: '20vw', marginLeft: '20vw' }}>

        <h3 className='flex-center'>QR Code Generation - BitBadges API</h3>
        <div className='flex-center flex-column' style={{ textAlign: 'center' }}>
          <p>Blockin supports in-person authentication via the user pre-signing a message and storing the message signature as a QR code. See documentation <a href="https://blockin.gitbook.io/blockin/developer-docs/in-person-authentication" target="_blank" rel="noreferrer" style={{}}>here</a>.
            For this demo, we will use the BitBadges API and https://bitbadges.io/auth/codegen helper tool to generate a QR code for a message signature, but you can also custom implement by following the documentation.</p>
          <p>If you do not need QR code authentication, you can ignore this.</p>
        </div>
        <hr />

        <div className='flex-center'>
          {qrCodeData ? (
            <div className='flex-center flex-column'>
              <p>
                The QR code has now been generated. IMPORTANT: You will either need to cache the message yourself from the callback (we leave this step up to you) or fetch at authentication time from the BitBadges API at POST /api/v0/authCode. Below, we fetch from the API.</p>

              <p style={{ wordBreak: 'break-all' }}>
                When you scan the QR code from the user, you will get the signature: {signature}.
              </p>

              <button onClick={async () => {
                const res = await getAndVerifyMessageForSignature(signature);
                alert('Message: ' + res.message);
                alert('Verified: ' + res.blockinSuccess + ': ' + res.blockinMessage);

                setVerificationMessage(res.blockinMessage);
              }}>Fetch and Verify Signature from BitBadges API</button>

              <p>
                The API route automatically handles verification as well via blockinSuccess.
              </p>

              {verificationMessage && <p>{verificationMessage}</p>}

              <p>You can also verify directly with the verification UI helper tool in your browser at
                <a href='https://bitbadges.io/auth/verify' target='_blank' rel="noreferrer" style={{}}> https://bitbadges.io/auth/verify.</a>
                However, most of the time, more customization is needed than what is provided there.
              </p>

              <p>
                After successfully verifying, you can now implement any custom logic you need to handle the authentication.
                For example, verify nonces match what you have stored in your database, or ensure the user has not already signed in.
                This step is left up to you.
              </p>
            </div>
          ) : (
            <div className='flex-center flex-column'>
              <button className='landing-button' onClick={openChildWindow}>Open Codegen Tool (Custom URL)</button>
              <br />
              <div>
                First, you will need to get the users to generate QR codes.
                You can do this by sending them to the BitBadges codegen tool with your custom parameters passed in, thus creating a custom URL.
                You can use <a href="https://bitbadges.io/auth/linkgen" target="_blank" rel="noreferrer" style={{}}>https://bitbadges.io/auth/linkgen</a> to generate your own custom URL.
                There is a sample one set by default for this example.
                <br />
                <br />
                BitBadges automatically stores the generated (message, signature) pair for the user, but if you need it,
                you can also store it by specifying a callback (callbackRequired = true) to the codegen tool.
                <br />
                <br />
                At authentication time, the QR code is presented to you. This is the signature of the message. You can then fetch the message from the BitBadges API (or locally if you previously cached it) and verify the (message, signature) pair, plus any other custom authentication logic required.
              </div>
            </div>
          )}
        </div>
      </div >

    </>
  )
}


export default Home
