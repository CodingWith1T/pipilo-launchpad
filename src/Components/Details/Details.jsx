import React from 'react'
import { Link } from 'react-router-dom'
import { formatUnits } from 'viem'
import { DEAD_ADDRESS, routers } from '../../constants/constants'

const Details = ({ name, symbol, decimals, launchpadId, details = {}, selectedChain, address }) => {
    const getRouter = (value) => {
        const router = routers[selectedChain.id] || [];
        return Object.keys(router).find(key => router[key].toLowerCase() === value.toLowerCase())
    }

    function capitalize(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
    };

    return (
        <ul className="detailslist dtlst">

            <li><strong>Presale Type:</strong> <span>{details.liquidity == 0 ? 'Public' : capitalize(details.presaleType?.toString())}</span></li>

            <li><strong>Token address:</strong> <span ><Link to={`${selectedChain.blockExplorers.default.url}/address/${details.token?.toString()}`} target="_blank" rel="noopener noreferrer">{details.token?.toString()}</Link></span></li>

            {name && <li><strong>Name</strong> <span >{name}</span></li>}
            {symbol && <li><strong>Symbol</strong> <span >{symbol}</span></li>}
            {decimals && <li><strong>Decimals</strong> <span >{decimals}</span></li>}

            {launchpadId && <li><strong>Pool Address:</strong> <span><strong>
                <Link to={`${selectedChain.blockExplorers.default.url}/address/${launchpadId}`} target="_blank" rel="noopener noreferrer">{launchpadId}</Link></strong></span>  </li>
            }

            {details.total && decimals && symbol && details.presaleType == 'standard' && <li>
                <strong>Tokens For Presale:</strong><span>{(details.hardCap * details.rate / 10 ** (selectedChain.nativeCurrency.decimals + parseInt(decimals))).toLocaleString()} {symbol}</span></li>
            }

            {details.total && decimals && symbol && details.presaleType == 'fair' &&
                <li><strong>Tokens For Presale:</strong> <span>{formatUnits(BigInt(details.total.toString()), decimals)} {symbol}</span>  </li>
            }

            {details.liquidity == 0 && details.presaleType == 'standard' &&
                <li><strong>Tokens For Liquidity:</strong> <span>Manual Listing</span> </li>
            }

            {details.liquidity != 0 && decimals && details.presaleType == 'standard' && <li><strong>Tokens For Liquidity:</strong> <span>{(((details.hardCap * (1 - details.mainFee / 1000)) * details.liquidity / 1000) * details.listingRate / (10 ** (selectedChain.nativeCurrency.decimals + parseInt(decimals)))).toLocaleString()} {symbol}</span>  </li>}

            {details.liquidity != 0 && details.total && decimals && symbol && details.mainFee && details.liquidity && details.presaleType == 'fair' && <li><strong>Tokens For Liquidity:</strong> <span>{((1 - details.mainFee / 1000) * details.liquidity / 1000) * details.total / (10 ** (decimals))} {symbol}</span>  </li>}

            {details.softCap && decimals && <li className="liquidity"><strong>Soft Cap:</strong> <span><strong>{formatUnits(BigInt(details.softCap.toString()), decimals)} {selectedChain.nativeCurrency.symbol}</strong></span></li>}

            {details.hardCap && decimals && <li className="Locktime hardCap"><strong>Hard Cap:</strong> <span><strong>{formatUnits(BigInt(details.hardCap.toString()), decimals)} {selectedChain.nativeCurrency.symbol}</strong></span></li>}

            {details.presaleStartTimestamp && details.presaleStartTimestamp != 0 && decimals && <li><strong>Start time:</strong> <span>{new Date(details.presaleStartTimestamp * 1000).toLocaleString()}</span>  </li>}

            {details.presaleEndTimestamp && details.presaleEndTimestamp != 0 && decimals && <li><strong>End Time:</strong> <span>{new Date(details.presaleEndTimestamp * 1000).toLocaleString()}</span>  </li>}


            {details.minBuy && decimals &&
                <li>
                    <strong>Min Buy:</strong>
                    <span>{formatUnits(BigInt(details.minBuy.toString()), decimals)}  {selectedChain.nativeCurrency.symbol}</span>
                </li>
            }

            {details.maxBuy && parseInt(details.maxBuy) > 0 && decimals && (
                <li>
                    <strong>Max Buy:</strong>
                    <span>{formatUnits(BigInt(details.maxBuy.toString()), decimals)}  {selectedChain.nativeCurrency.symbol}</span>
                </li>
            )}

            {details.rate && decimals && <li><strong>Rate:</strong> <span>{formatUnits(details.rate?.toString(), decimals)} {symbol}</span> </li>}

            {/* {details.listingRate && decimals && <li><strong>Listing Rate:</strong> <span>{formatUnits(details.listingRate?.toString(), selectedChain.nativeCurrency.decimals)}</span>  </li>} */}

            {details.owner == address && <>
                {details.mainFee && decimals && <li><strong>Main Fee:</strong> <span>{details.mainFee / 10}%</span>  </li>}
                {details.tokenFee && decimals && <li><strong>Token Fee:</strong> <span>{details.tokenFee / 10}%</span>  </li>}
            </>}
            {details.liquidity && decimals && (
                <li>
                    <strong>Liquidity Percentage:</strong>{" "}
                    <span>
                        <strong>
                            {details.liquidity == 0 ? 'Manual Listing' : `${(details.liquidity / 10).toFixed(2)}%`}
                        </strong>
                    </span>
                </li>
            )}
            {details.tokenBackAddress && decimals && <li><strong>Unsold tokens :</strong> <span>{details.tokenBackAddress ? `🔥Burn` : `Refund`}</span>  </li>}
            {details.whiteListEnableTime && details.whiteListEnableTime != 0 && decimals && <li><strong>Whitelist Enable Time:</strong> <span>{new Date(details.whiteListEnableTime * 1000).toLocaleString()}</span>  </li>}
            {details.refundable && decimals && <li><strong>refundable:</strong> <span>{details.refundable?.toString().toUpperCase()}</span>  </li>}
            {details.investors && <li><strong>number of investors:</strong> <span>{details.investors?.toString()}</span>  </li>}
            {details.website.toString() && (
                <li>
                    <strong>Website:</strong>
                    <span>
                        <Link
                            to={
                                details.website.toString().startsWith('http://') || details.website.toString().startsWith('https://')
                                    ? details.website.toString()
                                    : `https://${details.website.toString()}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {details.website.toString()}
                        </Link>
                    </span>
                </li>
            )}
            {details.router != DEAD_ADDRESS && <li><strong>Listing on:</strong> <span><Link to={`${selectedChain.blockExplorers.default.url}/address/${details.router}`} target="_blank" rel="noopener noreferrer">{getRouter(details.router)}</Link> </span></li>}
            {details.router != DEAD_ADDRESS && <li><strong>Liquidity Lockup Time:</strong> <span>{details.lockPeriod / 86400} days after pool ends</span></li>}
        </ul>
    )
}

export default Details
