import React from 'react';
import Input from '../../Input/Input';
import { Form } from 'react-bootstrap';

const BabyTokenForm = ({
  rewardToken, handleRewardToken, rewardTokenError,
  minimumTokenBalance, handleMinimumTokenBalance, minimumTokenBalanceError,
  tokenRewardFee, handleTokenRewardFee, tokenTokenRewardFee, 
  liquidityPercent, handleLiquidityPercent, liquidityPercentError,
  marketingFee, handleMarketingFee, marketingFeeError,
  marketingAddress, handleMarketingAddress, marketingAddressError
}) => {
  return (
    <>


      <Input
        label={"Reward token"}
        type={"text"}
        placeholder={"Input reward token address"}
        value={rewardToken}
        onChange={(e) => handleRewardToken(e.target.value)}
        error={rewardTokenError !== 'null' && <Form.Text className="text-danger">{rewardTokenError}</Form.Text>}
      />



      <Input
        label={`Minimum token balance for dividends`}
        type={"number"}
        placeholder={"Input minimum token balance for dividends"}
        min={0}
        value={minimumTokenBalance}
        onChange={(e) => handleMinimumTokenBalance(e.target.value)}
        error={minimumTokenBalanceError !== 'null' && <Form.Text className="text-danger">{minimumTokenBalanceError}</Form.Text>}
      />


      <Input
        label={`Token reward fee (%)`}
        type={"number"}
        placeholder={"Input token reward fee"}
        min={0}
        value={tokenRewardFee }
        onChange={(e) => handleTokenRewardFee(e.target.value)}
        error={tokenTokenRewardFee !== 'null' && <Form.Text className="text-danger">{tokenTokenRewardFee}</Form.Text>}
      />



      <Input
        label={`Auto add liquidity (%)`}
        type={"number"}
        placeholder={"Input liquidity"}
        min={0}
        value={liquidityPercent}
        onChange={(e) => handleLiquidityPercent(e.target.value)}
        error={liquidityPercentError !== 'null' && <Form.Text className="text-danger">{liquidityPercentError}</Form.Text>}
      />



      <Input
        label={`Marketing fee (%)`}
        type={"number"}
        placeholder={"Input marketing fee "}
        min={0}
        value={marketingFee}
        onChange={(e) => handleMarketingFee(e.target.value)}
        error={marketingFeeError !== 'null' && <Form.Text className="text-danger">{marketingFeeError}</Form.Text>}
      />



      <Input
        label={`Marketing wallet`}
        type={"text"}
        placeholder={"Input marketing wallet"}
        value={marketingAddress}
        onChange={(e) => handleMarketingAddress(e.target.value)}
        error={marketingAddressError !== 'null' && <Form.Text className="text-danger">{marketingAddressError}</Form.Text>}
      />

    </>
  );
};

export default BabyTokenForm;
