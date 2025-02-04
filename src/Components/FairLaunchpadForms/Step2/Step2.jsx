import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { useAccount } from 'wagmi';
import Input from '../../Input/Input';
import { routers } from '../../../constants/constants';
import FormButton from '../../FormButton/FormButton';


const Step2 = ({ description, setDescription, setStep }) => {
  // console.log({description})
  const { isConnected, chain, address } = useAccount();

  const [totalSellingAmount, setTotalSellingAmount] = useState(description.totalSellingAmount || '');
  const [whitelist, setWhitelist] = useState(description.whitelist || true);
  const [softCap, setSoftCap] = useState(description.softCap || '');
  const [maxBuy, setMaxBuy] = useState(description.maxBuy || '');
  const [liquidity, setLiquidity] = useState(description.liquidity || '');
  const [router, setRouter] = useState(description.router || '');
  const [startTime, setStartTime] = useState(description.startTime || '');
  const [endTime, setEndTime] = useState(description.endTime || '');
  const [liquidityLockupDays, setLiquidityLockupDays] = useState(description.liquidityLockupDays || '');

  //Date & Time  management
  const [minTime, setMinTime] = useState('');
  const [maxTime, setMaxTime] = useState('');

  useEffect(() => {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const maxFutureTime = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

    setMinTime(oneHourFromNow.toISOString().slice(0, 16));
    setMaxTime(maxFutureTime.toISOString().slice(0, 16));
  }, []);

  // for routers dropdown
  const routerAddresses = routers[chain.id] || [];
  // console.log({routerAddresses})

  const [isMaxContribution, setIsMaxContribution] = useState(false);

  const [sellingAmount, setSellingAmount] = useState(0);

  useEffect(() => {
    if (totalSellingAmount && description.decimals && description.mainFee && softCap && liquidity) {
      const _totalAmount1 = Number(totalSellingAmount) * 10 ** description.decimals;
      const _feeCurrency = description.mainFee === "50" ? Number(softCap) / 20 : Number(softCap) / 50;
      const _totalAmount2 = Number(liquidity) / 100 * (Number(softCap) - _feeCurrency) / Number(softCap) * _totalAmount1;
      const _feeToken = description.mainFee === "50" ? 0 : _totalAmount1 / 50;
      const _totalAmount = (_totalAmount1 + _totalAmount2 + _feeToken) / 10 ** description.decimals
      // console.log({_totalAmount})
      setSellingAmount(_totalAmount);
    }
    else {
      setSellingAmount(0);
    }

  }, [totalSellingAmount, softCap, liquidity]);

  //errors
  const [totalSellingAmountError, setTotalSellingAmountError] = useState(totalSellingAmount == '' ? 'null' : null);
  const [softCapError, setSoftCapError] = useState(softCap == '' ? 'null' : null);
  const [maxBuyError, setMaxBuyError] = useState(isMaxContribution && maxBuy == '' ? 'null' : null);
  const [liquidityError, setLiquidityError] = useState(liquidity == '' ? 'null' : null);
  const [routerError, setRouterError] = useState(router == '' ? 'null' : null);
  const [startTimeError, setStartTimeError] = useState(startTime == '' ? 'null' : null);
  const [endTimeError, setEndTimeError] = useState(endTime == '' ? 'null' : null);
  const [liquidityLockupDaysError, setLiquidityLockupDaysError] = useState(liquidityLockupDays == '' ? 'null' : null);

  // console.log({
  //   "error":
  //     totalSellingAmountError ||
  //     softCapError ||
  //     maxBuyError ||
  //     liquidityError ||
  //     routerError ||
  //     startTimeError ||
  //     endTimeError ||
  //     liquidityLockupDaysError
  // })
  // console.log({ totalSellingAmountError })
  // console.log({ softCapError })
  // console.log({ maxBuyError })
  // console.log({ liquidityError })
  // console.log({ routerError })
  // console.log({ startTimeError })
  // console.log({ endTimeError })
  // console.log({ liquidityLockupDaysError })

  // console.log({
  //   totalSellingAmount,
  //   decimals: description.decimals,
  //   mainFee: description.mainFee,
  //   softCap,
  //   tokenName: description.tokenName,
  //   calculatedAmount: calculateSellingAmount()
  // });

  const handleTotalSellingAmount = (value) => {
    if (parseFloat(value) <= 0) {
      setTotalSellingAmountError('Presale rate must be positive number!');
    } else {
      setTotalSellingAmountError(null);
    }
    setTotalSellingAmount(value);
  };


  const handleSoftCap = (value) => {
    if (parseFloat(value) <= 0) {
      setSoftCapError('SoftCap must be positive number!');
    } else {
      setSoftCapError(null);
    }
    setSoftCap(value);
  };

  const handleMaxBuy = (value) => {
    if (parseFloat(value) <= 0) {
      setMaxBuyError('Maximum buy must be positive number!');
    } else {
      setMaxBuyError(null);
    }
    setMaxBuy(value);
  };


  const handleLiquidity = (value) => {
    if ((value) <= 50) {
      setLiquidityError('Maximum buy must be greater than 50%!');
    } else if ((value) > 100) {
      setLiquidityError('Maximum buy must be less than 100%!');
    } else {
      setLiquidityError(null);
    }
    setLiquidity(value)
  }

  const handleRouter = (value) => {
    if (value <= 50) {
      setRouterError('Please select a router!');
    } else {
      setRouterError(null);
    }
    setRouter(value)
  }

  const handleStartTime = (value) => {
    const newStartTime = new Date(value);
    if (isNaN(newStartTime.getTime())) {
      setStartTimeError('Start time must not be empty');
    } else {
      setStartTimeError(null);
      setStartTime(value);
    }
  };

  const handleEndTime = (value) => {
    const newEndTime = new Date(value);
    const startTimeDate = new Date(startTime);
    if (isNaN(newEndTime.getTime()) || newEndTime <= startTimeDate) {
      setEndTimeError('End time must be later than start time');
    } else {
      setEndTimeError(null);
      setEndTime(value);
    }
  };

  const handleLiquidityLockupDays = (value) => {
    if (parseFloat(value) <= 30) {
      setLiquidityLockupDaysError('Lockup Days rate must be greater than 30 days!');
    } else {
      setLiquidityLockupDaysError(null);
    }
    setLiquidityLockupDays(value);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  }

  const handleNext = () => {
    setDescription((prevDescription) => ({
      ...prevDescription,
      totalSellingAmount,
      sellingAmount,
      whitelist,
      softCap,
      maxBuy,
      router,
      isMaxContribution,
      liquidity,
      startTime,
      endTime,
      liquidityLockupDays,
      choosenAccount: address
    }));
    setStep((prevStep) => prevStep + 1);
  }

  if (!isConnected || chain?.nativeCurrency.name !== description.choosenChain) {
    return <div>
      <center className="text-danger">
        <div className="spinner-border text-danger" role="status">
          <span className="sr-only"></span>
        </div><br />
        You chose {description.choosenChain} chain in Step 1. The verification of token was done for the same.<br />
        Either switch to {description.choosenChain} or reload to start again!!!!
      </center>
    </div>;
  }

  return (
    <>
      <Input
        label={"Total Selling Amount*"}
        type={"number"}
        placeholder={"Enter Total Selling Amount"}
        min={0}
        value={totalSellingAmount}
        onChange={(e) => handleTotalSellingAmount(e.target.value)}
        note={`If I spend 1 ${chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto'}, how many tokens will I receive?`}
        error={totalSellingAmountError != 'null' && <Form.Text className="text-danger">{totalSellingAmountError}</Form.Text>}
      />

      <Form.Group className="mb-3">
        <Form.Label>Whitelist</Form.Label>
        <Form.Check
          type="radio"
          id="whitelistEnable"
          name="whitelisting"
          label="Enable"
          defaultChecked
          onChange={() => setWhitelist(true)}
        />
        <Form.Check
          type="radio"
          id="whitelistDisable"
          name="whitelisting"
          label="Disable"
          onChange={() => setWhitelist(false)}
        />
        <Form.Text className="mb-3 text-muted">You can enable/disable whitelist anytime.</Form.Text>
      </Form.Group>

      <Form.Group className="mb-3 formdiv2">
        <Input className="mb-3"
          label={`SoftCap (${chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto'})*`}
          type={"number"}
          placeholder={"Enter softCap"}
          min={0}
          value={softCap}
          onChange={(e) => handleSoftCap(e.target.value)}
          error={softCapError != 'null' && <Form.Text className="text-danger">{softCapError}</Form.Text>}
        />
      </Form.Group>
      <Form.Group className="mb-3 formdiv2">
        <Form.Check
          type="checkbox"
          label="Setting max contribution?"
          checked={isMaxContribution}
          onChange={() => {
            const newIsMaxContribution = !isMaxContribution;
            setIsMaxContribution(newIsMaxContribution);

            setMaxBuy(description.maxBuy || '');

            if (newIsMaxContribution && maxBuy == '' ? 'null' : null) {
              setMaxBuyError('null');
            } else {
              setMaxBuyError(null);
            }
          }}

        />
      </Form.Group>
      <Form.Group className="mb-3 formdiv2">
        {isMaxContribution && (

          <Input
            label={`Maximum buy (${chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto'})*`}
            type={"number"}
            placeholder={"Enter maximum buy"}
            min={0}
            value={maxBuy}
            onChange={(e) => handleMaxBuy(e.target.value)}
            error={maxBuyError !== 'null' && <Form.Text className="text-danger">{maxBuyError}</Form.Text>}
          />
        )}
      </Form.Group>
      <Form.Group className="mb-3 formdiv2">
        <Input
          label={`Liquidity (%)*`}
          type={"number"}
          placeholder={"Enter maximum buy"}
          min={0}
          value={liquidity}
          onChange={(e) => handleLiquidity(e.target.value)}
          error={liquidityError != 'null' && <Form.Text className="text-danger">{liquidityError}</Form.Text>}
        />
      </Form.Group>
      <Form.Group className="mb-3 formdiv selectrouter">
        <Form.Label>Select Router Address*</Form.Label>
        <DropdownButton id="router-dropdown" title={router || "Select a router"}>
          {Object.entries(routerAddresses).map(([name]) => (
            <Dropdown.Item
              key={name}
              onClick={() => handleRouter(name)}
            >
              {name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Form.Group>

      <Form.Group className="mb-3 formdiv" controlId="formStartTime">
        <Form.Label>Start Time (Local)</Form.Label>
        <Form.Control
          type="datetime-local"
          value={startTime}
          min={minTime}
          max={endTime || maxTime}
          onChange={(e) => handleStartTime(e.target.value)}
        />
        {startTimeError != 'null' && (
          <Form.Text className="text-danger">{startTimeError}</Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-3 formdiv" controlId="formEndTime">
        <Form.Label>End Time (Local)</Form.Label>
        <Form.Control
          type="datetime-local"
          value={endTime}
          min={startTime || minTime}
          max={maxTime}
          onChange={(e) => handleEndTime(e.target.value)}
        />
        {endTimeError != 'null' && (
          <Form.Text className="text-danger">{endTimeError}</Form.Text>
        )}
      </Form.Group>

      <Form.Group className="mb-3 formdiv lockup">
        <Input
          label={`Liquidity lockup (days)*`}
          type={"number"}
          placeholder={"Enter Liquidity lockup days"}
          min={0}
          value={liquidityLockupDays}
          onChange={(e) => handleLiquidityLockupDays(e.target.value)}
          error={liquidityLockupDaysError != 'null' && <Form.Text className="text-danger lockup">{liquidityLockupDaysError}</Form.Text>}
        />
      </Form.Group>

      <center className="tokedisc">
        <Form.Text>
          Need {sellingAmount} {description.tokenName} to create launchpad.
        </Form.Text>

      </center>
      <br />

      <Button variant="secondary" onClick={handlePrevious} className="me-2">
        Previous
      </Button>
      <FormButton
        onClick={handleNext}
        disabled={(
          totalSellingAmountError ||
          softCapError ||
          maxBuyError ||
          liquidityError ||
          routerError ||
          startTimeError ||
          endTimeError ||
          liquidityLockupDaysError
        )}
        buttonName={"Next"}
      />

    </>
  );
};

export default Step2;
