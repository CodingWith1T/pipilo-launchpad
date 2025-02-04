import React, { useState } from 'react'
import { formatUnits, parseUnits } from 'viem';
import { ZERO_ADDRESS } from '../../constants/constants';
import erc20Abi from '../../constants/abi/erc20.json'
import { useAccount, useConnect, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core'
import BigNumber from "bignumber.js";
import { Form } from 'react-bootstrap';
import Input from '../Input/Input';
import FormButton from '../FormButton/FormButton';
import { readContract } from "@wagmi/core";
import { Link } from 'react-router-dom';
import { wagmiconfig } from '../../wagmiconfig/wagmiconfig';
const DepositAmount = ({ details, launchpadContract, decimals }) => {

    const { connectAsync } = useConnect();
    const { chain, address } = useAccount();
    const { writeContractAsync, isPending } = useWriteContract();
    const [depositAmount, setDepositAmount] = useState(0.0);
    const [depositAmountError, setDepositAmountError] = useState('null');
    const [depostitHash, setDepostitHash] = useState(false);
    const minBuy = details.presaleType == 'standard' ? parseFloat(formatUnits(BigInt(details.minBuy.toString()), decimals)) : 0;
    const maxBuy = parseFloat(formatUnits(BigInt(details.maxBuy.toString()), decimals));
    const handleDepositAmount = (value) => {
        const numericValue = parseFloat(value);
        // console.log({numericValue})
        const deposits = parseFloat(formatUnits(BigInt(details.deposits.toString()), decimals));
        // console.log({ numericValue, minBuy, maxBuy, deposits });

        // Check for valid input
        if (isNaN(numericValue) || numericValue <= 0) {
            setDepositAmountError('Deposit must be a positive number!');
        } else if (numericValue < minBuy) {
            setDepositAmountError('Deposit must be greater than the Minimum Buy Value!');
        } else if (maxBuy > 0 && numericValue > (details.presaleType == 'standard' ? maxBuy : (maxBuy - deposits))) {
            setDepositAmountError('Deposit must be less than the Maximum Buy Value!');
        } else {
            setDepositAmountError(null); // No errors
        }

        // Update the deposit amount
        setDepositAmount(value);
    };
    const handleDeposit = async () => {
        if (details.buyToken == ZERO_ADDRESS) {

            // console.log("native");

            try {
                // console.log("first")
                // console.log({"chainId":chain.id})
                if (!address) {
                    await connectAsync()
                }

                const data = await writeContractAsync({
                    ...launchpadContract,
                    chainID: parseInt(chain.id, 10),
                    functionName: 'contributeETH',
                    value: parseUnits(depositAmount, decimals)
                })
                setDepostitHash(data);
            }
            catch (error) {
                setDepostitHash(null);
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
            console.log("non-native");

            try {
                // console.log("first")
                // console.log({"chainId":chain.id})
                if (!address) {
                    await connectAsync()
                }


                const approveData = await writeContractAsync({
                    abi: erc20Abi,
                    address: details.buyToken,
                    functionName: 'approve',
                    args: [launchpadId, new BigNumber(depositAmount).times(10 ** decimals).toFixed()],
                })

                const receipt = await waitForTransactionReceipt(wagmiconfig, {
                    hash: approveData,
                })

                // console.log(receipt.transactionHash)

                const depositData = await writeContractAsync({
                    ...launchpadContract,
                    chainID: parseInt(chain.id, 10),
                    functionName: 'contribute',
                    args: [parseUnits(depositAmount, decimals)]

                })

                setDepostitHash(depositData);
            }
            catch (error) {
                setDepostitHash(null);
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

    }
    return (
        <>
            <Form.Group className="mb-3 formdiv2">
                <Input
                    label={`Amount (${chain.nativeCurrency.symbol})*`}
                    type={"number"}
                    placeholder={"Enter Deposit amount"}
                    min={0}
                    value={depositAmount}
                    onChange={(e) => handleDepositAmount(e.target.value)}
                    error={depositAmountError != 'null' && <Form.Text className="text-danger">{depositAmountError}</Form.Text>}
                />
            </Form.Group>

            <FormButton
                onClick={handleDeposit}
                disabled={details?.presaleEndTimestamp < Math.floor(Date.now() / 1000)}
                buttonName={"Deposit"}
            />
            {(depostitHash && !isPending) && <div>Deposit Transaction Hash: <Link to={`${chain?.blockExplorers.default.url}/tx/${depostitHash}`} target="_blank" rel="noopener noreferrer">{depostitHash}</Link></div>}
        </>
    )
}

export default DepositAmount