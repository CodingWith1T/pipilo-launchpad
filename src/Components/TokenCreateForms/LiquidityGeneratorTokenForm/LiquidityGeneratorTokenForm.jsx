import React from 'react';
import Input from '../../../Components/Input/Input';
import { Form } from 'react-bootstrap';

const LiquidityGeneratorTokenForm = ({
  yieldGenerateFee, handleYieldGenerateFee, yieldGenerateFeeError,
  liquidityGenerateFee, handleLiquidityGenerateFee, liquidityGenerateFeeError,
  marketingAddress, handleMarketingAddress, marketingAddressError,
  marketingPercent, handleMarketingPercent, marketingPercentError
}) => {
  return (
    <>
      <Input
        label={"Yield Generate Fee(%)*"}
        type={"number"}
        placeholder={"Input Yield Generate Fee"}
        value={yieldGenerateFee}
        onChange={(e) => handleYieldGenerateFee(e.target.value)}
        error={yieldGenerateFeeError !== 'null' && <Form.Text className="text-danger">{yieldGenerateFeeError}</Form.Text>}
      />
      <Input
        label={"Liquidity Generate Fee (%)*"}
        type={"number"}
        placeholder={"Input Liquidity Generate Fee"}
        value={liquidityGenerateFee}
        onChange={(e) => handleLiquidityGenerateFee(e.target.value)}
        error={liquidityGenerateFeeError !== 'null' && <Form.Text className="text-danger">{liquidityGenerateFeeError}</Form.Text>}
      />
      <Input
        label={"Marketing Address*"}
        type={"text"}
        placeholder={"Input Marketing Address"}
        value={marketingAddress}
        onChange={(e) => handleMarketingAddress(e.target.value)}
        error={marketingAddressError !== 'null' && <Form.Text className="text-danger">{marketingAddressError}</Form.Text>}
      />
      <Input
        label={"Marketing Percent(%)*"}
        type={"number"}
        placeholder={"Input Marketing Percent"}
        value={marketingPercent}
        onChange={(e) => handleMarketingPercent(e.target.value)}
        error={marketingPercentError !== 'null' && <Form.Text className="text-danger">{marketingPercentError}</Form.Text>}
      />
    </>
  );
};

export default LiquidityGeneratorTokenForm;
