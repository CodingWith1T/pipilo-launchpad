import tokenStandardBytecode from './bytecodes/tokenStandard.json'
import tokenLiquidityGenratorBytecode from './bytecodes/tokenLiquidityGenrator.json'
import tokenBabyBytecode from './bytecodes/tokenBaby.json'
import tokenBuyBackBabyBytecode from './bytecodes/tokenBuyBackBaby.json'
import pipiTokenBytecode from './bytecodes/pipiToken.json'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' //

export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD' //

export const USDC = {
    '11155111': '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
    '97': '0x64544969ed7EBf5f083679233325356EbE738930',
    '56': '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
}

// Managers addresses
export const manager = {
    '11155111': '0x7d9FB373C827EEDbba929D9C28f5473E0A8d4229',
    // '97': '0x71B2742f00bEdc96EF19dBB1511Bd9375bd8EF9f',
    '97': '0x9596077c996FC9d63ee79AecC8811e8cd1C5Db53', // Deploy at Jan 17 2025
    '56': '0x6fE299dE32993e75AAcec4343c2618c21B1c9f2d',
    '1116': '0x6462386D3e8555C49143289CD24a7fe13fF2e453',
    '16507': '0x300EB5D633c8154466aFC73E98328E882E3D843D',
    '8453': '0x5971452D4378C2c1425E9758d03FBB8EF9d54955',
}

// Lockers addresses
export const locker = {
    '11155111': '0x7AF39aC33c2a873E81A754c4B292B8a537bBeDc4',
    // '97': '0xa266Df3552FDE990976273bb943504d344684B8C',
    '97': '0xE7b055005ace44652d7F8418A6abe8900E92d2B5', // Deploy at Jan 17 2025
    '56': '0xa43ef79D27a0aB7f4F2Fc7C9b1999cBBd3b06c6F',
    '1116': '0x18b4F74084F33aa7fBa058D7F623d4bf26A28906',
    '16507': '0x6E0Dcc442501c46098Ac010FC48B50c0f205f562',
    '8453': '0xa266Df3552FDE990976273bb943504d344684B8C',
}

// Platform fee reciever address
export const feeAddress = {
    '11155111': '0xAe18A9deDA9163bBd53984668952875FfB9abBbD',
    '97': '0xAe18A9deDA9163bBd53984668952875FfB9abBbD',
    '56': '0x6bF6b66a2d1189fE8BE0b0a672465803EC918C56',
    '1116': '0x6bF6b66a2d1189fE8BE0b0a672465803EC918C56',
    '16507': '0x6bF6b66a2d1189fE8BE0b0a672465803EC918C56',
    '8453': '0x6bF6b66a2d1189fE8BE0b0a672465803EC918C56'
}
export const dividendTrackerAddresses = {
    '11155111': '0xf8741c53974884fBDF7FF05944b66B67F82F7a86'
}

// Routers
const arbitrumRouters = {

}
const baseRouters = {
    'UniswapV2': '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
    'Pancake Swap': '0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E',
    'Icecream Swap': '0xBb5e1777A331ED93E07cF043363e48d320eb96c4',
}
const bscRouters = {
    'UniswapV2': '0x4Dae2f939ACf50408e13d58534Ff8c2776d45265',
    'Pancake Swap': '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    'PipiSwap': '0x300eb5d633c8154466afc73e98328e882e3d843d',
    'BabyDogeSwap': '0xC9a0F685F39d05D835c369036251ee3aEaaF3c47',
    'MelegaSwap': '0xc25033218D181b27D4a2944Fbb04FC055da4EAB3',
}
const etheriumRouters = {

}
const optimismRouters = {

}
const sepoliaRouters = {
    'UniswapV2': '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E',
}
const bscTestnetRouters = {
    'Pancake Swap': '0xD99D1c33F9fC3444f8101754aBC46c52416550D1',
}
const coreRouters = {
    'PipiSwap': '0x5971452D4378C2c1425E9758d03FBB8EF9d54955',
    'Icecream Swap': '0xBb5e1777A331ED93E07cF043363e48d320eb96c4',
    'ArcherSwap': '0x74f56a7560ef0c72cf6d677e3f5f51c2d579ff15',
}
const genesysRouters = {
    "BlueLotusDaoRouter": "0x67d97E67d759bA1f86b25151705006e2868292aa"
}
export const routers = {
    '42161': arbitrumRouters,
    '8453': baseRouters,
    '56': bscRouters,
    '1': etheriumRouters,
    '10': optimismRouters,
    '11155111': sepoliaRouters,
    '97': bscTestnetRouters,
    '1116': coreRouters,
    '16507': genesysRouters,
}

// Wrapped Tokens
const sepoliaWrappedTokens = {

}
const bscTestnetWrappedTokens = {

}
export const wrappedTokens = {
    '11155111': sepoliaWrappedTokens,
    '97': bscTestnetWrappedTokens
}

//fees in ethers
const sepoliaFees = {
    'standardLaunch': '0.1',
    'fairLaunch': '0.1',

    'standardToken': '0.1',
    'liquidityGenratorToken': '0.1',
    'babyToken': '0.1',
    'babyBuybackToken': '0.1',
    'pipiToken': '0.1',

}
const bscTestnetFees = {
    'standardLaunch': '0.1',
    'fairLaunch': '0.1',

    'standardToken': '0.1',
    'liquidityGenratorToken': '0.1',
    'babyToken': '0.1',
    'babyBuybackToken': '0.1',
    'pipiToken': '0.1',

}
const bscFees = {
    'standardLaunch': '0',
    'fairLaunch': '0',

    'standardToken': '0.1',
    'liquidityGenratorToken': '0.20',
    'babyToken': '0.1',
    'babyBuybackToken': '0.1',
    'pipiToken': '0.60',
}
const coreFees = {
    'standardLaunch': '0',
    'fairLaunch': '0',
    'standardToken': '0',
    'liquidityGenratorToken': '40',
    'babyToken': '0',
    'babyBuybackToken': '0',
    'pipiToken': '100',
}
const genesysFees = {
    'standardLaunch': '0',
    'fairLaunch': '0',
    'standardToken': '0',
    'liquidityGenratorToken': '800',
    'babyToken': '0',
    'babyBuybackToken': '0',
    'pipiToken': '2000',
}
const baseFees = {
    'standardLaunch': '0',
    'fairLaunch': '0',
    'standardToken': '0',
    'liquidityGenratorToken': '0.04',
    'babyToken': '0',
    'babyBuybackToken': '0',
    'pipiToken': '0.12',
}
export const fees = {
    '11155111': sepoliaFees,
    '97': bscTestnetFees,
    '56': bscFees,
    '1116': coreFees,
    '16507': genesysFees,
    '8453': baseFees,
}
export const bytecodes = {
    '0': tokenStandardBytecode.bytecode,
    '1': tokenLiquidityGenratorBytecode.bytecode,
    "2": tokenBabyBytecode.bytecode,
    "3": tokenBuyBackBabyBytecode.bytecode,
    "4": pipiTokenBytecode.bytecode,
}