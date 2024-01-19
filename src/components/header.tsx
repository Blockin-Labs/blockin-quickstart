import { Avatar } from 'antd';
import { BigIntify, NumberType } from 'bitbadgesjs-proto';
import { getChainForAddress } from 'bitbadgesjs-utils';
import { ChallengeParams, constructChallengeObjectFromString } from 'blockin';
import { SignInWithBitBadges as SignInWithBitBadgesButton } from 'blockin/dist/ui';
import { useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { getChainLogo } from '../../constants';
import { useChainContext } from '../chain_handlers_frontend/ChainContext';
import { getPrivateInfo, verifyAuthenticationAttempt } from '../chain_handlers_frontend/backend_connectors';


const Header = () => {

  const chain = useChainContext();
  const [_, setCookie] = useCookies(['blockinsession']);

  const SecretInfoButton = <>
    <button className='' style={{ width: 200 }} onClick={async () => {
      try {
        const res = await getPrivateInfo();
        console.log(res.message);
        alert(res.message);
      } catch (e) {
        alert('Error');
        console.log(e);
      }
    }}>
      Get Secret Info
    </button>
  </>

  const buttonStyle = {
    backgroundColor: 'black',
    fontSize: 14, fontWeight: 600, color: 'white',
  }

  const challengeParams: ChallengeParams<NumberType> = useMemo(() => ({
    domain: 'http://localhost:3000',
    statement: 'By signing in, you agree to our privacy policy and terms of service.',
    address: '', //overriden by allowAddressSelect
    uri: 'http://localhost:3000',
    nonce: 'abc123',
    notBefore: undefined,
    issuedAt: new Date(Date.now()).toISOString(),
    expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    resources: [],
    assets: [{
      chain: 'BitBadges',
      collectionId: 1,
      assetIds: [{ start: 9, end: 9 }],
      mustSatisfyForAllAssets: true,
      mustOwnAmounts: { start: 0, end: 0 },
    }]
  }), []);

  const expectedChallengeParams: Partial<ChallengeParams<NumberType>> = useMemo(() => {
    const params: Partial<ChallengeParams<NumberType>> = { ...challengeParams };
    //We allow the user to select their address
    //delete bc if undefined this checks address === undefined
    delete params.address;

    return params;
  }, [challengeParams]);

  return (
    <>
      <header>
        <h1 className='banner'>
          <div style={{ backgroundColor: 'white', alignItems: 'center', display: 'flex' }}>
            <img src="./blockin-zoomed.png" alt="blockin" height={43} width={43} className='blockin-new-logo' />
          </div>
          LOCKIN</h1>
        <br />
        <div className='flex-center'>
          {chain.address && chain.loggedIn ? (
            <div className=''>
              <h3><Avatar
                src={getChainLogo(chain.chain)}
                style={{ marginRight: 8 }}
                size={20}
              /> {chain.chain} - {chain.address}</h3>
              <br />
              <div className='flex-center'>
                <button className='blockin-button' onClick={chain.disconnect} style={buttonStyle}>
                  Disconnect
                </button>

              </div>
              <br />
            </div>
          ) : (

            <>
              <SignInWithBitBadgesButton
                //TODO: Customize your popup parameters here. See the documentation for more details.
                popupParams={{
                  name: 'Event Verification',
                  description: 'This will give you access to the requested event.',
                  image: 'https://bitbadges-ipfs.infura-ipfs.io/ipfs/QmPfdaLWBUxH6ZrWmX1t7zf6zDiNdyZomafBqY5V5Lgwvj',
                  challengeParams: challengeParams,
                  allowAddressSelect: true,
                  verifyOptions: {
                    issuedAtTimeWindowMs: 3 * 60 * 1000, //3 minute window
                    expectedChallengeParams,
                  }
                }}
                onSignAndBlockinVerify={async (message, signature, blockinResponse) => {
                  //want to cache the signature and message for later use?
                  const params = constructChallengeObjectFromString(message, BigIntify);
                  //TODO: Since this is a centralized solution, it is always good practice to verify the message is as expected.

                  try {
                    if (!blockinResponse.success) throw new Error(blockinResponse.errorMessage ?? 'Error');

                    //TODO: Handle backend logic here
                    const backendChecksRes = await verifyAuthenticationAttempt(message, signature);
                    if (!backendChecksRes.success) throw new Error(backendChecksRes.errorMessage ?? 'Error');

                    //TODO: Handle any other frontend logic here
                    setCookie('blockinsession', JSON.stringify({ address: params.address, chain: getChainForAddress(params.address) }));
                  } catch (e) {
                    console.log(e);
                    alert(e);
                  }
                }}
              >
              </SignInWithBitBadgesButton>

            </>
          )}

        </div>
        <br />
        {SecretInfoButton}
      </header >
      <br />
    </>
  )
}

export default Header;