import React from 'react';
import { Form } from 'react-bootstrap';

const TokenTypeSelector = ({ handleTokenType }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>Type</Form.Label>
      <Form.Check
        type="radio"
        name="tokenType"
        label="Standard Token"
        defaultChecked
        onChange={() => handleTokenType(0)}
      />
      <Form.Check
        type="radio"
        name="tokenType"
        label="Liquidity Generator Token"
        onChange={() => handleTokenType(1)}
      />
      <Form.Check
        type="radio"
        name="tokenType"
        label="Baby Token"
        onChange={() => handleTokenType(2)}
      />
      <Form.Check
        type="radio"
        name="tokenType"
        label="Buyback Baby Token"
        onChange={() => handleTokenType(3)}
      />
      <Form.Check
        type="radio"
        name="tokenType"
        label="Pipi Token"
        onChange={() => handleTokenType(4)}
      />
    </Form.Group>
  );
};

export default TokenTypeSelector;