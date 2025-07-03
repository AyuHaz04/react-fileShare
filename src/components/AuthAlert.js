// components/AuthAlert.js
import React from 'react';
import { Alert } from 'react-bootstrap';

const AuthAlert = ({ show, variant, message }) => {
  return (
    show && (
      <Alert className="custom-alert" variant={variant} dismissible>
        {message}
      </Alert>
    )
  );
};

export default AuthAlert;
