//TODO: Note out of thebox, we provided with the Blockin-built ChainDrivers. You can also create your own ChainDriver by implementing the IChainDriver interface or other implemented ChainDrivers.
//Select the best for your use case. See a curated list on the Blockin docs.

//TODO: You can also copy and paste the code from existing drivers and modify it to your liking.
// import CosmosDriver from './chainDrivers/CosmosDriver'
// import AlgoDriver from './chainDrivers/AlgoDriver'
// import EthDriver from './chainDrivers/EthDriver'
// import CosmosDriver from './chainDrivers/CosmosDriver'

//If you simply want the library versions of the Blockin drivers, you can import them like below.
// import AlgoDriver from 'blockin-algo-driver';
import CosmosDriver from 'blockin-cosmos-driver';
import EthDriver from 'blockin-eth-driver';
import SolDriver from 'blockin-sol-driver';

//TODO: Make sure you have process.env.BITBADGES_API_KEY for BitBadges compatibility

//0x1 is the Moralis chain ID for Ethereum Mainnet
const ethDriver = new EthDriver('0x1', {
  apiKey: process.env.MORALIS_API_KEY ? process.env.MORALIS_API_KEY : '',
});

const cosmosDriver = new CosmosDriver('bitbadges_1-1');

const solDriver = new SolDriver('Solana');

export const getChainDriver = (chain: string) => {

  switch (chain) {
    case 'Ethereum':
      return ethDriver;
    case 'Cosmos':
      return cosmosDriver;
    case 'Solana':
      return solDriver;
    default:
      return ethDriver;
  }
}