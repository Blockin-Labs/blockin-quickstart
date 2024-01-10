/* eslint-disable react-hooks/exhaustive-deps */
import { SignAndVerifyChallengeResponse, SupportedChainMetadata } from 'blockin';
import { BlockinUIDisplay } from 'blockin/dist/ui';
import getConfig from "next/config";
import { useEffect, useState } from "react";
import { SignChallengeResponse, useChainContext } from "../chain_handlers_frontend/ChainContext";
import { getChallengeParams, verifyChallengeOnBackend } from "../chain_handlers_frontend/backend_connectors";

const { publicRuntimeConfig } = getConfig();

const IS_DEMO = publicRuntimeConfig.IS_DEMO

export const BlockinDisplay = () => {
  const {
    chain,
    setChain,
    loggedIn,
    setLoggedIn,
    connect,
    disconnect,
    address,
    signChallenge,
    selectedChainInfo,
    displayedResources,
    connected
  } = useChainContext();

  const [challengeParams, setChallengeParams] = useState({
    domain: 'https://blockin.com',
    statement: 'Signing in allows you to prove ownership of your account and unlock additional features for this site.',
    address: address,
    uri: 'https://blockin.com/login',
    nonce: 'Default Nonce'
  });

  /**
   * Update challengeParams when address or chain changes
   */
  useEffect(() => {
    updateChallengeParams();
  }, []);

  useEffect(() => {
    updateChallengeParams();
  }, [chain, address]);

  const updateChallengeParams = async () => {
    const challengeParams = await getChallengeParams(chain, address);
    setChallengeParams(challengeParams);
  }

  const handleSignChallenge = async (challenge: string) => {
    if (chain === 'Simulated') {
      return { message: '', signature: '' };
    }

    const response = await signChallenge(challenge);
    return response;
  }

  const handleVerifyChallenge = async (message: string, signature: string) => {
    const verificationResponse = chain !== 'Simulated' ? await verifyChallengeOnBackend(chain, message, signature) :
      { verified: true };
    if (!verificationResponse.verified) {
      return { success: false, message: `${verificationResponse.message}` }
    }
    else {
      /**
       * TODO: At this point, the user has been verified by your backend and Blockin. Here, you will do anything needed
       * on the frontend to grant the user access such as setting loggedIn to true, adding cookies, or 
       * anything else that needs to be updated.
       */
      setLoggedIn(true);
      return {
        success: true, message: `${verificationResponse.message}`
      }
    }
  }

  const signAndVerifyChallenge = async (challenge: string) => {
    const signChallengeResponse: SignChallengeResponse = await handleSignChallenge(challenge);
    if (chain === 'Simulated') {
      setLoggedIn(true);
      return { success: true, message: 'Successfully signed challenge.' };
    }

    //Check if error in challenge signature
    if (!signChallengeResponse.message || !signChallengeResponse.signature) {
      return { success: false, message: `${signChallengeResponse.message}` };
    }

    const verifyChallengeResponse: SignAndVerifyChallengeResponse = await handleVerifyChallenge(
      signChallengeResponse.message,
      signChallengeResponse.signature
    );
    return verifyChallengeResponse;
  }

  /**
  * This is where the chain details in ChainContext are updated upon a new chain being selected.
  */
  const handleUpdateChain = async (newChainMetadata: SupportedChainMetadata) => {
    if (newChainMetadata?.name) {
      setChain(newChainMetadata.name);
    }
  }

  const logout = async () => {
    setLoggedIn(false);
  }

  //These should match what is in the backend / ChainContext
  const chainOptions = []
  if (IS_DEMO) {
    chainOptions.push({ name: 'Simulated' });
  }
  chainOptions.push(...[
    { name: 'Ethereum' },
    { name: 'Cosmos' },
    { name: 'Solana' },
  ])

  return <>
    <div >
      {
        <BlockinUIDisplay
          connected={connected}
          connect={async () => {
            connect()
          }}
          buttonStyle={undefined}
          disconnect={async () => {
            disconnect()
          }}
          chainOptions={chainOptions} //Should match your selected ChainDrivers in backend / ChainContexts
          address={address}
          selectedChainInfo={selectedChainInfo}
          onChainUpdate={handleUpdateChain}
          challengeParams={challengeParams}
          loggedIn={loggedIn}
          logout={async () => {
            await logout();
            setLoggedIn(false);
          }}
          allowTimeSelect
          selectedChainName={chain}
          displayedResources={displayedResources}
          displayedAssets={[
            //TODO: Add your own assets here. Note they can change dependent on the connected chain.
            //TODO: Customize the display further with the additionalDisplay field (e.g. showing the asset image)

            chain === 'Ethereum' || chain === 'Simulated' ? {
              collectionId: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
              assetIds: ["15"],
              mustOwnAmounts: { start: 0, end: 0 },
              chain: 'Ethereum',
              name: "General Access",
              description: "Any user who owns this Ethereum NFT is blocked from the site.",
              frozen: true,
              defaultSelected: true
            } : chain === 'Cosmos' ? {
              collectionId: 2,
              assetIds: [{ start: 1, end: 1 }],
              mustOwnAmounts: { start: 0, end: 0 },
              chain: 'BitBadges',
              name: "General Access",
              description: "We currently don't support Cosmos assets natively, so we will use a badge for general access instead.",
              frozen: true,
              defaultSelected: true,
            } : {
              collectionId: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
              assetIds: ["15"],
              mustOwnAmounts: { start: 0, end: 0 },
              chain: 'Algorand',
              name: "General Access",
              description: "Must not own any CryptoPunks to receive access to this site.",
              frozen: true,
              defaultSelected: true
            },
            {
              collectionId: 1,
              assetIds: [{ start: 1, end: 1 }],
              mustOwnAmounts: { start: 1, end: 1 },
              chain: 'BitBadges',
              name: "Administrative Privileges",
              description: <>
                {"Must own the admin badge from BitBadges to receive administrative privileges on this site."}
                <br />
                <br />
                <div className="flex-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/2991/2991252.png" style={{ width: '100px', height: '100px', marginRight: '10px', background: 'inherit' }} />
                </div>
              </>,

              frozen: false,
              defaultSelected: false,
            }
            // {
            //   collectionId: 1,
            //   assetIds: [{ start: 1, end: 1 }],
            //   mustOwnAmounts: { start: 0, end: 0 },
            //   chain: 'BitBadges',
            //   name: "Premium Features",
            //   description: "Must own our premium features badge from BitBadges to receive premium features on this site.",
            //   frozen: false,
            //   defaultSelected: true,
            // },
          ]}
          hideChainSelect={false}
          signAndVerifyChallenge={signAndVerifyChallenge}
        />
      }
    </div>
  </>;
}