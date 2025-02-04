import React, { useState, useEffect } from 'react';
import { Card, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { useAccount, useConnect } from 'wagmi';
import TokenTypeSelector from '../../Components/TokenCreateForms/TokenTypeSelector/TokenTypeSelector';
import TokenDetails from '../../Components/TokenCreateForms/TokenDetails/TokenDetails';
import { routers, fees, bytecodes, USDC, feeAddress, dividendTrackerAddresses } from '../../constants/constants';
import LiquidityGeneratorTokenForm from '../../Components/TokenCreateForms/LiquidityGeneratorTokenForm/LiquidityGeneratorTokenForm';
import BabyTokenForm from '../../Components/TokenCreateForms/BabyTokenForm/BabyTokenForm';
import BuybackBabyTokenForm from '../../Components/TokenCreateForms/BuybackBabyTokenForm/BuybackBabyTokenForm';
import { useDeployContract } from 'wagmi'
import { wagmiconfig } from '../../wagmiconfig/wagmiconfig';
import tokenStandardAbi from '../../constants/abi/tokenStandard.json';
import tokenLiquidityGenratorAbi from '../../constants/abi/tokenLiquidityGenrator.json';
import tokenBabyAbi from '../../constants/abi/tokenBaby.json';
import tokenBuyBackBabyAbi from '../../constants/abi/tokenBuyBackBaby.json';
import pipiTokenAbi from '../../constants/abi/pipiToken.json';
import FormButton from '../../Components/FormButton/FormButton';
import { parseEther, parseUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { Link } from 'react-router-dom';
import PipitokenForm from '../../Components/TokenCreateForms/PipitokenForm/PipitokenForm';
import { estimateGas } from '@wagmi/core'

const TokenCreate = () => {
  const { chain, address } = useAccount();
  const { connectAsync } = useConnect();
  const { deployContractAsync, isPending, isSuccess } = useDeployContract({
    wagmiconfig,
  })
  // console.log({ deployContractAsync, isPending, isSuccess })

  // tokenType 0  Standard Token
  // tokenType 1  Liquidity Generator Token
  // tokenType 2  Baby Token
  // tokenType 3  Buyback Baby Token
  // tokenType 4  Pipi Token
  const [tokenType, setTokenType] = useState(0);

  const [tokenName, setTokenName] = useState(''); // tokenType 0,1,2,3,4
  const [tokenSymbol, setTokenSymbol] = useState(''); // tokenType 0,1,2,3,4
  const [tokenDecimal, setTokenDecimal] = useState(0); // tokenType 0
  const [tokenTotalSupply, setTokenTotalSupply] = useState(0); // tokenType 0,1,2,3,4

  const [router, setRouter] = useState("Select a router"); // tokenType 1,2,3,4

  const [yieldGenerateFee, setYieldGenerateFee] = useState(0); // tokenType 1
  const [liquidityGenerateFee, setLiquidityGenerateFee] = useState(0); // tokenType 1
  const [marketingAddress, setMarketingAddress] = useState(''); // tokenType 1,2,4
  const [marketingPercent, setMarketingPercent] = useState(0); // tokenType 1,4  
  const [rewardToken, setRewardToken] = useState(''); // tokenType  2,3,4
  const [minimumTokenBalance, setMinimumTokenBalance] = useState(0); // tokenType 2
  const [tokenRewardFee, setTokenRewardFee] = useState(0); // tokenType 2
  const [marketingFee, setMarketingFee] = useState(0); // tokenType 2,3
  const [liquidityPercent, setLiquidityPercent] = useState(0); // tokenType 2,3,4

  const [reflectionFee, setReflectionFee] = useState(0); // tokenType 3
  const [buybackFee, setBuybackFee] = useState(0); // tokenType 3

  const [charityFee, setCharityFee] = useState(''); // tokenType 4
  const [sellDevloperPercent, setSellDevloperPercent] = useState(''); // tokenType 4
  const [sellCharityFee, setSellCharityFee] = useState('');
  const [sellMarketingPercent, setSellMarketingPercent] = useState(''); // tokenType 4
  const [sellLiquidityPercent, setSellLiquidityPercent] = useState(''); // tokenType 4
  const [charityAddress, setCharityAddress] = useState(''); // tokenType 4
  const [devloperAddress, setDevloperAddress] = useState(''); // tokenType 4
  const [devloperPercent, setDevloperPercent] = useState(0); // tokenType 4

  const [tokenCreationHash, setTokenCreationHash] = useState('');

  const routerAddresses = routers[chain?.id] || [];

  // errors----------------------------------------------------------------------------
  const [tokenNameError, setTokenNameError] = useState('null'); // tokenType 0,1,2,3,4
  const [tokenSymbolError, setTokenSymbolError] = useState('null'); // tokenType 0,1,2,3,4
  const [tokenDecimalError, setTokenDecimalError] = useState(tokenType == 0 ? 'null' : null); // tokenType 0
  const [tokenTotalSupplyError, setTokenTotalSupplyError] = useState('null'); // tokenType 0,1,2,3,4

  const [routerError, setRouterError] = useState(tokenType > 0 ? 'null' : null); // tokenType 1,2,3,4

  const [yieldGenerateFeeError, setYieldGenerateFeeError] = useState(tokenType == 1 ? 'null' : null); // tokenType 1
  const [liquidityGenerateFeeError, setLiquidityGenerateFeeError] = useState(tokenType == 1 ? 'null' : null); // tokenType 1
  const [marketingAddressError, setMarketingAddressError] = useState(tokenType == 1 || tokenType == 2 || tokenType === 4 ? 'null' : null); // tokenType 1,2,4
  const [marketingPercentError, setMarketingPercentError] = useState(tokenType == 1 || tokenType === 4 ? 'null' : null); // tokenType 1,4

  const [rewardTokenError, setRewardTokenError] = useState(tokenType == 2 || tokenType == 3 || tokenType === 4 ? 'null' : null); // tokenType  2,3
  const [minimumTokenBalanceError, setMinimumTokenBalanceError] = useState(tokenType == 2 ? 'null' : null); // tokenType 2

  const [marketingFeeError, setMarketingFeeError] = useState(tokenType == 2 || tokenType == 3 ? 'null' : null); // tokenType 2,3
  const [tokenRewardFeeError, setTokenRewardFeeError] = useState(tokenType == 2 ? 'null' : null); // tokenType 2
  const [liquidityPercentError, setLiquidityPercentError] = useState(tokenType == 2 || tokenType == 3 || tokenType === 4 ? 'null' : null); // tokenType 2,3,4

  const [reflectionFeeError, setReflectionFeeError] = useState(tokenType == 3 ? 'null' : null); // tokenType 3
  const [buybackFeeError, setBuybackFeeError] = useState(tokenType == 3 ? 'null' : null); // tokenType 3

  const [charityFeeError, setCharityFeeError] = useState(tokenType === 4 ? 'null' : null); // tokenType 4
  const [sellDevloperPercentError, setSellDevloperPercentError] = useState(tokenType === 4 ? 'null' : null); // tokenType 4
  const [sellCharityFeeError, setSellCharityFeeError] = useState(tokenType === 4 ? 'null' : null); // tokenType 4
  const [sellMarketingPercentError, setSellMarketingPercentError] = useState(tokenType === 4 ? 'null' : null); // tokenType 4
  const [sellLiquidityPercentError, setSellLiquidityPercentError] = useState(tokenType === 4 ? 'null' : null); // tokenType 4
  const [charityAddressError, setCharityAddressError] = useState(tokenType === 4 ? 'null' : null); // tokenType 4
  const [devloperAddressError, setDevloperAddressError] = useState(tokenType === 4 ? 'null' : null); // tokenType 4
  const [devloperPercentError, setDevloperPercentError] = useState(tokenType === 4 ? 'null' : null); // tokenType 4

  //button settings
  const [enableSubmit, setEnableSubmit] = useState(true);

  // console.log({ tokenType })

  // console.log({
  //   "error":
  //     tokenNameError ||
  //     tokenSymbolError ||
  //     tokenDecimalError ||
  //     tokenTotalSupplyError ||
  //     routerError ||
  //     yieldGenerateFeeError ||
  //     liquidityGenerateFeeError ||
  //     marketingAddressError ||
  //     marketingPercentError ||
  //     rewardTokenError ||
  //     minimumTokenBalanceError ||
  //     marketingFeeError ||
  //     tokenRewardFeeError ||
  //     liquidityPercentError ||
  //     reflectionFeeError ||
  //     buybackFeeError ||
  //     charityFeeError ||
  //     sellDevloperPercentError ||
  //     sellCharityFeeError ||
  //     sellMarketingPercentError ||
  //     sellLiquidityPercentError ||
  //     charityAddressError ||
  //     devloperAddressError ||
  //     devloperPercentError ||
  //     !enableSubmit
  // });

  // // Individual logs for debugging
  // console.log({ tokenNameError });
  // console.log({ tokenSymbolError });
  // console.log({ tokenDecimalError });
  // console.log({ tokenTotalSupplyError });
  // console.log({ routerError });
  // console.log({ yieldGenerateFeeError });
  // console.log({ liquidityGenerateFeeError });
  // console.log({ marketingAddressError });
  // console.log({ marketingPercentError });
  // console.log({ rewardTokenError });
  // console.log({ minimumTokenBalanceError });
  // console.log({ marketingFeeError });
  // console.log({ tokenRewardFeeError });
  // console.log({ liquidityPercentError });
  // console.log({ reflectionFeeError });
  // console.log({ buybackFeeError });
  // console.log({ charityFeeError });
  // console.log({ sellDevloperPercentError });
  // console.log({ sellCharityFeeError });
  // console.log({ sellMarketingPercentError });
  // console.log({ sellLiquidityPercentError });
  // console.log({ charityAddressError });
  // console.log({ devloperAddressError });
  // console.log({ devloperPercentError });
  // console.log({ enableSubmit });

  useEffect(() => {
    if (tokenType == 0) {
      setTokenDecimalError('null');
      setRouterError(null); setRouter("Select a router");
      setYieldGenerateFeeError(null); setYieldGenerateFee(0);
      setLiquidityGenerateFeeError(null); setLiquidityGenerateFee(0);
      setMarketingAddressError(null); setMarketingAddress('');
      setMarketingPercentError(null); setMarketingPercent(0);
      setRewardTokenError(null); setRewardToken('');
      setMinimumTokenBalanceError(null); setMinimumTokenBalance(0);
      setMarketingFeeError(null); setMarketingFee(0);
      setTokenRewardFeeError(null); setTokenRewardFee(0);
      setLiquidityPercentError(null); setLiquidityPercent(0);
      setReflectionFeeError(null); setReflectionFee(0);
      setBuybackFeeError(null); setBuybackFee(0);
      setCharityAddressError(null); setCharityAddress('');
      setDevloperAddressError(null); setDevloperAddress('');
      setDevloperPercentError(null); setDevloperPercent(0);
      setCharityFeeError(null); setCharityFee(0);
      setSellDevloperPercentError(null); setSellDevloperPercent(0);
      setSellCharityFeeError(null); setSellCharityFee(0);
      setSellMarketingPercentError(null); setSellMarketingPercent(0);
      setSellLiquidityPercentError(null); setSellLiquidityPercent(0);
    }
    if (tokenType == 1) {
      setTokenDecimalError(null); setTokenDecimal(0);
      setRouterError('null');
      setYieldGenerateFeeError('null');
      setLiquidityGenerateFeeError('null');
      setMarketingAddressError('null');
      setMarketingPercentError('null');
      setRewardTokenError(null); setRewardToken('');
      setMinimumTokenBalanceError(null); setMinimumTokenBalance(0);
      setMarketingFeeError(null); setMarketingFee(0);
      setTokenRewardFeeError(null); setTokenRewardFee(0);
      setLiquidityPercentError(null); setLiquidityPercent(0);
      setReflectionFeeError(null); setReflectionFee(0);
      setBuybackFeeError(null); setBuybackFee(0);
      setCharityAddressError(null); setCharityAddress('');
      setDevloperAddressError(null); setDevloperAddress('');
      setDevloperPercentError(null); setDevloperPercent(0);
      setCharityFeeError(null); setCharityFee(0);
      setSellDevloperPercentError(null); setSellDevloperPercent(0);
      setSellCharityFeeError(null); setSellCharityFee(0);
      setSellMarketingPercentError(null); setSellMarketingPercent(0);
      setSellLiquidityPercentError(null); setSellLiquidityPercent(0);
    }
    if (tokenType == 2) {
      setTokenDecimalError(null); setTokenDecimal(0);
      setRouterError('null');
      setYieldGenerateFeeError(null); setYieldGenerateFee(0);
      setLiquidityGenerateFeeError(null); setLiquidityGenerateFee(0);
      setMarketingAddressError('null');
      setMarketingPercentError(null); setMarketingPercent(0);
      setRewardTokenError('null');
      setMinimumTokenBalanceError('null');
      setMarketingFeeError('null');
      setTokenRewardFeeError('null');
      setLiquidityPercentError('null');
      setReflectionFeeError(null); setReflectionFee(0);
      setBuybackFeeError(null); setBuybackFee(0);
      setCharityAddressError(null); setCharityAddress('');
      setDevloperAddressError(null); setDevloperAddress('');
      setDevloperPercentError(null); setDevloperPercent(0);
      setCharityFeeError(null); setCharityFee(0);
      setSellDevloperPercentError(null); setSellDevloperPercent(0);
      setSellCharityFeeError(null); setSellCharityFee(0);
      setSellMarketingPercentError(null); setSellMarketingPercent(0);
      setSellLiquidityPercentError(null); setSellLiquidityPercent(0);
    }
    if (tokenType == 3) {
      setTokenDecimalError(null); setTokenDecimal(0);
      setRouterError('null');
      setYieldGenerateFeeError(null); setYieldGenerateFee(0);
      setLiquidityGenerateFeeError(null); setLiquidityGenerateFee(0);
      setMarketingAddressError(null); setMarketingAddress('');
      setMarketingPercentError(null); setMarketingPercent(0);
      setRewardTokenError('null');
      setMinimumTokenBalanceError(null); setMinimumTokenBalance(0);
      setMarketingFeeError('null');
      setTokenRewardFeeError(null); setTokenRewardFee(0);
      setLiquidityPercentError('null');
      setReflectionFeeError('null');
      setBuybackFeeError('null');
      setCharityAddressError(null); setCharityAddress('');
      setDevloperAddressError(null); setDevloperAddress('');
      setDevloperPercentError(null); setDevloperPercent(0);
      setCharityFeeError(null); setCharityFee(0);
      setSellDevloperPercentError(null); setSellDevloperPercent(0);
      setSellCharityFeeError(null); setSellCharityFee(0);
      setSellMarketingPercentError(null); setSellMarketingPercent(0);
      setSellLiquidityPercentError(null); setSellLiquidityPercent(0);
    }
    if (tokenType == 4) {
      setTokenDecimalError(null); setTokenDecimal(0);
      setRouterError('null');
      setYieldGenerateFeeError(null); setYieldGenerateFee(0);
      setLiquidityGenerateFeeError(null); setLiquidityGenerateFee(0);
      setMarketingAddressError('null');
      setMarketingPercentError('null');
      setRewardTokenError(null); setRewardToken('');
      setMinimumTokenBalanceError(null); setMinimumTokenBalance(0);
      setMarketingFeeError(null); setMarketingFee(0);
      setTokenRewardFeeError(null); setTokenRewardFee(0);
      setLiquidityPercentError('null');
      setReflectionFeeError(null); setReflectionFee(0);
      setBuybackFeeError(null); setBuybackFeeError(0);
      setCharityAddressError('null');
      setDevloperAddressError('null');
      setDevloperPercentError('null');
      setCharityFeeError('null');
      setSellDevloperPercentError('null');
      setSellCharityFeeError('null');
      setSellMarketingPercentError('null');
      setSellLiquidityPercentError('null');
    }
  }, [tokenType]);

  const handleTokenType = (value) => {
    setTokenType(value)
  }

  const handleTokenName = (value) => {
    if (value.length < 2) {
      setTokenNameError('Invalid Token Name');
    } else {
      setTokenNameError(null);
    }
    setTokenName(value);
  };

  const handleTokenSymbol = (value) => {
    if (value.length < 2) {
      setTokenSymbolError('Invalid Token Symbol');
    } else {
      setTokenSymbolError(null);
    }
    setTokenSymbol(value);
  };

  const handleTokenDecimal = (value) => {
    if (value < 2) {
      setTokenDecimalError('Decimal must be greater than or equal to 2');
    } else if (value > 64) {
      setTokenDecimalError('Decimal must be less than or equal to 64');
    } else {
      setTokenDecimalError(null);
    }
    setTokenDecimal(value);
  };

  const handleTokenTotalSupply = (value) => {
    if (value < 0) {
      setTokenTotalSupplyError('Total Supply must not be a negetive number!');
    } else {
      setTokenTotalSupplyError(null);
    }
    setTokenTotalSupply(value);
  };

  const handleRouter = (value) => {
    if (tokenType > 0 && value == "") {
      setRouterError('Please select a router!');
    } else {
      setRouterError(null);
    }
    setRouter(value)
  }

  const handleYieldGenerateFee = (value) => {
    if (value < 0) {
      setYieldGenerateFeeError('Yield generation fee must not be a negetive number!');

    } else {
      setYieldGenerateFeeError(null);
    }
    setYieldGenerateFee(value);
  };

  const handleLiquidityGenerateFee = (value) => {
    if (value < 0) {
      setLiquidityGenerateFeeError('Liquidity generation fee must not be a negetive number!');
    } else {
      setLiquidityGenerateFeeError(null);
    }
    setLiquidityGenerateFee(value);
  };

  const handleMarketingPercent = (value) => {
    if (value < 0) {
      setMarketingPercentError('Invalid Marketing Percentage');
    } else {
      setMarketingPercentError(null);
    }
    setMarketingPercent(value);
  }

  const handleMarketingAddress = (value) => {
    if (value.length != 0 && value.length < 42) {
      setMarketingAddressError('Invalid Marketing Address');
    } else {
      setMarketingAddressError(null);
    }
    setMarketingAddress(value);
  }

  const handleRewardToken = (value) => {
    if (value.length != 0 && value.length < 42) {
      setRewardTokenError('Invalid Reward Token Address');
    } else {
      setRewardTokenError(null);
    }
    setRewardToken(value);
  }

  const handleMinimumTokenBalance = (value) => {
    if (value < 0) {
      setMinimumTokenBalanceError('Invalid Minimum Token Balance ');
    } else {
      setMinimumTokenBalanceError(null);
    }
    setMinimumTokenBalance(value);
  }

  const handleTokenRewardFee = (value) => {
    if (value < 0) {
      setTokenRewardFeeError('Invalid Minimum Token Balance ');
    } else {
      setTokenRewardFeeError(null);
    }
    setTokenRewardFee(value);
  }

  const handleMarketingFee = (value) => {
    if (value < 0) {
      setMarketingFeeError('Invalid marketing fee ');
    } else {
      setMarketingFeeError(null);
    }
    setMarketingFee(value);
  }

  const handleLiquidityPercent = (value) => {
    if (value < 0) {
      setLiquidityPercentError('Invalid marketing fee ');
    } else {
      setLiquidityPercentError(null);
    }
    setLiquidityPercent(value);
  }

  const handleCharityAddress = (value) => {
    if (value < 0) {
      setCharityAddressError('Invalid marketing fee ');
    } else {
      setCharityAddressError(null);
    }
    setCharityAddress(value);
  }

  const handleDevloperAddress = (value) => {
    if (value < 0) {
      setDevloperAddressError('Invalid marketing fee ');
    } else {
      setDevloperAddressError(null);
    }
    setDevloperAddress(value);
  }

  const handleDevloperPercent = (value) => {
    if (value < 0) {
      setDevloperPercentError('Invalid marketing fee ');
    } else {
      setDevloperPercentError(null);
    }
    setDevloperPercent(value);
  }

  const handleReflectionFee = (value) => {
    if (value < 0) {
      setReflectionFeeError('Invalid marketing fee ');
    } else {
      setReflectionFeeError(null);
    }
    setReflectionFee(value);
  }
  const handleCharityFee = (value) => {
    if (value < 0) {
      setCharityFeeError('Invalid Charity fee ');
    } else {
      setCharityFeeError(null);
    }
    setCharityFee(value);
  }

  const handleBuybackFee = (value) => {
    if (value < 0) {
      setBuybackFeeError('Invalid Buy Back fee ');
    } else {
      setBuybackFeeError(null);
    }
    setBuybackFee(value);
  }
  const handleSellDevloperPercent = (value) => {
    if (value < 0) {
      setSellDevloperPercentError('Invalid developer sell tax');
    } else {
      setSellDevloperPercentError(null);
    }
    setSellDevloperPercent(value);
  };

  const handleSellCharityFee = (value) => {
    if (value < 0) {
      setSellCharityFeeError('Invalid charity fee');
    } else {
      setSellCharityFeeError(null);
    }
    setSellCharityFee(value);
  };

  const handleSellMarketingPercent = (value) => {
    if (value < 0) {
      setSellMarketingPercentError('Invalid marketing percent');
    } else {
      setSellMarketingPercentError(null);
    }
    setSellMarketingPercent(value);
  };

  const handleSellLiquidityPercent = (value) => {
    if (value < 0) {
      setSellLiquidityPercentError('Invalid liquidity fee');
    } else {
      setSellLiquidityPercentError(null);
    }
    setSellLiquidityPercent(value);
  };

  const handleCreateToken = async () => {

    if (tokenType == 0) {
      // console.log({
      //   tokenType, tokenName, tokenSymbol, tokenDecimal, tokenTotalSupply
      // })

      try {
        // console.log("first");
        if (!address) {
          await connectAsync();
        }


        const args = [tokenName, tokenSymbol, tokenDecimal, parseUnits(tokenTotalSupply, tokenDecimal.toString()), feeAddress[chain?.id], parseEther(fees[chain.id]['standardToken'].toString())];

        // console.log({
        //   args,
        //   chain: chain.id,
        //   fees,
        //   value: fees[chain.id]['standardToken'],
        //   abi: tokenStandardAbi,
        //   bytecode: bytecodes[tokenType]
        // })
        const estimatedGas = await estimateGas(wagmiconfig, {
          args,
          value: parseEther(fees[chain.id]['standardToken'].toString()),
          abi: tokenStandardAbi,
          bytecode: bytecodes[tokenType]
        })

        const data = await deployContractAsync({
          args,
          value: parseEther(fees[chain.id]['standardToken'].toString()),
          abi: tokenStandardAbi,
          bytecode: bytecodes[tokenType],
          gasLimit: estimatedGas,
        })
        // console.log("last");
        setTokenCreationHash(data);
        setEnableSubmit(false);
      }
      catch (error) {
        setTokenCreationHash(null);
        setEnableSubmit(true);
        const message = error.shortMessage;
        if (message) {
          if (message.includes('reason:')) {
            const reason = message.split('reason:')[1].trim();
            alert(reason);
          } else {
            alert(message);
          }
        }
      }

    } else if (tokenType == 1) {

      // console.log({
      //   tokenType, tokenName, tokenSymbol, tokenTotalSupply, router, yieldGenerateFee, liquidityGenerateFee, marketingAddress, marketingPercent
      // })

      try {

        if (tokenType === 1 && (parseInt(marketingPercent) + parseInt(yieldGenerateFee) + parseInt(marketingPercent)) > 25) {
          alert('Sum of marketingPercent, yieldGenerateFee, marketingPercent should not be greater than 25');
          return;
        }
        if (!address) {
          await connectAsync();
        }
        const args = [tokenName, tokenSymbol, parseUnits(tokenTotalSupply, '9'), routers[chain.id][router], marketingAddress, new BigNumber(yieldGenerateFee).times(100).toFixed(), new BigNumber(liquidityGenerateFee).times(100).toFixed(), new BigNumber(marketingPercent).times(100).toFixed(), feeAddress[chain?.id], parseEther(fees[chain.id]['liquidityGenratorToken'].toString())];

        const data = await deployContractAsync({
          args,
          value: parseEther(fees[chain.id]['liquidityGenratorToken'].toString()),
          abi: tokenLiquidityGenratorAbi,
          bytecode: bytecodes[tokenType]
        })
        // console.log("last");

        setTokenCreationHash(data);
        setEnableSubmit(false);
      }
      catch (error) {
        console.log({error})
        setTokenCreationHash(null);
        setEnableSubmit(true);
        const message = error.shortMessage;
        if (message) {
          if (message.includes('reason:')) {
            const reason = message.split('reason:')[1].trim();
            alert(reason);
          } else {
            alert(message);
          }
        }
      }

    } else if (tokenType == 2) {

      console.log({ tokenType, tokenName, tokenSymbol, tokenTotalSupply, router, rewardToken, minimumTokenBalance, tokenRewardFee, liquidityPercent, marketingFee, marketingAddress })

      try {
        // console.log("first")
        if (!address) {
          await connectAsync();
        }
        const args = [
          tokenName, tokenSymbol, parseUnits(tokenTotalSupply, tokenDecimal.toString()).toString(),
          [
            USDC[chain?.id],
            routers[chain.id][router],
            marketingAddress,
            dividendTrackerAddresses[chain.id]
          ],
          [
            new BigNumber(tokenRewardFee).times(100),
            new BigNumber(tokenRewardFee).times(100),
            new BigNumber(tokenRewardFee).times(100),
          ],
          minimumTokenBalance,
          feeAddress[chain?.id],
          parseEther(fees[chain.id]['babyToken'])
        ];

        // console.log({ args })

        const data = await deployContractAsync({
          args,
          value: parseEther(fees[chain.id]['babyToken']),
          abi: tokenBabyAbi,
          bytecode: bytecodes[tokenType]
        })
        // console.log("last");
        setTokenCreationHash(data);
        setEnableSubmit(false);
      }
      catch (error) {
        setTokenCreationHash(null);
        setEnableSubmit(true);
        const message = error.shortMessage;
        if (message) {
          if (message.includes('reason:')) {
            const reason = message.split('reason:')[1].trim();
            alert(reason);
          } else {
            alert(message);
          }
        }
      }

    } else if (tokenType == 3) {
      // console.log({ tokenType, tokenName, tokenSymbol, tokenTotalSupply, router, rewardToken, marketingFee, liquidityPercent, reflectionFee  })
      // console.log({ "routers[chain.id][router]": routers[chain.id][router] })

      try {
        // console.log("first")
        if (!address) {
          await connectAsync();
        }
        const args = [
          tokenName, tokenSymbol, parseUnits(tokenTotalSupply, 18), USDC[chain?.id], routers[chain.id][router],
          [
            new BigNumber(liquidityPercent).times(100),
            new BigNumber(buybackFee).times(100),
            new BigNumber(reflectionFee).times(100),
            new BigNumber(marketingFee).times(100),
            new BigNumber(100)

          ],
          feeAddress[chain?.id], parseEther(fees[chain.id]['babyBuybackToken'])
        ];

        // console.log({ args })

        const data = await deployContractAsync({
          args,
          value: parseEther(fees[chain.id]['babyBuybackToken']),
          abi: tokenBuyBackBabyAbi,
          bytecode: bytecodes[tokenType]
        })
        // console.log("last");
        setTokenCreationHash(data);
        setEnableSubmit(false);
      }
      catch (error) {
        setTokenCreationHash(null);
        setEnableSubmit(true);
        const message = error.shortMessage;
        if (message) {
          if (message.includes('reason:')) {
            const reason = message.split('reason:')[1].trim();
            alert(reason);
          } else {
            alert(message);
          }
        }
      }

    } else if (tokenType == 4) {

      // console.log({ "routers[chain.id][router]": routers[chain.id][router] })

      try {
        // console.log("first")
        if (!address) {
          await connectAsync();
        }
        const args = [
          tokenName, tokenSymbol, tokenTotalSupply,
          [
            routers[chain.id][router],
            devloperAddress,
            marketingAddress,
            charityAddress,
            address
          ],
          [
            new BigNumber(devloperPercent),
            new BigNumber(marketingPercent),
            new BigNumber(charityFee),
            new BigNumber(liquidityPercent),
            new BigNumber(sellDevloperPercent),
            new BigNumber(sellMarketingPercent),
            new BigNumber(sellCharityFee),
            new BigNumber(sellLiquidityPercent),

          ],
          feeAddress[chain?.id],
          parseEther(fees[chain.id]['pipiToken'])
        ];

        // console.log({ args })

        const data = await deployContractAsync({
          args,
          value: parseEther(fees[chain.id]['pipiToken']),
          abi: pipiTokenAbi,
          bytecode: bytecodes[tokenType]
        })
        // console.log("last");
        setTokenCreationHash(data);
        setEnableSubmit(false);
      }
      catch (error) {
        setTokenCreationHash(null);
        setEnableSubmit(true);
        const message = error.shortMessage;
        if (message) {
          if (message.includes('reason:')) {
            const reason = message.split('reason:')[1].trim();
            alert(reason);
          } else {
            alert(message);
          }
        }
      }

    }
    else {
      console.log("Token type error")
    }

  };

  return (
    <Card style={{ width: '100%', maxWidth: '1240px', margin: 'auto', marginTop: '20px' }}>
      <Card.Body className="formbox">
        <center><Card.Title>Create Token</Card.Title></center>
        <Form>

          <TokenTypeSelector handleTokenType={handleTokenType} />

          <TokenDetails
            tokenType={tokenType}
            tokenName={tokenName} handleTokenName={handleTokenName} tokenNameError={tokenNameError}
            tokenSymbol={tokenSymbol} handleTokenSymbol={handleTokenSymbol} tokenSymbolError={tokenSymbolError}
            tokenDecimal={tokenDecimal} handleTokenDecimal={handleTokenDecimal} tokenDecimalError={tokenDecimalError}
            tokenTotalSupply={tokenTotalSupply} handleTokenTotalSupply={handleTokenTotalSupply} tokenTotalSupplyError={tokenTotalSupplyError}
          />

          {tokenType > 0 &&
            <Form.Group className="mb-3 formdiv selectrouter">
              <Form.Label>Select Router Address*</Form.Label>
              <DropdownButton id="router-dropdown" title={router || "Select a router"}>
                {Object.entries(routerAddresses).map(([name]) => (
                  <Dropdown.Item
                    key={name}
                    onClick={() => handleRouter(name)}
                  >
                    {name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Form.Group>
          }

          {tokenType === 1 && (
            <LiquidityGeneratorTokenForm
              yieldGenerateFee={yieldGenerateFee} handleYieldGenerateFee={handleYieldGenerateFee} yieldGenerateFeeError={yieldGenerateFeeError}
              liquidityGenerateFee={liquidityGenerateFee} handleLiquidityGenerateFee={handleLiquidityGenerateFee} liquidityGenerateFeeError={liquidityGenerateFeeError}
              marketingAddress={marketingAddress} handleMarketingAddress={handleMarketingAddress} marketingAddressError={marketingAddressError}
              marketingPercent={marketingPercent} handleMarketingPercent={handleMarketingPercent} marketingPercentError={marketingPercentError}
            />
          )}

          {tokenType === 2 && (
            <BabyTokenForm
              rewardToken={rewardToken} handleRewardToken={handleRewardToken} rewardTokenError={rewardTokenError}
              minimumTokenBalance={minimumTokenBalance} handleMinimumTokenBalance={handleMinimumTokenBalance} minimumTokenBalanceError={minimumTokenBalanceError}
              tokenRewardFee={tokenRewardFee} handleTokenRewardFee={handleTokenRewardFee} tokenRewardFeeError={tokenRewardFeeError} liquidityPercent={liquidityPercent} handleLiquidityPercent={handleLiquidityPercent} liquidityPercentError={liquidityPercentError}
              marketingFee={marketingFee} handleMarketingFee={handleMarketingFee} marketingFeeError={marketingFeeError}
              marketingAddress={marketingAddress} handleMarketingAddress={handleMarketingAddress} marketingAddressError={marketingAddressError}
            />
          )}

          {tokenType === 3 && (
            <BuybackBabyTokenForm
              liquidityPercent={liquidityPercent} handleLiquidityPercent={handleLiquidityPercent} liquidityPercentError={liquidityPercentError} reflectionFee={reflectionFee} handleReflectionFee={handleReflectionFee} reflectionFeeError={reflectionFeeError} rewardToken={rewardToken} handleRewardToken={handleRewardToken} rewardTokenError={rewardTokenError} marketingFee={marketingFee} handleMarketingFee={handleMarketingFee} marketingFeeError={marketingFeeError} buybackFee={buybackFee} handleBuybackFee={handleBuybackFee} buybackFeeError={buybackFeeError}
            />
          )}
          {tokenType === 4 && (
            <PipitokenForm
              marketingAddress={marketingAddress} handleMarketingAddress={handleMarketingAddress} marketingAddressError={marketingAddressError}
              charityFee={charityFee} handleCharityFee={handleCharityFee} charityFeeError={charityFeeError}
              charityAddress={charityAddress} handleCharityAddress={handleCharityAddress} charityAddressError={charityAddressError}
              devloperAddress={devloperAddress} handleDevloperAddress={handleDevloperAddress} devloperAddressError={devloperAddressError}
              marketingPercent={marketingPercent} handleMarketingPercent={handleMarketingPercent} marketingPercentError={marketingPercentError}
              devloperPercent={devloperPercent} handleDevloperPercent={handleDevloperPercent} devloperPercentError={devloperPercentError}
              liquidityPercent={liquidityPercent} handleLiquidityPercent={handleLiquidityPercent} liquidityPercentError={liquidityPercentError}
              sellDevloperPercent={sellDevloperPercent} handleSellDevloperPercent={handleSellDevloperPercent} sellDevloperPercentError={sellDevloperPercentError} sellCharityFee={sellCharityFee} handleSellCharityFee={handleSellCharityFee} sellCharityFeeError={sellCharityFeeError} sellMarketingPercent={sellMarketingPercent} handleSellMarketingPercent={handleSellMarketingPercent} sellMarketingPercentError={sellMarketingPercentError} sellLiquidityPercent={sellLiquidityPercent} handleSellLiquidityPercent={handleSellLiquidityPercent} sellLiquidityPercentError={sellLiquidityPercentError}
            />
          )}
          <br />
          <FormButton
            onClick={handleCreateToken}
            disabled={(tokenNameError ||
              tokenSymbolError ||
              tokenDecimalError ||
              tokenTotalSupplyError ||
              routerError ||
              yieldGenerateFeeError ||
              liquidityGenerateFeeError ||
              marketingAddressError ||
              marketingPercentError ||
              rewardTokenError ||
              minimumTokenBalanceError ||
              marketingFeeError ||
              tokenRewardFeeError ||
              liquidityPercentError ||
              reflectionFeeError ||
              buybackFeeError ||
              charityFeeError ||
              sellDevloperPercentError ||
              sellCharityFeeError ||
              sellMarketingPercentError ||
              sellLiquidityPercentError ||
              charityAddressError ||
              devloperAddressError ||
              devloperPercentError ||
              !enableSubmit
            )}
            buttonName={"Create Token"}
          />
        </Form>

        {(tokenCreationHash && !isPending) && <div>Token Creation Hash: <Link to={`${chain.blockExplorers.default.url}/tx/${tokenCreationHash}`} target="_blank" rel="noopener noreferrer">{tokenCreationHash}</Link></div>}
      </Card.Body>
    </Card>
  );
};

export default TokenCreate;