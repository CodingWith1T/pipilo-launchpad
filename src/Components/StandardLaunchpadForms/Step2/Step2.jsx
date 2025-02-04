import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { useAccount } from 'wagmi';
import Input from '../../Input/Input';
import { routers } from '../../../constants/constants';
import FormButton from '../../FormButton/FormButton';


const Step2 = ({ description, setDescription, setStep }) => {
  // console.log({description})
  const { isConnected, chain, address } = useAccount();
  const [presaleRate, setPresaleRate] = useState(description.presaleRate || '');
  const [whitelist, setWhitelist] = useState(description.whitelist || true);
  const [softCap, setSoftCap] = useState(description.softCap || '');
  const [hardCap, setHardCap] = useState(description.hardCap || '');
  const [minBuy, setMinBuy] = useState(description.minBuy || '');
  const [maxBuy, setMaxBuy] = useState(description.maxBuy || '');
  const [refundType, setRefundType] = useState(description.refundType || false);
  const [liquidity, setLiquidity] = useState(description.liquidity || '');
  const [router, setRouter] = useState(description.router || '');
  const [listingRate, setListingRate] = useState(description.listingRate || '');
  const [startTime, setStartTime] = useState(description.startTime || '');
  const [endTime, setEndTime] = useState(description.endTime || '');
  // console.log(
  //   {
  //     "presaleRate": typeof presaleRate,
  //     "whitelist": typeof whitelist,
  //     "softCap": typeof softCap,
  //     "hardCap": typeof hardCap,
  //     "minBuy": typeof minBuy,
  //     "maxBuy": typeof maxBuy,
  //     "refundType": typeof refundType,
  //     "liquidity": typeof liquidity,
  //     "router": typeof router,
  //     "listingRate": typeof listingRate,
  //     "startTime": typeof startTime,
  //     "endTime": typeof endTime
  //   })
  // console.log(
  //   {
  //     "presaleRate": presaleRate,
  //     "whitelist": whitelist,
  //     "softCap": softCap,
  //     "hardCap": hardCap,
  //     "minBuy": minBuy,
  //     "maxBuy": maxBuy,
  //     "refundType": refundType,
  //     "liquidity": liquidity,
  //     "router": router,
  //     "listingRate": listingRate,
  //     "startTime": startTime,
  //     "endTime": endTime
  //   })
  // console.log({ startTime, endTime })
  const [liquidityLockupDays, setLiquidityLockupDays] = useState(description.liquidityLockupDays || '');

  const [sellingAmount, setSellingAmount] = useState(0);

  useEffect(() => {
    const _totalAmount1 = Number(hardCap) * Number(presaleRate) * 10 ** description.decimals
    const _feeCurrency = description.mainFee === "50" ? Number(hardCap) / 20 : Number(hardCap) / 50
    const _totalAmount2 = description.listingOption ? (Number(liquidity) / 100 * (Number(hardCap) - _feeCurrency)) * Number(listingRate) * 10 ** description.decimals : 0
    const _feeToken = description.mainFee === "50" ? 0 : _totalAmount1 / 50

    const _totalAmount = (_totalAmount1 + _totalAmount2 + _feeToken) / 10 ** description.decimals
    // console.log({_totalAmount})
    setSellingAmount(_totalAmount)

  }, [presaleRate, liquidity, listingRate, hardCap])

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

  //errors
  const [presaleRateError, setPresaleRateError] = useState(presaleRate == '' ? 'null' : null);
  const [hardCapError, setHardCapError] = useState(hardCap == '' ? 'null' : null);
  const [softCapError, setSoftCapError] = useState(softCap == '' ? 'null' : null);
  const [minBuyError, setMinBuyError] = useState(minBuy == '' ? 'null' : null);
  const [maxBuyError, setMaxBuyError] = useState(maxBuy == '' ? 'null' : null);
  const [liquidityError, setLiquidityError] = useState(liquidity == '' && description.listingOption ? 'null' : null);
  const [routerError, setRouterError] = useState(router == '' && description.listingOption ? 'null' : null);
  const [listingRateError, setListingRateError] = useState(listingRate == '' && description.listingOption ? 'null' : null);
  const [startTimeError, setStartTimeError] = useState(startTime == '' ? 'null' : null);
  const [endTimeError, setEndTimeError] = useState(endTime == '' ? 'null' : null);
  const [liquidityLockupDaysError, setLiquidityLockupDaysError] = useState(liquidityLockupDays == '' && description.listingOption ? 'null' : null);
  // console.log("___________________________--___________________________--___________________________")
  // console.log({
  //   "error":
  //     presaleRateError ||
  //     hardCapError ||
  //     softCapError ||
  //     minBuyError ||
  //     maxBuyError ||
  //     liquidityError ||
  //     routerError ||
  //     listingRateError ||
  //     startTimeError ||
  //     endTimeError ||
  //     liquidityLockupDaysError
  // })
  // console.log({ presaleRateError })
  // console.log({ hardCapError })
  // console.log({ softCapError })
  // console.log({ minBuyError })
  // console.log({ maxBuyError })
  // console.log({ liquidityError })
  // console.log({ routerError })
  // console.log({ listingRateError })
  // console.log({ startTimeError })
  // console.log({ endTimeError })
  // console.log({ liquidityLockupDaysError })



  const handlePresaleRate = (value) => {
    if (parseFloat(value) <= 0) {
      setPresaleRateError('Presale rate must be positive number!');
    } else {
      setPresaleRateError(null);
    }
    setPresaleRate(value);
  };

  const handleHardCap = (value) => {
    if (parseFloat(value) <= 0) {
      setHardCapError('HardCap must be positive number!');
    } else if (parseFloat(value) <= parseFloat(softCap)) {
      setHardCapError('HardCap must be greater than hardCap!');
    } else if (0.25 * parseFloat(value) >= parseFloat(softCap)) {
      setSoftCapError('SoftCap must be greater or equal to 25% of HardCap!');
    } else {
      setHardCapError(null);
      setSoftCapError(null);
    }
    setHardCap(value);
  };

  const handleSoftCap = (value) => {
    if (parseFloat(value) <= 0) {
      setSoftCapError('SoftCap must be positive number!');
    } else if (parseFloat(value) <= 0.25 * parseFloat(hardCap)) {
      setSoftCapError('SoftCap must be greater or equal to 25% of HardCap!');
    } else if (parseFloat(value) > parseFloat(hardCap)) {
      setSoftCapError('SoftCap must be less than HardCap!');
    } else {
      setHardCapError(null);
      setSoftCapError(null);
    }
    setSoftCap(value);
  };

  const handleMinBuy = (value) => {
    // console.log({"value":parseInt(value)})
    if (parseFloat(value) <= 0) {
      setMinBuyError('Minimum buy must be a positive number!');
    } else if (parseFloat(value) >= parseFloat(maxBuy)) {
      setMinBuyError('Minimum buy must be less than the Maximum buy!');
    } else {
      setMinBuyError(null);
      setMaxBuyError(null);
    }
    setMinBuy(value);
  };

  const handleMaxBuy = (value) => {
    // console.log({"value":parseInt(value)})
    if (parseFloat(value) <= 0) {
      setMaxBuyError('Maximum buy must be a positive number!');
    } else if (parseFloat(value) <= parseFloat(minBuy)) {
      setMaxBuyError('Maximum buy must be greater than the Minimum buy!');
    } else {
      setMinBuyError(null);
      setMaxBuyError(null);
    }
    setMaxBuy(value);
  };

  const handleRefundType = (value) => {
    setRefundType(value)
  }

  const handleLiquidity = (value) => {
    if (description.listingOption && parseFloat(value) <= 50) {
      setLiquidityError('Maximum buy must be greater than 50%!');
    } else if (parseFloat(value) > 100) {
      setLiquidityError('Maximum buy must be less than 100%!');
    } else {
      setLiquidityError(null);
    }
    setLiquidity(value)
  }

  const handleRouter = (value) => {
    if (description.listingOption && value == '') {
      setRouterError('Please select a router!');
    } else {
      setRouterError(null);
    }
    setRouter(value)
  }

  const handleListingRate = (value) => {
    if (description.listingOption && parseFloat(value) <= 0) {
      setListingRateError('Maximum buy must be positive number!');
    } else {
      setListingRateError(null);
    }
    setListingRate(value)
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
    if (description.listingOption && value <= 30) {
      setLiquidityLockupDaysError('Lockup Days must be greater than 30 days!');
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
      presaleRate,
      whitelist,
      hardCap,
      softCap,
      minBuy,
      maxBuy,
      refundType,
      router: prevDescription.listingOption ? router : null,
      listingRate: prevDescription.listingOption ? listingRate : null,
      liquidity: prevDescription.listingOption ? liquidity : null, 
      liquidityLockupDays: prevDescription.listingOption ? liquidityLockupDays : null, 
      startTime,
      endTime,
      choosenAccount: address,
      sellingAmount
    }));
    setStep((prevStep) => prevStep + 1);
};

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
        label={"Presale Rate*"}
        type={"number"}
        placeholder={"Enter presale rate"}
        min={0}
        value={presaleRate}
        onChange={(e) => handlePresaleRate(e.target.value)}
        note={`If I spend 1 ${chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto'}, how many tokens will I receive?`}
        error={presaleRateError != 'null' && <Form.Text className="text-danger">{presaleRateError}</Form.Text>}
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

      <Input
        label={`SoftCap (${chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto'})*`}
        type={"number"}
        placeholder={"Enter softCap"}
        min={0}
        value={softCap}
        onChange={(e) => handleSoftCap(e.target.value)}
        note={"SoftCap must be >= 25% of HardCap!"}
        error={softCapError != 'null' && <Form.Text className="text-danger">{softCapError}</Form.Text>}
      />

      <Input
        label={`HardCap (${chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto'})*`}
        type={"number"}
        placeholder={"Enter hardCap"}
        min={0}
        value={hardCap}
        onChange={(e) => handleHardCap(e.target.value)}

        error={hardCapError != 'null' && <Form.Text className="text-danger">{hardCapError}</Form.Text>}
      />

      <Input
        label={`Minimum buy (${chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto'})*`}
        type={"number"}
        placeholder={"Enter minimum buy"}
        min={0}
        value={minBuy}
        onChange={(e) => handleMinBuy(e.target.value)}
        error={minBuyError != 'null' && <Form.Text className="text-danger">{minBuyError}</Form.Text>}
      />

      <Input
        label={`Maximum buy (${chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto'})*`}
        type={"number"}
        placeholder={"Enter maximum buy"}
        min={0}
        value={maxBuy}
        onChange={(e) => handleMaxBuy(e.target.value)}
        error={maxBuyError != 'null' && <Form.Text className="text-danger">{maxBuyError}</Form.Text>}
      />

      <Form.Group className="mb-3">
        <Form.Label>Refund Type</Form.Label>
        <Form.Check
          type="radio"
          id="refundTypeRefund"
          name="refundType"
          label="Refund"
          defaultChecked
          onChange={() => handleRefundType(false)}
        />
        <Form.Check
          type="radio"
          id="refundTypeBurn"
          name="refundType"
          label="Burn"
          onChange={() => handleRefundType(true)}
        />
      </Form.Group>

      {description.listingOption && <>
        <Input
          label={`Listing rate*`}
          type={"number"}
          placeholder={"Listing rate"}
          min={0}
          value={listingRate}
          onChange={(e) => handleListingRate(e.target.value)}
          note={`1 ${chain?.nativeCurrency?.symbol ? chain.nativeCurrency.symbol : 'crypto'} = ${listingRate ? listingRate : 0} ${description.tokenName}`}
          error={listingRateError != 'null' && <Form.Text className="text-danger rate">{listingRateError}</Form.Text>}
        />

        <Input
          label={`Liquidity (%)*`}
          type={"number"}
          placeholder={"Enter maximum buy"}
          min={0}
          value={liquidity}
          onChange={(e) => handleLiquidity(e.target.value)}
          error={liquidityError != 'null' && <Form.Text className="text-danger">{liquidityError}</Form.Text>}
        />

        <Form.Group className="mb-3 formdiv Router">
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
      </>}

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

      {description.listingOption && <Input
        label={`Liquidity lockup (days)*`}
        type={"number"}
        placeholder={"Enter Liquidity lockup days"}
        min={0}
        value={liquidityLockupDays}
        onChange={(e) => handleLiquidityLockupDays(e.target.value)}
        error={liquidityLockupDaysError != 'null' && <Form.Text className="text-danger lkk">{liquidityLockupDaysError}</Form.Text>}
      />}
      <center className="tokedisc">
        <Form.Text>
          Need {sellingAmount} {description.tokenName} to create launchpad.
        </Form.Text>
      </center><br />
      {/* <Input
        label = {``}
        type = {}
        placeholder = {}
        min={}
        value = {}
        onChange = {}
        note = {}
        error = {}
      /> */}

      <Button variant="secondary" onClick={handlePrevious} className="me-2">
        Previous
      </Button>
      <FormButton
        onClick={handleNext}
        disabled={(
          presaleRateError ||
          hardCapError ||
          softCapError ||
          minBuyError ||
          maxBuyError ||
          liquidityError ||
          routerError ||
          listingRateError ||
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
