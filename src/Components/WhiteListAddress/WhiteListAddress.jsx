import React, { useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Input from '../Input/Input';
import FormButton from '../FormButton/FormButton';
import { useAccount, useWriteContract } from 'wagmi';


const WhiteListAddress = ({ chain, launchpadContract }) => {
    const { address } = useAccount()
    const [whitelistAddress, setWhitelistAddress] = useState('');
    const [whitelistHash, setWhitelistHash] = useState(false)
    const [whitelistAddressError, setWhitelistAddressError] = useState('null');
    const { writeContractAsync, isPending } = useWriteContract();
    const handleWhitelistAddress = (value) => {
        if (value.length != 0 && value.length < 42) {
            setWhitelistAddressError('Invalid Marketing Address');
        } else {
            setWhitelistAddressError(null);
        }
        setWhitelistAddress(value);
    }

    const handleWhitelisting = async () => {
        try {
            // console.log("first")
            // console.log({"chainId":chain.id})
            if (!address) {
                await connectAsync()
            }

            const data = await writeContractAsync({
                ...launchpadContract,
                chainID: parseInt(chain.id, 10),
                args: [[whitelistAddress]],
                functionName: 'addWhiteList',
            })
            setWhitelistHash(data);
        }
        catch (error) {
            setWhitelistHash(null);
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
    return (
        <Card.Body className="rightbox">
            <>
                <Card.Title>Whitelisting</Card.Title>
                <Form.Group className="mb-3 formdiv2">
                    <Input
                        label={"Address*"}
                        type={"text"}
                        placeholder={"Input address to whitelist"}
                        value={whitelistAddress}
                        onChange={(e) => handleWhitelistAddress(e.target.value)}
                        error={whitelistAddressError !== 'null' && <Form.Text className="text-danger">{whitelistAddressError}</Form.Text>}
                    />
                </Form.Group>

                <FormButton
                    onClick={handleWhitelisting}
                    disabled={whitelistAddressError}
                    buttonName={"Whitelist"}
                />
            </>
            {(whitelistHash && !isPending) && <div>Whitelist Transaction Hash: <Link to={`${chain?.blockExplorers.default.url}/tx/${whitelistHash}`}>{whitelistHash}</Link></div>}
        </Card.Body>
    )
}

export default WhiteListAddress