import React from 'react';
import { Button } from 'react-bootstrap';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const FormButton = ({ onClick, href, disabled, buttonName }) => {
    const { isConnected } = useAccount();

    return isConnected ? (
        href ? (
            <Button
                variant={
                    buttonName === 'Approve' ? 'danger' :
                    buttonName === 'Previous' ? 'secondary' : 'primary'
                }
                href={href}
                disabled={disabled}
                className="me-2"
            >
                {buttonName}
            </Button>
        ) : (
            <Button
                variant={
                    buttonName === 'Approve' ? 'danger' :
                    buttonName === 'Previous' ? 'secondary' : 'primary'
                }
                onClick={onClick}
                disabled={disabled}
                className="me-2"
            >
                {buttonName}
            </Button>
        )
    ) : (
        <ConnectButton />
    );
};

export default FormButton;
