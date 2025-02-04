import React from 'react';
import Input from '../../../Components/Input/Input';
import { Form } from 'react-bootstrap';

const BuybackBabyTokenForm = ({
  liquidityPercent, handleLiquidityPercent, liquidityPercentError,
  reflectionFee, handleReflectionFee, reflectionFeeError,
  rewardToken, handleRewardToken, rewardTokenError,
  marketingFee, handleMarketingFee, marketingFeeError,
  buybackFee, handleBuybackFee, buybackFeeError
}) => {
  return (
    <>
      <Input
        label={"Liquidity Fee*"}
        type={"number"}
        placeholder={"Input Liquidity Fee"}
        value={liquidityPercent}
        onChange={(e) => handleLiquidityPercent(e.target.value)}
        error={liquidityPercentError !== 'null' && <Form.Text className="text-danger">{liquidityPercentError}</Form.Text>}
      />
      <Input
        label={"Reflection Fee*"}
        type={"number"}
        placeholder={"Input Reflection Fee"}
        value={reflectionFee}
        onChange={(e) => handleReflectionFee(e.target.value)}
        error={reflectionFeeError !== 'null' && <Form.Text className="text-danger">{reflectionFeeError}</Form.Text>}
      />
      <Input
        label={"Reward Token*"}
        type={"text"}
        placeholder={"Input Reward Token"}
        value={rewardToken}
        onChange={(e) => handleRewardToken(e.target.value)}
        error={rewardTokenError !== 'null' && <Form.Text className="text-danger">{rewardTokenError}</Form.Text>}
      />
      <Input
        label={"Marketing Fee*"}
        type={"number"}
        placeholder={"Input Marketing Fee"}
        value={marketingFee}
        onChange={(e) => handleMarketingFee(e.target.value)}
        error={marketingFeeError !== 'null' && <Form.Text className="text-danger">{marketingFeeError}</Form.Text>}
      />
      <Input
        label={"Buyback Fee*"}
        type={"number"}
        placeholder={"Input Buyback Fee"}
        value={buybackFee}
        onChange={(e) => handleBuybackFee(e.target.value)}
        error={buybackFeeError !== 'null' && <Form.Text className="text-danger">{buybackFeeError}</Form.Text>}
      />
    </>
  );
};

export default BuybackBabyTokenForm;
