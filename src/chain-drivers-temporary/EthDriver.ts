import { CreateAssetParams, CreateTransferAssetParams, IChainDriver, UniversalTxn } from 'blockin';
import { recoverPersonalSignature } from 'eth-sig-util';
import { ethers } from 'ethers';
import Moralis from "moralis/node";

interface MoralisDetails {
    serverUrl: string;
    appId: string;
    masterKey: string;
}

/**
 * Ethereum implementation of the IChainDriver interface. This implementation is based off the Moralis API
 * and ethers.js library.
 * 
 * For documentation regarding what each function does, see the IChainDriver interface.
 * 
 * Note that the Blockin library also has many convenient, chain-generic functions that implement 
 * this logic for creating / verifying challenges. Before using,ou will have to setChainDriver(new EthDriver(.....)) first.
 */
export default class EthDriver implements IChainDriver {
    moralisDetails: MoralisDetails;

    constructor(chain: string, MORALIS_DETAILS?: MoralisDetails) {
        this.moralisDetails = MORALIS_DETAILS ? MORALIS_DETAILS : {
            serverUrl: '',
            appId: '',
            masterKey: ''
        };

        Moralis.start(this.moralisDetails);
    }

    /** Boilerplates - Not Implemented Yet */
    async makeAssetTxn(assetParams: CreateAssetParams) {
        throw 'Not implemented';
        return this.createUniversalTxn({}, ``)
    }

    async makeAssetTransferTxn(assetParams: CreateTransferAssetParams) {
        throw 'Not implemented';
        return this.createUniversalTxn({}, ``)
    }

    async sendTxn(signedTxnResult: any, txnId: string): Promise<any> {
        throw 'Not implemented';
        return;
    }

    async getChallengeStringFromBytesToSign(txnBytes: Uint8Array) {
        const txnString = new TextDecoder().decode(txnBytes);
        const txnString2 = Buffer.from(txnString.substring(2), "hex").toString();

        return txnString2;
    }

    async lookupTransactionById(txnId: string) {
        const options = {
            transaction_hash: txnId,
        };
        const transaction = await Moralis.Web3API.native.getTransaction(options);
        return transaction;
    }

    async getAssetDetails(assetId: string | Number): Promise<any> {
        const options = {
            addresses: [`${assetId}`],
        };
        const tokenMetadata = await Moralis.Web3API.token.getTokenMetadata(options);
        return tokenMetadata;
    }

    async getAllAssetsForAddress(address: string): Promise<any> {
        const options = {
            address
        };

        const accountAssets = await Moralis.Web3API.account.getNFTs(options);
        return accountAssets['result'];
    }

    async getLastBlockIndex(): Promise<string> {
        const lastBlock = await Moralis.Web3API.native.getDateToBlock({
            date: `${new Date()}`
        });

        const lastBlockHash = lastBlock['block'];

        const options = { block_number_or_hash: `${lastBlockHash}` };

        // get block content on BSC
        const transactions = await Moralis.Web3API.native.getBlock(options);


        return transactions['hash'];
    }

    async getTimestampForBlock(blockIndexStr: string): Promise<string> {
        const options = { block_number_or_hash: `${blockIndexStr}` };

        const transactions = await Moralis.Web3API.native.getBlock(options);

        return transactions['timestamp'];
    }

    isValidAddress(address: string): boolean {
        return ethers.utils.isAddress(address);
    }

    /**Not implemented */
    getPublicKeyFromAddress(address: string): Uint8Array {
        throw 'Not implemented';
        return new Uint8Array(0);
    }

    async verifySignature(originalChallengeToUint8Array: Uint8Array, signedChallenge: Uint8Array, originalAddress: string): Promise<void> {
        const original = new TextDecoder().decode(originalChallengeToUint8Array);
        const signed = new TextDecoder().decode(signedChallenge);

        const recoveredAddr = recoverPersonalSignature({
            data: original,
            sig: signed,
        });

        if (recoveredAddr !== originalAddress) {
            throw `Signature Invalid: Expected ${originalAddress} but got ${recoveredAddr}`
        }
    }

    async verifyOwnershipOfAssets(address: string, resources: string[], assetMinimumBalancesMap?: any, defaultMinimum?: number) {
        if (!resources || resources.length == 0) return;

        let assetIds: string[] = [];
        if (resources) {
            const filteredAssetIds = resources.filter(elem => elem.startsWith('Asset ID: '));
            for (const assetStr of filteredAssetIds) {
                const assetId = assetStr.substring(10);
                assetIds.push(assetId);
            }
        }

        const options = {
            address
        };
        const assets = (await Moralis.Web3API.account.getNFTs(options)).result;

        const assetLookupData = {
            assetsForAddress: assets,
            address,
        };

        for (let i = 0; i < assetIds.length; i++) {
            const assetId = assetIds[i];
            const defaultBalance = defaultMinimum ? defaultMinimum : 1;
            const minimumAmount = assetMinimumBalancesMap && assetMinimumBalancesMap[assetId] ? assetMinimumBalancesMap[assetId] : defaultBalance;

            const requestedAsset = assets?.find((elem: any) => elem['asset-id'].toString() === assetId);
            if (!requestedAsset) {
                throw `Address ${address} does not own requested asset : ${assetId}`;
            }
            console.log(`Success: Found asset in user's wallet: ${assetId}.`);
            console.log('ASSET DETAILS', requestedAsset);

            if (requestedAsset['amount'] && requestedAsset['amount'] < minimumAmount) {
                throw `Address ${address} only owns ${requestedAsset['amount']} and does not meet minimum balance requirement of ${minimumAmount} for asset : ${assetId}`;
            }
        }

        return assetLookupData;
    }

    /**
     * Currently just a boilerplate
     */
    private createUniversalTxn(txn: any, message: string): UniversalTxn {
        return {
            txn,
            message,
            txnId: txn.txnId,
            nativeTxn: txn
        }
    }
}
