import React from 'react';
import Input from '../../../Components/Input/Input';
import { Form } from 'react-bootstrap';

const TokenDetails = ({tokenType,
  tokenName, handleTokenName, tokenNameError,
  tokenSymbol, handleTokenSymbol, tokenSymbolError,
  tokenDecimal, handleTokenDecimal, tokenDecimalError,
  tokenTotalSupply, handleTokenTotalSupply, tokenTotalSupplyError
}) => {
  return (
    <>
      <Input
        label={"Name*"}
        type={"text"}
        placeholder={"Input token Name"}
        value={tokenName}
        onChange={(e) => handleTokenName(e.target.value)}
        error={tokenNameError !== 'null' && <Form.Text className="text-danger">{tokenNameError}</Form.Text>}
      />
      <Input
        label={"Symbol*"}
        type={"text"}
        placeholder={"Input token Symbol"}
        value={tokenSymbol}
        onChange={(e) => handleTokenSymbol(e.target.value)}
        error={tokenSymbolError !== 'null' && <Form.Text className="text-danger">{tokenSymbolError}</Form.Text>}
      />
      {
        tokenType == 0 &&
        <Input
          label={"Decimals*"}
          type={"number"}
          placeholder={"Input token Decimals"}
          value={tokenDecimal}
          onChange={(e) => handleTokenDecimal(e.target.value)}
          error={tokenDecimalError !== 'null' && <Form.Text className="text-danger">{tokenDecimalError}</Form.Text>}
        />
      }
      <Input
        label={"Total Supply*"}
        type={"number"}
        placeholder={"Input token Total Supply"}
        value={tokenTotalSupply}
        onChange={(e) => handleTokenTotalSupply(e.target.value)}
        error={tokenTotalSupplyError !== 'null' && <Form.Text className="text-danger">{tokenTotalSupplyError}</Form.Text>}
      />
    </>
  );
};

export default TokenDetails;
