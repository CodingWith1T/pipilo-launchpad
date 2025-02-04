import React, { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import managerAbi from '../../constants/abi/manager.json';
import erc20Abi from '../../constants/abi/erc20.json';
import { wagmiconfig } from '../../wagmiconfig/wagmiconfig';
import { Button, Card, Dropdown, DropdownButton } from 'react-bootstrap';
import './LaunchpadsList.css';
import { manager } from '../../constants/constants';
import { useAccount } from 'wagmi';
import { multicall } from 'viem/actions';
import { formatUnits } from 'viem';
import { useParams } from 'react-router-dom';

const LaunchpadsList = () => {
  const { networkId } = useParams();
  const { chain } = useAccount();
  const [chainData, setChainData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chainId, setChainId] = useState(parseInt(networkId) || chain?.id || 56);
  const [page, setPage] = useState(1);

  //button settings
  const [next, setNext] = useState(false);
  const prev = page == 1;

  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
  };

  const fetchChainData = async () => {
    setLoading(true);
    try {

      const chainSize = await readContract(wagmiconfig, {
        abi: managerAbi,
        address: manager[chainId],
        functionName: 'getContributionsLength',
        chainId
      });

      const cursor = Math.max(parseInt(chainSize) - page * 9, 0);

      if (parseInt(chainSize) <= page * 9) {
        setNext(true);
      }
      else {
        setNext(false);
      }

      const result = await readContract(wagmiconfig, {
        abi: managerAbi,
        address: manager[chainId],
        functionName: 'getLaunchpads',
        args: [9, cursor > 0 ? cursor : 0],
        chainId
      });
      // console.log({result})
      const dataWithTokenNames = await Promise.all(
        result.reverse().map(async (item) => {
          try {
            const tokenName = await readContract(wagmiconfig, {
              abi: erc20Abi,
              address: item.token,
              functionName: 'name',
              chainId
            });
            const decimals = await readContract(wagmiconfig, {
              abi: erc20Abi,
              address: item.token,
              functionName: 'decimals',
              chainId
            });
            const symbol = await readContract(wagmiconfig, {
              abi: erc20Abi,
              address: item.token,
              functionName: 'symbol',
              chainId
            });
            return { ...item, tokenName, decimals, symbol };
          } catch (tokenError) {
            console.error('Failed to fetch token name:', tokenError);
            return { ...item, tokenName: 'Unknown' };
          }
        })
      );

      setChainData(dataWithTokenNames.length > 0 ? dataWithTokenNames : []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setChainData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChainData();
  }, [page, chainId]);

  const handleNext = () => {
    setPage(prev => prev + 1);
  }
  const handlePrevious = () => {
    setPage(prev => prev - 1);
  }

  return (
    <div className="container listingpage">
      <>
        <DropdownButton id="dropdown-currency" title={chainId ? wagmiconfig.chains.find(chain => chain.id === chainId)?.name : "Select a chain"}>
          {wagmiconfig.chains.map(chain => (
            <Dropdown.Item key={chain.id} onClick={() => setChainId(chain.id)}>
              {chain.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <div className="pagenumber"> Page Number : {page}</div>
        {loading ? (
          <div>
            <center className="text-danger">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <br />
            </center>
          </div>

        ) : (

          <>
            {chainData && chainData.length > 0 ? (
              <>
                {chainData.map((item, index) => (

                  <Card key={index} className="mb-4 cardbox listcard">
                    <Card.Body>
                      <div className="cardtop">
                        <div className="logobox">
                          <Card.Img variant="top" src={item.logoUrl} alt="Launchpad Logo" />
                        </div>
                        <div className="live">⚫ Sale live</div>
                      </div>
                      <Card.Title className="title">{item.tokenName}({item.symbol}) Token</Card.Title>
                      <div>
                        <ul className="detailslist">
                          {!item.hardCap && <li><strong>Soft Cap:</strong><span className="soft">{formatUnits(item.softCap, item.decimals)} {item.symbol}</span></li>}
                          {item.hardCap && <li><strong>Soft - Hard Cap:</strong> <span className="soft">{formatUnits(item.softCap, item.decimals)} - {formatUnits(item.hardCap, item.decimals)} {item.symbol}</span></li>}

                          <li><strong>Presale Type:</strong> <span>{item.liquidity == 0 ? 'Public' : capitalize(item.presaleType?.toString())}</span></li>

                          {item.presaleType == 'standard' && <li>
                            <strong>Tokens For Presale:</strong><span>{(parseInt(item.hardCap) * parseInt(item.rate) / 10 ** (parseInt(wagmiconfig.chains.find(c => c.id === chainId).nativeCurrency.decimals) + parseInt(item.decimals))).toLocaleString()} {item.symbol}</span></li>
                          }

                          {item.presaleType == 'fair' &&
                            <li><strong>Tokens For Presale:</strong> <span>{formatUnits(BigInt(item.total.toString()), item.decimals)} {item.symbol}</span>  </li>
                          }

                          <li className="liquidity"><strong>Liquidity:</strong> <span><strong>{parseInt(item.liquidity) / 10}%</strong></span></li>
                          <li className="Locktime"><strong>Lock Time:</strong> <span><strong>{parseInt(item.lockTime) / 86400} Days</strong></span></li>
                        </ul>
                      </div>
                      <Button variant="primary" href={`/launchpads/${item.presaleType}/${item.addr}/${chainId}`}>
                        View
                      </Button>
                    </Card.Body>
                  </Card>

                ))}
                <div className="clearfix"></div>
                <div className="pagination-controls">
                  <Button onClick={handlePrevious} disabled={prev} variant='secondary'>Previous</Button>
                  <Button onClick={handleNext} disabled={next} variant='primary'>Next</Button>
                </div>
              </>
            ) : (
              <div>
                <center className="text-danger">
                  <p>No Launchpads available for this chain please select a different chain.</p>
                </center>
              </div>
            )}

          </>
        )}
      </>
    </div>
  );
};

export default LaunchpadsList;
