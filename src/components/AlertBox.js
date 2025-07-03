import React from 'react';
import { Alert } from 'react-bootstrap';
import '../styles/AlertBox.css';


const AlertBox = ({ variant = 'info', message, onClose }) => {
  if (!message) return null;

  return (
    <Alert
      variant={variant}
      dismissible
      onClose={onClose}
      className="custom-alert mt-3"
    >
      {message}
    </Alert>
  );
};

export default AlertBox;
