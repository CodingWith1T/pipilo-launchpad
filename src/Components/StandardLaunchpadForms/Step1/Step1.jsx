import React, { useState, useEffect } from 'react';
import { Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { useAccount } from 'wagmi';
import Input from '../../Input/Input';
import FormButton from '../../FormButton/FormButton';
import { VerifyToken } from '../../VerifyToken/VerifyToken';

const Step1 = ({ description, setDescription, setStep }) => {
    // console.log({ description })
    const { chain } = useAccount();
    const [tokenAddress, setTokenAddress] = useState(description.tokenAddress || '');
    const [mainFee, setMainFee] = useState('50')
    const [tokenFee, setTokenFee] = useState('0')
    const [currency, setCurrency] = useState(description.currency || chain?.nativeCurrency?.symbol || '');

    useEffect(() => {
        if (chain?.nativeCurrency?.symbol) {
            setCurrency(chain.nativeCurrency.symbol || '');
        }
    }, [chain]);

    // console.log({ currency })
    const [listingOption, setListingOption] = useState(typeof description.listingOption== 'undefined' ? true:description.listingOption);
    const [name, setName] = useState(null);
    const [symbol, setSymbol] = useState(null);
    const [totalSupply, setTotalSupply] = useState(null);
    const [decimals, setDecimals] = useState(null);
    const [error, setError] = useState('');

    const handleFeeOptionChange = (mainFee, tokenFee) => {
        setMainFee(mainFee);
        setTokenFee(tokenFee);
    };

    useEffect(() => {
        VerifyToken(tokenAddress, setName, setSymbol, setDecimals, setTotalSupply, setError);
    }, [tokenAddress.trim(), chain]);

    const handleNext = () => {
        setDescription((prevDescription) => ({
            ...prevDescription,
            tokenAddress: tokenAddress.trim(),
            tokenName: name,
            decimals,
            mainFee,
            tokenFee,
            currency,
            listingOption,
            choosenChain: chain?.nativeCurrency.name
        }));
        setStep((prevStep) => prevStep + 1);
    };


    return (
        <>{/*neeed to be edited*/}
            <Input
                label={"Token Address*"}
                type={"text"}
                placeholder={"Input token address"}
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                note={(name && symbol && totalSupply) ? (
                    `Name: ${name} Symbol: ${symbol} Decimals: ${decimals.toString()} Total Supply: ${totalSupply.toString()}`
                ) : (
                    "Enter the token address and verify"
                )}
                error={error}
            />

            <Form.Group className="mb-3" controlId="formCurrency">
                <Form.Label>Currency</Form.Label>
                <DropdownButton id="dropdown-currency" title={currency || "Select a currency"}>
                    <Dropdown.Item onClick={() => setCurrency(chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto')}>
                        {chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'Native Currency'}
                    </Dropdown.Item>
                </DropdownButton>
                <Form.Text>Users will pay with {currency} for your token</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formFeeOptions">
                <Form.Label>Fee Options</Form.Label>
                <Form.Check
                    type="radio"
                    id="feeOption1"
                    name="feeOptions"
                    label={`5% ${chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto'} raised only`}
                    defaultChecked // This will set this radio button as checked by default
                    onChange={() => handleFeeOptionChange('50', '0')}
                />
                <Form.Check
                    type="radio"
                    id="feeOption2"
                    name="feeOptions"
                    label={`2% ${chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto'} raised + 2% token sold`}
                    onChange={() => handleFeeOptionChange('20', '20')}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formListingOptions">
                <Form.Label>Listing Options</Form.Label>
                <Form.Check
                    type="radio"
                    id="listingOptionAuto"
                    name="listingOption"
                    label="Auto Listing"
                    checked={listingOption === true} // Bind the checked state to listingOption
                    onChange={() => setListingOption(true)}
                />
                <Form.Check
                    type="radio"
                    id="listingOptionManual"
                    name="listingOption"
                    label="Manual Listing"
                    checked={listingOption === false} // Bind the checked state to listingOption
                    onChange={() => setListingOption(false)}
                />
                {listingOption ?
                    <Form.Text className="text-muted">
                        For auto listing, after you finalize the pool your token will be auto listed on DEX.
                    </Form.Text>
                    :
                    <Form.Text className="text-muted">
                        For manual listing, We won't charge tokens for liquidity. You may withdraw BNB after the pool ends then do DEX listing yourself.
                    </Form.Text>
                }
            </Form.Group>

            <FormButton
                onClick={handleNext}
                disabled={!(name && symbol && totalSupply && currency != '')}
                buttonName={"Next"}
            />

        </>
    );
};

export default Step1;
