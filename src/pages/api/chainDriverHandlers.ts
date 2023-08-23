//TODO: Note out of thebox, we provided with the Blockin-built ChainDrivers. You can also create your own ChainDriver by implementing the IChainDriver interface or other implemented ChainDrivers.
//Select the best for your use case. See a curated list on the Blockin docs.

//TODO: You can also copy and paste the code from existing drivers and modify it to your liking.
// import CosmosDriver from './chainDrivers/CosmosDriver'
// import AlgoDriver from './chainDrivers/AlgoDriver'
// import EthDriver from './chainDrivers/EthDriver'
// import CosmosDriver from './chainDrivers/CosmosDriver'

//If you simply want the library versions of the Blockin drivers, you can import them like below.
import AlgoDriver from 'blockin-algo-driver';
import CosmosDriver from 'blockin-cosmos-driver';
import EthDriver from 'blockin-eth-driver';

//TODO: Make sure you have process.env.BITBADGES_API_KEY for BitBadges compatibility

//0x1 is the Moralis chain ID for Ethereum Mainnet
const ethDriver = new EthDriver('0x1', {
  apiKey: process.env.MORALIS_API_KEY ? process.env.MORALIS_API_KEY : '',
});

const polygonDriver = new EthDriver('0x89', {
  apiKey: process.env.MORALIS_API_KEY ? process.env.MORALIS_API_KEY : '',
});

const bscDriver = new EthDriver('0x38', {
  apiKey: process.env.MORALIS_API_KEY ? process.env.MORALIS_API_KEY : '',
});

const avalancheDriver = new EthDriver('0xa86a', {
  apiKey: process.env.MORALIS_API_KEY ? process.env.MORALIS_API_KEY : '',
});

const algoTestnetDriver = new AlgoDriver('Testnet', process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : '');
const algoMainnetDriver = new AlgoDriver('Mainnet', process.env.ALGO_API_KEY ? process.env.ALGO_API_KEY : '');
const cosmosDriver = new CosmosDriver('bitbadges_1-1');

export const getChainDriver = (chain: string) => {


  switch (chain) {
    case 'Algorand Testnet':
      return algoTestnetDriver;
    case 'Algorand Mainnet':
      return algoMainnetDriver;
    case 'Ethereum':
      return ethDriver;
    case 'Polygon':
      return polygonDriver;
    case 'Avalanche':
      return avalancheDriver;
    case 'BSC':
      return bscDriver;
    case 'Cosmos':
      return cosmosDriver;
    default:
      return ethDriver;
  }
}