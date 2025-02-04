import React from 'react';
import { Card } from 'react-bootstrap';
import { useReadContracts } from 'wagmi';

const WhitelistedAddress = ({ length, launchpadContract, chainId }) => {
    const { data, error, isLoading } = useReadContracts({
        contracts: [
            {
                ...launchpadContract,
                functionName: 'getWhiteLists',
                args: [length, 0],
                chainId
            }
        ]
    });

    if (error) {
        return <p>Unable to find whitelisted addresses.</p>;
    }

    return (
        <>
            <Card.Body className="rightbox">
                <h5>Whitelisted Addresses</h5>
                {length > 0 ? (
                    isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <ul>
                                {
                                    data[0].result.map((address, index) => (
                                        <li key={index}>{address}</li>
                                    ))
                                }
                            </ul>
                            <p>
                                Note: If you want your address to be whitelisted, please contact the owner, else you won't be able to invest, until whitelist enable time.
                            </p>
                        </>
                    )
                ) : (
                    <p>
                        Note: If you want your address to be whitelisted, please contact the owner, else you won't be able to invest, until whitelist enable time.
                    </p>
                )}
            </Card.Body>
        </>
    );
};

export default WhitelistedAddress;
