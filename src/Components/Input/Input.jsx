import React from 'react';
import "./Input.css";
import { Form } from 'react-bootstrap';

const Input = ({ label, type, placeholder, min = null, rows = null, value, onChange, note = null, error }) => {
    return (
        <Form.Group className={`mb-3 ${type !== 'textarea' ? 'formdiv' : 'formdiv2'}`}>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                as={type === 'textarea' ? 'textarea' : 'input'}
                type={type !== 'textarea' ? type : undefined}
                placeholder={placeholder}
                rows={rows}
                min={min}
                value={value}
                onChange={onChange}
            />
            {error && (
                <Form.Text className="text-danger">
                    {error}
                </Form.Text>
            )}
            {note && (
                <Form.Text className="mb-3 text-muted">
                    {note}
                </Form.Text>
            )}
        </Form.Group>
    );
};

export default Input;
