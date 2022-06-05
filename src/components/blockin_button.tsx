/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useChainContext } from "../chain_handlers_frontend/ChainContext"
import { getChallengeParams, verifyChallengeOnBackend } from "../chain_handlers_frontend/backend_connectors"
import { BlockinUIDisplay } from 'blockin/dist/ui';
import { ChallengeParams, constructChallengeObjectFromString, SupportedChainMetadata } from 'blockin';
import { signChallengeEth } from "../chain_handlers_frontend/ethereum/sign_challenge";
import { connect as algorandConnect } from "../chain_handlers_frontend/algorand/WalletConnect";
import { useAlgorandContext } from "../chain_handlers_frontend/algorand/AlgorandContext";
import { signChallengeAlgo } from "../chain_handlers_frontend/algorand/sign_challenge";
import { ethers } from "ethers";
import { useEthereumContext } from "../chain_handlers_frontend/ethereum/EthereumContext";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const loadingMessage = <>
    <p>Go to your wallet and accept the challenge request...</p>
</>

const successMessage = <>
    <p>Challenge succeeded!</p>
    <p>You are now authenticated.</p>
    <p>If you specified a banner privilege, you should see the banner at the top of this page change!</p>
</>

const failureMessage = <>
    <p>Challenge failed!</p>
    <p>You are NOT authenticated</p>
</>

declare var window: any;

export const SignChallengeButton = () => {
    const [userIsSigningChallenge, setUserIsSigningChallenge] = useState(false);
    const [displayMessage, setDisplayMessage] = useState(loadingMessage);
    const {
        connector,
        setConnector
    } = useAlgorandContext();
    const {
        connect,
        disconnect,
        ownedAssetIds,
        address,
        setConnect,
        signChallenge,
        setDisconnect,
        setDisplayedResources,
        selectedChainInfo,
        setSelectedChainInfo,
        setSignChallenge,
        setOwnedAssetIds,
        displayedResources,
        chain,
        setChain,
        setAddress,
        connected,
        setConnected,
        loggedIn,
        setLoggedIn
    } = useChainContext();
    const { web3Modal, setWeb3Modal } = useEthereumContext();
    const [challengeParams, setChallengeParams] = useState({
        domain: 'https://blockin.com',
        statement: 'Sign in to this website via Blockin. You will remain signed in until you terminate your browser session.',
        address: address,
        uri: 'https://blockin.com/login',
        nonce: 'Default Nonce'
    });

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
        setUserIsSigningChallenge(true);
        setDisplayMessage(loadingMessage);

        const response = await signChallenge(challenge);
        return response;
    }

    const handleVerifyChallenge = async (originalBytes: Uint8Array, signatureBytes: Uint8Array, challengeObj: ChallengeParams) => {

        const verificationResponse = await verifyChallengeOnBackend(chain, originalBytes, signatureBytes);

        if (!verificationResponse.verified) {
            setDisplayMessage(failureMessage);
            setUserIsSigningChallenge(false);
            return { success: false, message: `${verificationResponse.message}` }
        }
        else {
            /**
             * At this point, the user has been verified by your backend. Here, you will do anything needed
             * on the frontend to grant the user access such as setting loggedIn to true, adding cookies, or 
             * anything else that needs to be updated.
             */


            setDisplayMessage(successMessage);
            alert(verificationResponse.message);
            setLoggedIn(true);
            return {
                success: true, message: `${verificationResponse.message}`
            }
        }
    }

    /**
    * This is where the chain details in ChainContext are updated upon a new chain being selected.
    */
    const handleUpdateChain = async (newChainProps: SupportedChainMetadata) => {
        setConnected(false);
        console.log(newChainProps.name);
        setAddress('');
        if (newChainProps.name === 'Ethereum') {
            setChain('Ethereum');
            setSelectedChainInfo({
                getNameForAddress: async (address: string) => {
                    // console.log("ENSSSSS");
                    if (address) {
                        console.log("ATTEMPTING TO RESOLVE ENS NAME...")
                        const ensAddress = await ethers.getDefaultProvider('homestead', { quorum: 1 }).lookupAddress(address);
                        if (ensAddress) return ensAddress;
                    }
                    return undefined;
                }
            });
            const connectFunction = () => {
                const providerOptions = {
                    // Example with WalletConnect provider
                    walletconnect: {
                        package: WalletConnectProvider,
                        options: {
                            infuraId: "27e484dcd9e3efcfd25a83a78777cdf1"
                        }
                    }
                };

                const web3ModalInstance = web3Modal ? web3Modal : new Web3Modal({
                    network: "mainnet", // optional
                    cacheProvider: false, // optional
                    providerOptions // required
                });
                setWeb3Modal(web3ModalInstance);

                return async () => {
                    const handleConnect = async () => {
                        web3ModalInstance.clearCachedProvider();

                        const instance = await web3ModalInstance.connect();
                        const provider = new ethers.providers.Web3Provider(instance);
                        const signer = provider.getSigner();
                        setConnected(true);
                        setAddress(await signer.getAddress());
                        setOwnedAssetIds([]);
                    }
                    await handleConnect();
                }
            }
            setConnect(connectFunction);
            setDisconnect(() => {
                return async () => {
                    await logout();
                    setAddress('');
                    setConnected(false);
                }
            });
            setSignChallenge(() => async (challenge: string) => {
                return signChallengeEth(challenge);
            });
            setDisplayedResources([])
            setOwnedAssetIds([]);
        } else if (newChainProps.name && newChainProps.name.startsWith('Algorand')) {

            setChain(newChainProps.name);
            setConnect(() => async () => {
                algorandConnect(setConnector, setAddress, setConnected);
            });
            setDisconnect(() => async () => {
                await logout();
                await connector?.killSession({ message: 'bye' })
                connector?.rejectSession({ message: 'bye' })
                setConnector(undefined)
                setAddress('')
                setConnected(false);
            });
            setSignChallenge(() => async (challenge: string) => {
                if (connector) return signChallengeAlgo(connector, challenge, newChainProps.name === 'Algorand Testnet');
                else throw 'Error signing challenge'
            });
            setDisplayedResources([])
            setOwnedAssetIds([]);
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
                    disconnect={async () => {
                        disconnect()
                    }}
                    chainOptions={[
                        //These should match what ChainDrivers are implemented in your backend.
                        {
                            name: 'Ethereum'
                        },
                        {
                            name: 'Algorand Testnet',
                        },
                        {
                            name: 'Algorand Mainnet',
                        },
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
                    signAndVerifyChallenge={async (challenge: string) => {
                        const signChallengeResponse = await handleSignChallenge(challenge);
                        if (!signChallengeResponse.originalBytes || !signChallengeResponse.signatureBytes) {
                            return { success: false, message: `${signChallengeResponse.message}` };
                        }

                        const verifyChallengeResponse = await handleVerifyChallenge(
                            signChallengeResponse.originalBytes,
                            signChallengeResponse.signatureBytes,
                            constructChallengeObjectFromString(challenge)
                        );
                        return verifyChallengeResponse;
                    }}
                    canAddCustomAssets={false}
                />
            }
        </div>
        {/* {userIsSigningChallenge && displayMessage} */}
    </>;
}