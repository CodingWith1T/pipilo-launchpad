import React from 'react';
import "./Footer.css";
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { BsTwitterX } from 'react-icons/bs';

const Footer = () => {
    return (
        <Card className="footer">
            <div className="container">
                <div className="col-md-12">
                    <img src="/logo.png" alt="Logo" className="d-inline-block align-text-top" style={{ width: '12rem' }} />
                </div>
                <Card className="socialicons">
						<Link to='https://twitter.com/KING_PIPI_LOL'><BsTwitterX /></Link>
						<Link to='https://chat.whatsapp.com/DizddEZuabG9yVLLwNLkIu'><FaWhatsapp /></Link>
						<Link to='https://t.me/PIPI_LOL'><FaTelegram /></Link>
					</Card>

                <div className="col-md-12 footerlink">
                    <Link to='/launchpads/launchpad'>Create a launchpad</Link> |
                    <Link to='/launchpads/fairlaunch'>Create a fairlaunch</Link> |
                    <Link to='/launchpads/launchpad-list'>Launchpads List</Link> |
                    <Link to='/lock/create'>Create a Lock</Link> |
                    <Link to='/lock/tokens'>Lock List</Link> |
                    <Link to='/token'>Create a Token</Link> |
                    {/* <Link to='/kyc'>KYC</Link> | */}
                    <Link to='https://pipiswap.finance/'>PipiSwap</Link> |
                    <Link to='https://pipitool.com/staking/create'>Staking</Link>
                </div>
                <div className="col-md-12 copyright">
                    © 2024 <Link to='/'>Pipitools.finance</Link>
                </div>

            </div>
        </Card>
    )
}

export default Footer