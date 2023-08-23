/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { SignChallengeResponse, useChainContext } from "../chain_handlers_frontend/ChainContext"
import { getChallengeParams, verifyChallengeOnBackend } from "../chain_handlers_frontend/backend_connectors"
import { BlockinUIDisplay } from 'blockin/dist/ui';
import { ChallengeParams, constructChallengeObjectFromString, SignAndVerifyChallengeResponse, SupportedChainMetadata } from 'blockin';

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
    statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
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
    const response = await signChallenge(challenge);
    return response;
  }

  const handleVerifyChallenge = async (originalBytes: Uint8Array, signatureBytes: Uint8Array, challengeObj?: ChallengeParams<number>) => {
    const verificationResponse = await verifyChallengeOnBackend(chain, originalBytes, signatureBytes);

    if (!verificationResponse.verified) {
      return { success: false, message: `${verificationResponse.message}` }
    }
    else {
      /**
       * TODO: At this point, the user has been verified by your backend and Blockin. Here, you will do anything needed
       * on the frontend to grant the user access such as setting loggedIn to true, adding cookies, or 
       * anything else that needs to be updated.
       */
      alert(verificationResponse.message);
      setLoggedIn(true);
      return {
        success: true, message: `${verificationResponse.message}`
      }
    }
  }

  const signAndVerifyChallenge = async (challenge: string) => {
    const signChallengeResponse: SignChallengeResponse = await handleSignChallenge(challenge);
    //Check if error in challenge signature
    if (!signChallengeResponse.originalBytes || !signChallengeResponse.signatureBytes) {
      return { success: false, message: `${signChallengeResponse.message}` };
    }

    const verifyChallengeResponse: SignAndVerifyChallengeResponse = await handleVerifyChallenge(
      signChallengeResponse.originalBytes,
      signChallengeResponse.signatureBytes,
      constructChallengeObjectFromString(challenge, (x) => Number(x))
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

  return <>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {
        <BlockinUIDisplay
          connected={connected}
          connect={async () => {
            connect()
          }}
          buttonStyle={undefined}
          modalStyle={undefined}
          disconnect={async () => {
            disconnect()
          }}
          chainOptions={[
            //These should match what ChainDrivers are implemented in your backend.
            { name: 'Ethereum' },
            { name: 'Cosmos' },

            { name: 'Algorand Mainnet', },
            { name: 'Polygon' },
            { name: 'Avalanche' },
            { name: 'BSC' },
            { name: 'Algorand Testnet', },

          ]}
          address={address}
          selectedChainInfo={selectedChainInfo}
          onChainUpdate={handleUpdateChain}
          challengeParams={challengeParams}
          loggedIn={loggedIn}
          logout={async () => {
            await logout();
            setLoggedIn(false);
          }}
          selectedChainName={chain}
          displayedResources={displayedResources}
          displayedAssets={[
            //TODO: Add your own assets here. Note they can change dependent on the connected chain.
            chain === 'Ethereum' ? {
              collectionId: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
              assetIds: ["15"],
              mustOwnAmounts: { start: 0, end: 0 },
              chain: 'Ethereum',
              name: "General Access",
              description: "Must now own any CryptoPunks to receive access to this site.",
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
              defaultSelected: true
            } : {
              collectionId: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
              assetIds: ["15"],
              mustOwnAmounts: { start: 0, end: 0 },
              chain: 'Algorand',
              name: "General Access",
              description: "Must now own any CryptoPunks to receive access to this site.",
              frozen: true,
              defaultSelected: true
            },
            {
              collectionId: 1,
              assetIds: [{ start: 1, end: 1 }],
              mustOwnAmounts: { start: 0, end: 0 },
              chain: 'BitBadges',
              name: "Premium Features",
              description: "Must own the following badge from BitBadges to receive access to this site.",
              frozen: false,
              defaultSelected: false,
            }
          ]}
          hideChainName
          signAndVerifyChallenge={signAndVerifyChallenge}
          canAddCustomAssets={false}
          allowTimeSelect
        />
      }
    </div>
  </>;
}