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

    const handleVerifyChallenge = async (originalBytes: Uint8Array, signatureBytes: Uint8Array, challengeObj?: ChallengeParams) => {
        const verificationResponse = await verifyChallengeOnBackend(chain, originalBytes, signatureBytes);

        if (!verificationResponse.verified) {
            return { success: false, message: `${verificationResponse.message}` }
        }
        else {
            /**
             * At this point, the user has been verified by your backend and Blockin. Here, you will do anything needed
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
            constructChallengeObjectFromString(challenge)
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
                        { name: 'Algorand Testnet', },
                        { name: 'Algorand Mainnet', },
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
                    signAndVerifyChallenge={signAndVerifyChallenge}
                    canAddCustomAssets={false}
                />
            }
        </div>
    </>;
}