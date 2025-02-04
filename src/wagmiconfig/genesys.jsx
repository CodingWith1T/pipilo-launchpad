import { defineChain } from 'viem'

export const genesys = defineChain({
  id: 16507,
  name: 'GChain',
  nativeCurrency: { name: 'Genesys', symbol: 'GSYS', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.genesys.network/'] },
  },
  blockExplorers: {
    default: { name: 'GChainExplorer', url: 'https://gchainexplorer.genesys.network/' },
  },
  contracts: {
    multicall3: {
      address: '0x90a2377F233E3461BACa6080d4837837d8762927',
      blockCreated: 4773657,
    },
  },
  testnet:false,
  iconUrl:'https://photos.pinksale.finance/file/pinksale-logo-upload/1730185052214-fb21597b82b40d32ad26681083b5203b.png'
})