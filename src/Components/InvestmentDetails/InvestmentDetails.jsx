import React from 'react';
import { Card } from 'react-bootstrap';
import { formatEther, formatUnits } from 'viem';

const InvestmentDetails = ({
    progress,
    address,
    symbol,
    decimals,
    selectedChain,
    details
}) => {
    // Format percentage safely
    const investmentPercentage = details.totalDepositedBalance > 0
        ? ((details.deposits / details.totalDepositedBalance) * 100).toFixed(2)
        : 0;

    // Format claimed tokens
    const availableToClaim = details.getVestedAmount - details.claimed;
    const totalTokensReceivable = details.presaleType == 'fair'
        ? (details.deposits/details.totalDepositedBalance * formatUnits(details.total, decimals)).toFixed(2)
        : (details.deposits/details.totalDepositedBalance * details.hardCap * details.rate / 10**(selectedChain.nativeCurrency.decimals + parseInt(decimals))).toFixed(2);
 
        // Handle cases with no deposits
    const hasInvestments = details.deposits > 0;

    if (!progress < 100) 
    {
        return (
            <Card.Body className="rightbox">
                <h6>Investment Details for Address: {address}</h6>

                {hasInvestments ? (
                    <ul>
                        <li>
                            <strong>Amount Invested:</strong> {formatEther(details.deposits)} {selectedChain.nativeCurrency.symbol}
                        </li>
                        <li>
                            <strong>Percentage of Investment on this project:</strong> {investmentPercentage} %
                        </li>
                        {!details.claimable &&
                            <><li>
                                <strong>Approximate Tokens Receivable:</strong> {totalTokensReceivable} {symbol}
                            </li>
                                <small style={{ color: 'red' }}>
                                    Note:- Will be received only if the presale finalizes, and actual value could differ.
                                </small>
                            </>}
                        <li>
                            <strong>Total Tokens Claimable:</strong> {formatUnits(details.getVestedAmount, decimals)} {symbol}
                        </li>
                        {details.claimable && <>
                            <li>
                                <strong>Tokens Claimed:</strong> {formatUnits(details.claimed, decimals)} {symbol}
                            </li>
                            <li>
                                <strong>Tokens Available to Claim:</strong> {formatUnits(availableToClaim, decimals)} {symbol}
                            </li>
                        </>}
                    </ul>
                ) : (
                    <p>No investments have been made by the currently connected wallet.</p>
                )}
            </Card.Body>
        );
    }
};

export default InvestmentDetails;
