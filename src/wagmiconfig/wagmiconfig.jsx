import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, mainnet, optimism, sepolia, bsc, arbitrum, bscTestnet, coreDao } from 'wagmi/chains'
import { http } from 'wagmi'
import { genesys } from './genesys';

const projectId = '009a5125069bb56f589c3fc2e97282e2'

export const wagmiconfig = getDefaultConfig({
    appName: 'Pipilo Launchpad',
    projectId,
    chains: [bsc,
    {
      ...coreDao,
      iconUrl: 'https://photos.pinksale.finance/file/pinksale-logo-upload/1730185072313-e68cfb16510e29de34f5001b3330c096.png',
    }, genesys, base, bscTestnet],
    transports: {
        [mainnet.id]: http("https://ethereum-rpc.publicnode.com"),
        [optimism.id]: http("https://optimism-rpc.publicnode.com"),
        [base.id]: http("https://base-rpc.publicnode.com"),
        [bsc.id]: http("https://bsc-rpc.publicnode.com"),
        [arbitrum.id]: http("https://arbitrum.drpc.org"),
        [coreDao.id]: http("https://rpc.coredao.org"),
        [sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"),
        [bscTestnet.id]: http("https://bsc-testnet-rpc.publicnode.com"),
        [genesys.id]: http("https://rpc.genesys.network/"),
    },
});






