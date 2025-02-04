import React, { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import lockerAbi from '../../constants/abi/lock.json';
import erc20Abi from '../../constants/abi/erc20.json';
import { wagmiconfig } from '../../wagmiconfig/wagmiconfig';
import { Button, Dropdown, DropdownButton, Table } from 'react-bootstrap';
import './LockList.css';
import { Link } from 'react-router-dom';
import { locker } from '../../constants/constants';
import { useAccount, useConnect, useWriteContract } from 'wagmi';
import { multicall } from '@wagmi/core';
import FormButton from '../../Components/FormButton/FormButton';
const LockList = () => {
  const { chain, address } = useAccount();
  const { connectAsync } = useConnect()
  const { writeContractAsync, isPending, isSuccess } = useWriteContract();
  const [chainData, setChainData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chainId, setChainId] = useState(chain?.id || 56);
  const selectedChain = wagmiconfig.chains.find(c => c.id === chainId);
  const [page, setPage] = useState(1);
  const [tokenType, setTokenType] = useState(true);
  const [allMine, setAllMine] = useState(true);
  const [unlockHash, setUnlockHash] = useState(null);
  // console.log({ chainData })
  const lockContract = {
    address: locker[chainId],
    abi: lockerAbi
  };

  // Pagination button states
  const [next, setNext] = useState(false);
  const prev = page === 1;

  // const formatAmount = (amount) => amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const fetchChainData = async () => {
    setLoading(true);
    if (!chain) {
      setAllMine(true)
    }
    try {
      // Fetch the count of locked tokens
      const end = allMine ? await readContract(wagmiconfig, {
        abi: lockerAbi,
        address: locker[chainId],
        functionName: tokenType ? 'allNormalTokenLockedCount' : 'allLpTokenLockedCount',
        chainId
      }) : -1;

      const start = (page - 1) * 10; // Assuming page size is 10
      setNext(parseInt(end) < 10); // Disable next if less than 10 items

      // Fetch the lock info for the current page
      const result = await readContract(wagmiconfig, {
        ...lockContract,
        functionName: allMine ? (tokenType ? 'getCumulativeNormalTokenLockInfo' : 'getCumulativeLpTokenLockInfo') : (tokenType ? 'normalLocksForUser' : 'lpLocksForUser'),
        args: allMine ? [start, Math.min(start + 10, parseInt(end))] : [address], // Fetch in range
        chainId
      });

      const dataWithTokenNames = await Promise.all(
        result.reverse().map(async (item) => {
          try {
            const tokenContract = {
              address: item.token,
              abi: erc20Abi,
            };
            const results = await multicall(wagmiconfig, {
              contracts: [
                { ...tokenContract, functionName: 'name' },
                { ...tokenContract, functionName: 'symbol' },
                { ...tokenContract, functionName: 'decimals' },
              ],
              chainId
            });

            return { ...item, tokenName: results[0]?.result?.toString(), tokenSymbol: results[1]?.result?.toString(), tokenDecimals: results[2]?.result?.toString() };

          } catch (tokenError) {
            console.error('Failed to fetch token name:', tokenError);
            return { ...item, tokenName: 'Unknown' };
          }
        })
      );
      setChainData(dataWithTokenNames);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setChainData([]);
    } finally {
      setLoading(false);
    }
  };

  

  const handleUnlock = async (id) => {
    try {
      // console.log("first")
      // console.log({"chainId":chain.id})
      if (!address) {
        await connectAsync()
      }

      const data = await writeContractAsync({
        ...lockContract,
        chainID: parseInt(chain?.id, 10),
        args: [id],
        functionName: 'unlock',
      })
      setUnlockHash(data);
    }
    catch (error) {
      setUnlockHash(null);
      console.log({ error });
    }
  }

  useEffect(() => {
    fetchChainData();
  }, [page, chainId, tokenType, allMine]);

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setPage((prev) => prev - 1);
  };

  return (
    <div className="container lockpage">
      <>
        <div className="topbutton">
          {chain &&
            <DropdownButton title={allMine ? 'All Token' : 'My Token'}>
              <Dropdown.Item onClick={() => setAllMine(true)}>All Token</Dropdown.Item>
              <Dropdown.Item onClick={() => setAllMine(false)}>My Token</Dropdown.Item>
            </DropdownButton>
          }
          {allMine &&
            <DropdownButton title={chainId ? wagmiconfig.chains.find(chain => chain.id === chainId)?.name : "Select a chain"}>
              {wagmiconfig.chains.map((chain) => (
                <Dropdown.Item key={chain.id} onClick={() => setChainId(chain.id)}>
                  {chain.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          }
          <DropdownButton title={tokenType ? 'Normal Token' : 'LP Token'}>
            <Dropdown.Item onClick={() => setTokenType(true)}>Normal Token</Dropdown.Item>
            <Dropdown.Item onClick={() => setTokenType(false)}>LP Token</Dropdown.Item>
          </DropdownButton>

          <div>Page Number: {page}</div>
        </div>
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
            {chainData.length > 0 ? (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Token Name(Symbol)</th>
                      <th>Decimals</th>
                      <th>Amount</th>
                      <th>View</th>
                      {chainData[0].tgeDate && <th>Unlock Date</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {chainData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.tokenName}({item.tokenSymbol})</td>
                        <td>{item.tokenDecimals}</td>
                        <td>{(parseInt(item.amount) / 10 ** parseInt(item.tokenDecimals)).toString()}</td>
                        <td>
                          <Link
                            to={`${selectedChain.blockExplorers.default.url}/address/${item.token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.token}
                          </Link>
                        </td>
                        {
                          item.tgeDate && (
                            <td>
                              {parseInt(item.tgeDate) < Date.now() / 1000 ? (
                                <FormButton
                                  onClick={() => handleUnlock(item.id.toString())}
                                  disabled={parseInt(item.tgeDate) > Date.now() / 1000}
                                  buttonName={"Unlock"}
                                />
                              ) : (
                                `Can be unlocked after ${Math.floor((parseInt(item.tgeDate) - Date.now() / 1000) / 86400)} days and ${Math.floor(((parseInt(item.tgeDate) - Date.now() / 1000) % 86400) / 3600)} hours`
                              )}
                            </td>
                          )
                        }
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {unlockHash && <div>Unlock Hash: <Link to={`${chain?.blockExplorers.default.url}/tx/${unlockHash}`} target="_blank" rel="noopener noreferrer">{unlockHash}</Link></div>}
                {allMine && <div className="pagination-controls">
                  <Button onClick={handlePrevious} disabled={prev} variant="secondary">Previous</Button>
                  <Button onClick={handleNext} disabled={next} variant="primary">Next</Button>
                </div>}
              </>
            ) : (
              <div>
                <center className="text-danger">
                  <p>No Locked {tokenType ? 'Normal' : 'LP'} tokens available for this chain. Please select a different chain.</p>
                </center>
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default LockList;
