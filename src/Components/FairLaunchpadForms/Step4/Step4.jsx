import React, { useState } from 'react';
import { parseEther } from 'viem';
import { Card } from 'react-bootstrap';
import "./Step4.css";
import { useAccount, useConnect, useReadContracts, useWriteContract } from 'wagmi';
import managerAbi from '../../../constants/abi/manager.json'
import erc20Abi from '../../../constants/abi/erc20.json'
import { DEAD_ADDRESS, fees, manager, routers, ZERO_ADDRESS } from '../../../constants/constants';
import BigNumber from 'bignumber.js';
import FormButton from '../../FormButton/FormButton';
import { Link } from 'react-router-dom';
import { waitForTransactionReceipt } from '@wagmi/core'
import { wagmiconfig } from '../../../wagmiconfig/wagmiconfig';

const Step4 = ({ description, setStep }) => {

    const { isConnected, chain, address } = useAccount();

    const { connectAsync } = useConnect()
    const { writeContractAsync, isPending, isSuccess } = useWriteContract();
    // console.log(useWriteContract())
    // console.log({ isPending })

    //button settings
    const [enableApprove, setEnableApprove] = useState(false)
    const [enableSubmit, setEnableSubmit] = useState(true)
    const [complete, setComplete] = useState(false)

    // Transaction Completion
    const [approvalHash, setApprovalHash] = useState(null)
    const [launchHash, setLaunchHash] = useState(null)

    // console.log({approvalHash, launchHash})

    const tokenContract = {
        address: description.tokenAddress,
        abi: erc20Abi,
    }

    const result = useReadContracts({
        contracts: [
            {
                ...tokenContract,
                functionName: 'allowance',
                args: [description.choosenAccount, manager[chain?.id]],
            }
        ],
    })
    // console.log({ "approval": parseInt(result?.data) })

    const handlePrevious = () => {
        setStep((prevStep) => prevStep - 1);
    }

    // console.log({ description })

    const handleApprove = async () => {
        try {
            // console.log("first")

            if (!address) {
                await connectAsync()
            }
            const args = [
                manager[chain?.id],
                new BigNumber(description.sellingAmount).times(10 ** description.decimals).toFixed()
            ];

            // console.log({ args })

            const data = await writeContractAsync({
                ...tokenContract,
                functionName: 'approve',
                args,
            });
            setApprovalHash('Loading...');
            const receipt = await waitForTransactionReceipt(wagmiconfig, {
                hash: data,
            })
            setApprovalHash(receipt.transactionHash);
            setLaunchHash(null);
            setEnableApprove(true);
            setEnableSubmit(false);
        }
        catch (error) {
            setApprovalHash('Error occurred. Try again.'); // Set error message
            setEnableApprove(false);
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

    const handleSubmit = async () => {
        try {
            if (!address) {
                await connectAsync()
            }
            const args = [
                [
                    new BigNumber(Date.parse(description.startTime)).div(1000).toFixed(),
                    new BigNumber(Date.parse(description.endTime)).div(1000).toFixed(),
                    new BigNumber(description.softCap).times(10 ** description.decimals).toFixed(),
                    new BigNumber(description.totalSellingAmount).times(10 ** description.decimals).toFixed(),
                    new BigNumber(Number(description.liquidity)).times(10).toFixed(),
                    new BigNumber(Number(description.liquidityLockupDays)).times(24 * 3600).toFixed(),
                    new BigNumber(description.mainFee).toFixed(),
                    new BigNumber(description.tokenFee).toFixed(),
                    new BigNumber(description.isMaxContribution ? description.maxBuy : 0).times(10 ** description.decimals).toFixed()
                ],
                [
                    description.tokenAddress,
                    description.currency == chain.nativeCurrency.symbol ? ZERO_ADDRESS : tokenData.currency.wrapped.address,
                    routers[chain.id][description.router] ?? DEAD_ADDRESS,
                ],
                [
                    description.tokenDescription,
                    description.logoUrl,
                    description.website,
                    description.facebook,
                    description.twitter,
                    description.github,
                    description.telegram,
                    description.instagram,
                    description.discord,
                    description.reddit,
                    description.youtube,
                    description.whitelistLink
                ],
                [
                    description.mainFee === "50",
                    description.whitelist,
                ]
            ]
            // console.log({ args })

            const data = await writeContractAsync({
                abi: managerAbi,
                address: manager[chain?.id],
                chainID: parseInt(chain.id, 10),
                functionName: 'createNewFairLaunch',
                value: parseEther(fees[chain.id]['fairLaunch']),
                args,
            })
            // console.log({ data })
            setLaunchHash(data);
            setComplete(true);
            // console.log("last");
        }
        catch (error) {
            setLaunchHash(null);
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

    if (!isConnected || chain?.nativeCurrency.name !== description.choosenChain || address !== description.choosenAccount) {
        return <div>
            <center className="text-danger">
                <div className="spinner-border text-danger" role="status">
                    <span className="sr-only"></span>
                </div><br />
                You chose {description.choosenChain} and {description.choosenAccount} chain in Step 1. The verification of token was done for the same.<br />
                Either switch to {description.choosenChain} and {description.choosenAccount} or reload to start again!!!!
            </center>
        </div>;
    }
    return (
        <Card className="Step4">
            <Card.Body>
                <Card.Title>Please verify the details entered:- </Card.Title>
                <ul>
                    {Object.entries(description)
                        .filter(([key, value]) => value && value.toString().trim() !== '')
                        .map(([key, value]) => {
                            const formatKey = (key) => {
                                return key
                                    .replace(/([A-Z])/g, ' $1') // Insert a space before uppercase letters
                                    .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
                                    .trim(); // Remove any leading/trailing spaces
                            };
                            const formatValue = (value) => {
                                if (typeof value === 'boolean') {
                                    return value.toString().charAt(0).toUpperCase() + value.toString().slice(1); // Capitalize first letter of boolean
                                }
                                return value.toString(); // Convert other types to string
                            };

                            if (key === 'startTime' || key === 'endTime') {
                                const formattedTime = new Date(value).toLocaleString('en-US', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                                return (
                                    <li key={key}><strong>{formatKey(key)}:</strong> {formattedTime}</li>
                                );
                            }
                            if (key === 'mainFee' || key === 'tokenFee') {

                                return (
                                    <li key={key}><strong>{formatKey(key)}:</strong> {value/10}%</li>
                                );
                            }
                            return (
                                <li key={key}><strong>{formatKey(key)}:</strong> {formatValue(value)}</li>
                            );
                        })}
                </ul>
                {complete ? (
                    <FormButton
                        href={`/launchpads/launchpad-list/${chain.id}`}
                        disabled={!complete}
                        buttonName={"Go to Listing Page"}
                    />
                ) : (
                    <>
                        <FormButton
                            onClick={handlePrevious}
                            disabled={!enableSubmit}
                            buttonName={"Previous"}
                        />
                        <FormButton
                            onClick={handleApprove}
                            disabled={enableApprove || isPending}
                            buttonName={"Approve"}
                        />
                        <FormButton
                            onClick={handleSubmit}
                            disabled={enableSubmit || isPending}
                            buttonName={"Submit"}
                        />
                    </>
                )}
            </Card.Body>
            {approvalHash && !isPending && (
                <div>
                    Approval Transaction Hash:{" "}
                    {approvalHash.startsWith("0x") ? (
                        <Link to={`${chain.blockExplorers.default.url}/tx/${approvalHash}`} target="_blank" rel="noopener noreferrer">
                            {approvalHash}
                        </Link>
                    ) : (
                        approvalHash
                    )}
                </div>
            )}
            {launchHash && !isPending && (
                <div>
                    Launch Transaction Hash:{" "}
                    {launchHash.startsWith("0x") ? (
                        <Link to={`${chain.blockExplorers.default.url}/tx/${launchHash}`} target="_blank" rel="noopener noreferrer">
                            {launchHash}
                        </Link>
                    ) : (
                        launchHash
                    )}
                </div>
            )}
        </Card>
    );
};

export default Step4;