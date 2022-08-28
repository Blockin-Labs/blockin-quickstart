import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import WalletConnect from '@walletconnect/client'
import { ChainContextProvider, SignChallengeResponse } from '../chain_handlers_frontend/ChainContext';
import { connect as algorandConnect } from '../chain_handlers_frontend/algorand/WalletConnect';
import { AlgorandContext, AlgorandContextProvider } from '../chain_handlers_frontend/algorand/AlgorandContext';
import { PresetResource } from 'blockin';
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { EthereumContext, EthereumContextProvider } from '../chain_handlers_frontend/ethereum/EthereumContext';


const App = ({ Component, pageProps }: AppProps) => {
    return (
        <EthereumContextProvider>
            <AlgorandContextProvider>
                <ChainContextProvider>
                    <Component {...pageProps} />
                </ChainContextProvider>
            </AlgorandContextProvider>
        </EthereumContextProvider>
    )
}

export default App
