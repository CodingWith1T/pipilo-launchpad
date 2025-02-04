import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { Button, Card } from "react-bootstrap";
import { readContract } from "@wagmi/core";
import managerAbi from "../../constants/abi/manager.json";
import erc20Abi from "../../constants/abi/erc20.json";
import { wagmiconfig } from "../../wagmiconfig/wagmiconfig";
import { MdDoubleArrow } from "react-icons/md";
import { Link } from "react-router-dom";
import { manager } from "../../constants/constants";
import { formatUnits } from "viem";

const HomePage = () => {
  const [launchpads, setLaunchpads] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
  };

  const chainIds = [1116, 56,]; // Example chain IDs

  useEffect(() => {
    const fetchLaunchpads = async () => {
      try {
        const data = await sampleLaunchpads();
        setLaunchpads(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchpads();
  }, []);

  const sampleLaunchpads = async () => {
    const allLaunchpads = [];

    for (const chainId of chainIds) {
      try {
        const chainSize = await readContract(wagmiconfig, {
          abi: managerAbi,
          address: manager[chainId],
          functionName: 'getContributionsLength',
          chainId: chainId
        });

        const result = await readContract(wagmiconfig, {
          abi: managerAbi,
          address: manager[chainId],
          functionName: 'getLaunchpads',
          args: [4, Math.max(0, parseInt(chainSize) - 4)],
          chainId: chainId
        });

        const dataWithTokenNames = await Promise.all(
          result.reverse().map(async (item) => {
            try {
              const decimals = await readContract(wagmiconfig, {
                abi: erc20Abi,
                address: item.token,
                functionName: 'decimals',
                chainId: chainId
              });

              const tokenName = await readContract(wagmiconfig, {
                abi: erc20Abi,
                address: item.token,
                functionName: 'name',
                chainId: chainId
              });
              const tokenSymbol = await readContract(wagmiconfig, {
                abi: erc20Abi,
                address: item.token,
                functionName: 'symbol',
                chainId: chainId
              });

              return { ...item, tokenName, tokenSymbol, decimals, chainId };
            } catch (tokenError) {
              console.error('Failed to fetch token name:', tokenError);
              return { ...item, tokenName: 'Unknown' };
            }
          })
        );
        allLaunchpads.push(...dataWithTokenNames);
      } catch (err) {
        console.error(`Failed to fetch data for chain ${chainId}:`, err);
      }
    }

    const sortedLaunchpads = allLaunchpads.sort((a, b) => {
      return -1 * (parseInt(a.endTime) - parseInt(b.endTime));
    });
    // console.log({sortedLaunchpads})

    return sortedLaunchpads.slice(0, 4);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <>
      <Card className="lunchpadsection">
        <div className="container">
          {launchpads.length > 0 && (
            <>
              <Card.Body className="contentbox clearfix">
                <Card.Title className="LaunchpadTitle">
                  Launchpad List
                </Card.Title>
                {launchpads.map((item, index) => (
                  <Card key={index} className="mb-4 cardbox listcard">
                    <Card.Body>
                      <div className="cardtop">
                        <div className="logobox">
                          <Card.Img
                            variant="top"
                            src={item.logoUrl}
                            alt="Launchpad Logo"
                          />
                        </div>
                        <div className="live">⚫ Sale live</div>
                      </div>
                      <Card.Title className="title">
                        {item.tokenName} Token
                      </Card.Title>
                      <div>
                        <ul className="detailslist">
                          {!item.hardCap && <li><strong>Soft Cap:</strong><span className="soft">{formatUnits(item.softCap, item.decimals)} {item.tokenSymbol}</span></li>}
                          {item.hardCap && <li><strong>Soft - Hard Cap:</strong> <span className="soft">{formatUnits(item.softCap, item.decimals)} - {formatUnits(item.hardCap, item.decimals)} {item.tokenSymbol}</span></li>}
                          
                          <li><strong>Presale Type:</strong> <span>{item.liquidity == 0 ? 'Public' : capitalize(item.presaleType?.toString())}</span></li>

                          {item.presaleType == 'standard' && <li>
                            <strong>Tokens For Presale:</strong><span>{(parseInt(item.hardCap) * parseInt(item.rate) / 10 ** (parseInt(wagmiconfig.chains.find(c => c.id === item.chainId).nativeCurrency.decimals) + parseInt(item.decimals))).toLocaleString()} {item.symbol}</span></li>
                          }

                          {item.presaleType == 'fair' &&
                            <li><strong>Tokens For Presale:</strong> <span>{formatUnits(BigInt(item.total.toString()), item.decimals)} {item.symbol}</span>  </li>
                          }
                          <li className="liquidity"><strong>Liquidity:</strong> <span><strong>{parseInt(item.liquidity) / 10}%</strong></span></li>
                          <li className="Locktime"><strong>Lock Time:</strong> <span><strong>{parseInt(item.lockTime) / 86400} Days</strong></span></li>
                        </ul>
                      </div>
                      <Button
                        variant="primary"
                        href={`/launchpads/${item.presaleType?.toString()}/${item.addr
                          }/${item.chainId}`}
                      >
                        View
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
                <Card.Title className="morelaunch">
                  <Link
                    className="launchpadlink"
                    to={`/launchpads/launchpad-list`}
                  >
                    More launchpad list
                    <MdDoubleArrow />
                  </Link>
                </Card.Title>
              </Card.Body>
            </>
          )}
        </div>
      </Card>

      <Card className="Pipitoolssection">
        <div className="container">
          <Card.Title className="LaunchpadTitle pipitools">
            <span>Pipitools Finance</span> Ecosystem consists mainly of
            attributes, namely the creation of tokens on almost all blockchains
            for a minimal fee, plus:
          </Card.Title>
          <div className="row">
            <div className="col-md-3">
              <div className="caption">
                <Link to="/launchpads/launchpad">
                  <img
                    src="/Launchpad.png"
                    className="card-img"
                    alt="Main Image"
                  />
                  <div className="captionbox">
                    <h3>Launchpad</h3>
                  </div>
                </Link>
              </div>
            </div>

            <div className="col-md-3">
              <div className="caption">
                <Link to="https://pipiswap.finance/">
                  <img
                    src="/Exchange.png"
                    className="card-img"
                    alt="Main Image"
                  />
                  <div className="captionbox">
                    <h3>Exchange</h3>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-3">
              <div className="caption">
                <Link to="">
                  <img
                    src="/Farms-Pools.png"
                    className="card-img"
                    alt="Main Image"
                  />
                  <div className="captionbox">
                    <h3>Farms & Pools</h3>
                  </div>
                </Link>
              </div>
            </div>
            <div className="col-md-3">
              <div className="caption">
                <Link to="">
                  <img
                    src="/Rewards.png"
                    className="card-img"
                    alt="Main Image"
                  />
                  <div className="captionbox">
                    <h3>Rewards</h3>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="Launchpadmain">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Card.Title className="Launchpad-last">
                The Launchpad Protocol for Everyone
              </Card.Title>
              <p>
                Pipitools.finance helps everyone to create their own tokens and
                token sales in few seconds. Tokens created on Pipitools.finance
                will be verified and published on explorer websites.
              </p>
              <Button className="launchpad" href="/documents">
                Learn More <MdDoubleArrow />
              </Button>
            </div>
            <div className="col-md-6 rightimg">
              <img
                src="/Launchpad-img.png"
                className="card-img"
                alt="Main Image"
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default HomePage;
