import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { multicall } from '@wagmi/core';
import launchpadAbi from '../../constants/abi/launchpad.json';
import { wagmiconfig } from '../../wagmiconfig/wagmiconfig';
import { Button, Card } from 'react-bootstrap';
import "./LaunchpadDetails.css";
import { FaDiscord, FaFacebook, FaGithub, FaInstagram, FaYoutube } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';
import { YoutubeFrame } from "../../Components/YoutubeFrame/YoutubeFrame";
import FormButton from "../../Components/FormButton/FormButton";
import { useAccount, useConnect, useSwitchChain, useWriteContract } from "wagmi";
import erc20Abi from '../../constants/abi/erc20.json'
import WhitelistedAddress from "../../Components/WhitelistedAddress/WhitelistedAddress";
import WhiteListAddress from "../../Components/WhiteListAddress/WhiteListAddress";
import DepositAmount from "../../Components/DepositAmount/DepositAmount";
import Details from "../../Components/Details/Details";
import InvestmentDetails from "../../Components/InvestmentDetails/InvestmentDetails";
const LaunchpadDetails = () => {
    const { chain, address } = useAccount();
    const { connectAsync } = useConnect();
    const { writeContractAsync, isPending } = useWriteContract();
    const { chains, switchChain } = useSwitchChain()

    const { type, launchpadId, chainId: chainIdStr } = useParams();
    const chainId = parseInt(chainIdStr, 10);
    const selectedChain = wagmiconfig.chains.find(c => c.id === chainId)
    // console.log({ type, launchpadId, chainId })
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [name, setName] = useState(null);
    const [symbol, setSymbol] = useState(null);
    const [decimals, setDecimals] = useState(null);

    const [claimHash, setClaimHash] = useState(false)
    const [withdrawHash, setWithdrawHash] = useState(false)
    const [cancelHash, setCancelHash] = useState(false)
    const [emergencyWithdrawHash, setEmergencyWithdrawHash] = useState(false)
    const [finalizeHash, setFinalizeHash] = useState(false)

    const getRemainingTime = (timestamp) => {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const targetTimestamp = Number(timestamp);
        const totalSeconds = targetTimestamp - currentTimestamp;

        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = totalSeconds % 60;

        if (isNaN(totalSeconds) || totalSeconds < 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                totalSeconds: 0,
            };
        }

        return {
            days,
            hours,
            minutes,
            seconds,
            totalSeconds,
        };
    }

    const getInitialRemainingStartTime = () => {
        return getRemainingTime(details?.presaleStartTimestamp);
    }

    const getInitialRemainingEndTime = () => {
        return getRemainingTime(details?.presaleEndTimestamp);
    }

    const [remainingStartTime, setRemainingStartTime] = useState(getInitialRemainingStartTime());
    const [remainingEndTime, setRemainingEndTime] = useState(getInitialRemainingEndTime());

    const standardFunctions = ['presaleType', 'token', 'buyToken', 'presaleStartTimestamp', 'presaleEndTimestamp', 'softCap', 'hardCap', 'minBuy', 'maxBuy', 'total', 'rate', 'listingRate', 'lockPeriod', 'mainFee', 'tokenFee', 'liquidity', 'router', 'locker', 'feeAddress', 'tokenBackAddress', 'whiteListEnableTime', 'totalDepositedBalance', 'totalClaimedAmount', 'investors', 'refundable', 'claimable', 'initialized', 'info', 'logoUrl', 'website', 'twitter', 'facebook', 'github', 'telegram', 'instagram', 'discord', 'reddit', 'youtube', 'whitelist', 'getWhiteListLength', 'isLive', 'owner'];

    // console.log({"standardFunctions.length":standardFunctions.length})

    const fairFunctions = ['presaleType', 'token', 'buyToken', 'presaleStartTimestamp', 'presaleEndTimestamp', 'softCap', 'maxBuy', 'total', 'rate', 'listingRate', 'lockPeriod', 'mainFee', 'tokenFee', 'liquidity', 'router', 'locker', 'feeAddress', 'whiteListEnableTime', 'totalDepositedBalance', 'totalClaimedAmount', 'investors', 'refundable', 'claimable', 'initialized', 'info', 'logoUrl', 'website', 'twitter', 'facebook', 'github', 'telegram', 'instagram', 'discord', 'reddit', 'youtube', 'whitelist', 'getWhiteListLength', 'isLive', 'owner'];
    // console.log({"fairFunctions.length":fairFunctions.length})

    const launchpadContract = {
        address: launchpadId,
        abi: launchpadAbi
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // console.log(address)
                const functionsToCall = address
                    ? (type === 'standard' ? [...standardFunctions, 'whiteList', 'deposits', 'claimed', 'getVestedAmount'] : [...fairFunctions, 'whiteList', 'deposits', 'claimed', 'getVestedAmount'])
                    : (type === 'standard' ? standardFunctions : fairFunctions);
                // console.log({functionsToCall})

                const results = await multicall(wagmiconfig, {
                    contracts: functionsToCall.map((functionName) => {
                        return {
                            ...launchpadContract,
                            functionName,
                            ...(address && (functionName == 'whiteList' || functionName == 'deposits' || functionName == 'claimed' || functionName == 'getVestedAmount') && { args: [address] })
                        };
                    }),
                    chainId
                });
                // console.log({results})
                const finalResult = functionsToCall.reduce((acc, key, index) => {
                    if (index < results.length) {
                        const value = results[index].result;
                        acc[key] = results[index].status != 'failure' ? typeof value === 'boolean' ? value : value.toString() : false;
                    }
                    return acc;
                }, {});
                // console.log({ finalResult })
                const tokenContract = {
                    address: finalResult.token,
                    abi: erc20Abi,
                }
                const tokenDetails = await multicall(wagmiconfig, {
                    contracts: [
                        { ...tokenContract, functionName: 'name' },
                        { ...tokenContract, functionName: 'symbol' },
                        { ...tokenContract, functionName: 'decimals' },
                    ],
                    chainId
                })
                setName(tokenDetails[0]?.result?.toString());
                setSymbol(tokenDetails[1]?.result?.toString());
                setDecimals(tokenDetails[2]?.result?.toString())
                setDetails(finalResult);
            } catch (err) {
                // console.log(err)
                setError(err.message);
            }
        };

        fetchData();
    }, [type, launchpadId, address]);

    useEffect(() => {
        const startInterval = setInterval(() => {
            const newRemainingStartTime = getRemainingTime(details?.presaleStartTimestamp);
            if (newRemainingStartTime.totalSeconds <= 0) {
                clearInterval(startInterval);
                setRemainingStartTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setRemainingStartTime(newRemainingStartTime);
            }
        }, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(startInterval);
    }, [details?.presaleStartTimestamp]);

    useEffect(() => {
        const endInterval = setInterval(() => {
            const newRemainingEndTime = getRemainingTime(details?.presaleEndTimestamp);
            if (newRemainingEndTime.totalSeconds <= 0) {

                clearInterval(endInterval);
                setRemainingEndTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setRemainingEndTime(newRemainingEndTime);
            }
        }, 1000);

        // Clean up interval on component unmount
        return () => clearInterval(endInterval);
    }, [details?.presaleEndTimestamp]);

    const handleClaim = async () => {
        try {
            // console.log("first")
            // console.log({"chainId":chain.id})
            if (!address) {
                await connectAsync()
            }

            const data = await writeContractAsync({
                ...launchpadContract,
                chainID: parseInt(chain.id, 10),
                functionName: 'claim',
            })
            setClaimHash(data);
        }
        catch (error) {
            setClaimHash(null);
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

    const handleWithdraw = async () => {
        try {
            // console.log("first")
            // console.log({"chainId":chain.id})
            if (!address) {
                await connectAsync()
            }

            const data = await writeContractAsync({
                ...launchpadContract,
                chainID: parseInt(chain.id, 10),
                functionName: 'withdrawContribute',
            })
            setWithdrawHash(data);
        }
        catch (error) {
            setWithdrawHash(null);
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

    const handleCancel = async () => {
        try {
            // console.log("first")
            // console.log({"chainId":chain.id})
            const confirmation = window.confirm("Are you sure you want to proceed with the cancellation?");

            if (!confirmation) {
                return;
            }

            if (!address) {
                await connectAsync()
            }

            const data = await writeContractAsync({
                ...launchpadContract,
                chainID: parseInt(chain.id, 10),
                functionName: 'cancel',
            })
            setCancelHash(data);
        }
        catch (error) {
            setCancelHash(null);
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

    const handleEmergencyWithdraw = async () => {
        try {
            // console.log("first")
            // console.log({"chainId":chain.id})

            if (!address) {
                await connectAsync()
            }

            const data = await writeContractAsync({
                ...launchpadContract,
                chainID: parseInt(chain.id, 10),
                functionName: 'emergencyWithdraw',
            })
            setEmergencyWithdrawHash(data);
        }
        catch (error) {
            setEmergencyWithdrawHash(null);
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

    const handlesFinalize = async () => {
        try {
            // console.log("first")
            // console.log({"chainId":chain.id})
            const confirmation = window.confirm("Are you sure you want to proceed with the finalization?");

            if (!confirmation) {
                return;
            }

            if (!address) {
                await connectAsync()
            }

            const data = await writeContractAsync({
                ...launchpadContract,
                chainID: parseInt(chain.id, 10),
                functionName: 'finalize',
            })
            setFinalizeHash(data);
        }
        catch (error) {
            setFinalizeHash(null);
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


    if (error) {
        return (
            <div>
                <center className="text-danger">
                    <div className="spinner-border text-danger" role="status">
                        <span className="sr-only"></span>
                    </div>
                    <br />
                    {error && `Error: ${error}`}
                </center>
            </div>
        );
    }

    if (!details) {
        return (
            <div>
                <center className="text-danger">
                    <div className="spinner-border text-danger" role="status">
                        <span className="sr-only"></span>
                    </div>
                    <br />
                </center>
                {error && `Error: ${error}`}
            </div>
        );
    }

    return (
        <div className="container deatilspage">
            <Card className="Step4 Launchpadpage dtls">
                <Card.Body className="leftbox">
                    {details?.presaleEndTimestamp > Math.floor(Date.now() / 1000) && <div className="livedtl">⚫ Live</div>}
                    <div className="dtllogobox">
                        <Card.Img variant="top" src={details.logoUrl} alt="Launchpad Logo" />
                    </div>
                    <Card.Title>Launchpad Details</Card.Title>
                    <div>
                        {(details.instagram || details.facebook || details.twitter || details.facebook || details.youtube) &&
                            <Card className="socialicon listsocial lstdtl">
                                {details.discord &&
                                    <Link to={details.discord} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                        <FaDiscord />
                                    </Link>
                                }
                                {details.facebook &&
                                    <Link to={details.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                        <FaFacebook />
                                    </Link>
                                }
                                {details.github &&
                                    <Link to={details.github} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                        <FaGithub />
                                    </Link>
                                }
                                {details.instagram &&
                                    <Link to={details.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                        <FaInstagram />
                                    </Link>
                                }
                                {details.twitter &&
                                    <Link to={details.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                        <BsTwitterX />
                                    </Link>
                                }
                                {details.youtube &&
                                    <Link to={details.youtube} target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                                        <FaYoutube />
                                    </Link>
                                }
                            </Card>
                        }

                    </div>
                    <div className="about"><strong>About Us </strong></div>
                    <div className="aboutcontent">
                        {details.info ? (
                            <span>{details.info.toString()}</span>
                        ) : (
                            <p>No additional information available.</p>
                        )}
                    </div>

                    {details.youtube && <div><YoutubeFrame videoUrl={details.youtube} /> </div>}

                    <Details name={name} symbol={symbol} decimals={decimals} launchpadId={launchpadId} details={details} selectedChain={selectedChain} address={address} />

                    <Button variant="secondary" href={`/launchpads/launchpad-list/${chainId}`}>
                        Back
                    </Button>

                    {chain?.id == chainId ? (
                        <>
                            {address === details.owner && !details.claimable && !details.refundable && (
                                <Button className="dangerbtn" variant="danger" onClick={handleCancel}>
                                    Cancel Presale
                                </Button>
                            )}

                            {address && details.deposits <= 0 && parseInt(details?.presaleEndTimestamp) - (15 * 60) >= Math.floor(Date.now() / 1000) && (
                                <Button variant="danger" onClick={handleEmergencyWithdraw}>
                                    Make Emergency Withdrawal
                                </Button>
                            )}

                            {address === details.owner && !details.claimable && (!details.refundable && (Math.floor(Date.now() / 1000) >= details?.presaleEndTimestamp || details.totalDepositedBalance >= details.softCap)) && (
                                <Button variant="primary" onClick={handlesFinalize}>
                                    Finalize Presale
                                </Button>
                            )}
                            {cancelHash && !isPending && (
                                <div>
                                    Cancelation Hash:
                                    <Link to={`${chain?.blockExplorers.default.url}/tx/${cancelHash}`} target="_blank" rel="noopener noreferrer">
                                        {cancelHash}
                                    </Link>
                                </div>
                            )}
                            {finalizeHash && !isPending && (
                                <div>
                                    Presale Finalization Hash:
                                    <Link to={`${chain?.blockExplorers.default.url}/tx/${finalizeHash}`} target="_blank" rel="noopener noreferrer">
                                        {finalizeHash}
                                    </Link>
                                </div>
                            )}
                            {emergencyWithdrawHash && !isPending && (
                                <div>
                                    Emergency Withdrawal Hash:
                                    <Link to={`${chain?.blockExplorers.default.url}/tx/${emergencyWithdrawHash}`} target="_blank" rel="noopener noreferrer">
                                        {emergencyWithdrawHash}
                                    </Link>
                                </div>
                            )}
                        </>
                    ) : (
                        address &&
                        <Button disabled={!address} key={selectedChain.id} onClick={() => switchChain({ chainId })}>
                            Switch to {selectedChain.name}
                        </Button>
                    )}
                </Card.Body>

                <Card.Body className="rightbox">
                    <div className="pipilol">
                        Make sure the website is <strong>Pipilol Launchpad</strong>
                    </div>

                    {details?.presaleStartTimestamp && (remainingStartTime.days + remainingStartTime.hours + remainingStartTime.minutes + remainingStartTime.seconds) > 0 &&
                        <>
                            <div className="boxright">
                                <Card.Title>Presale Starts In </Card.Title>
                                <div className="timing">
                                    <span>{remainingStartTime.days}</span>:<span>{remainingStartTime.hours}</span>:<span>{remainingStartTime.minutes}</span>:<span>{remainingStartTime.seconds}</span>
                                </div>
                            </div>
                        </>
                    }
                    {details?.presaleEndTimestamp < Math.floor(Date.now() / 1000) &&
                        <div className="boxright">
                            <Card.Title>Sale has ended! We appreciate your visit and support.</Card.Title>
                        </div>
                    }
                    {details.isLive ?
                        <>
                            <h5>Deposits (Overall)</h5>
                            <div className="progress">
                                <div className="bar" style={{
                                    width: `${((parseInt(details.totalDepositedBalance) /
                                        (details.presaleType === "standard"
                                            ? parseInt(details.hardCap)
                                            : parseInt(details.softCap))) *
                                        100
                                    ).toFixed(2)}%`
                                }}>
                                    <p className="percent">
                                        {((parseInt(details.totalDepositedBalance) /
                                            (details.presaleType === "standard"
                                                ? parseInt(details.hardCap)
                                                : parseInt(details.softCap))) *
                                            100
                                        ).toFixed(2)}
                                        %
                                    </p>
                                </div>
                            </div>

                            <div className="boxright">
                                <Card.Title>Presale Ends In </Card.Title>
                                <div className="timing">
                                    <span>{remainingEndTime.days}</span>
                                    :
                                    <span>{remainingEndTime.hours}</span>
                                    :
                                    <span>{remainingEndTime.minutes}</span>
                                    :
                                    <span>{remainingEndTime.seconds}</span>
                                </div>
                            </div>
                            {chain && chain.id == chainId ?
                                !details.claimable && <DepositAmount details={details} buyToken={details.buyToken.toString()} launchpadContract={launchpadContract} decimals={decimals} /> :
                                <>
                                    <center>
                                        <Button key={selectedChain.id} onClick={() => switchChain({ chainId: chainId })}>
                                            Switch to {selectedChain.name}
                                        </Button>
                                    </center>
                                </>
                            }
                            {details.refundable && <>
                                {parseInt(details.deposits) > 0 &&
                                    <><center>
                                        <Button variant="danger" disabled={!details.refundable} onClick={handleWithdraw} >
                                            Withdraw Contribution
                                        </Button>
                                    </center><br /></>
                                }
                                {(withdrawHash && !isPending) && <div>Withdraw Transaction Hash: <Link to={`${chain?.blockExplorers.default.url}/tx/${withdrawHash}`} target="_blank" rel="noopener noreferrer">{withdrawHash}</Link></div>}
                            </>}
                        </>
                        :
                        <>
                            {details.refundable &&
                                <>
                                    {parseInt(details.deposits) > 0 &&
                                        <><center>
                                            <Button variant="danger" disabled={!details.refundable} onClick={handleWithdraw} >
                                                Withdraw Contribution
                                            </Button>
                                        </center><br /></>
                                    }
                                    {(withdrawHash && !isPending) && <div>Withdraw Transaction Hash: <Link to={`${chain?.blockExplorers.default.url}/tx/${withdrawHash}`} target="_blank" rel="noopener noreferrer">{withdrawHash}</Link></div>}
                                </>
                            }
                        </>
                    }

                    {details.claimable && details.presaleEndTimestamp < Math.floor(Date.now() / 1000) && <>
                        <h5 className="influence">Claimed (Overall)</h5>
                        <div className="progress">
                            <div
                                className="bar2"
                                style={{
                                    width: `${parseInt(details.total) > 0
                                        ? (parseInt(details.totalClaimedAmount) / parseInt(details.totalClaimedAmount)).toFixed(2) * 100
                                        : 100
                                        }%`
                                }}
                            >
                                <p className="percent">
                                    {parseInt(details.total) > 0
                                        ? (parseInt(details.totalClaimedAmount) / parseInt(details.totalClaimedAmount)).toFixed(2) * 100
                                        : 100
                                    }%
                                </p>
                            </div>
                        </div>
                        {chain && details.getVestedAmount - details.claimed > 0 &&
                            <FormButton
                                onClick={handleClaim}
                                disabled={!details.claimable}
                                buttonName={"Claim"}
                            />
                        }
                        {(claimHash && !isPending) && <div>Claim Transaction Hash: <Link to={`${chain?.blockExplorers.default.url}/tx/${claimHash}`} target="_blank" rel="noopener noreferrer">{claimHash}</Link></div>}
                    </>}

                </Card.Body>
                {address &&
                    <InvestmentDetails progress={((details.totalDepositedBalance /
                        (details.presaleType === "standard"
                            ? details.hardCap
                            : details.softCap)) *
                        100
                    ).toFixed(2)} address={address} symbol={symbol} decimals={decimals} selectedChain={selectedChain} details={details} />
                }
                {details.getWhiteListLength > 0 &&
                    <WhitelistedAddress length={details.getWhiteListLength} launchpadContract={launchpadContract} chainId={chainId} />
                }
                {details.whiteListEnableTime != 0 && parseInt(details?.presaleEndTimestamp) >= Math.floor(Date.now() / 1000) &&
                    <WhiteListAddress chain={chain} launchpadContract={launchpadContract} />
                }
            </Card>
        </div>
    );
};

export default LaunchpadDetails;

