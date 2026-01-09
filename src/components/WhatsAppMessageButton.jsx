import React from 'react';
import { Button } from 'react-bootstrap';

function WhatsAppMessageButton({ phoneNumbers = [], message, confirmBeforeSend = true, buttonLabel = 'Send WhatsApp' }) {
  const handleSend = () => {
    if (!phoneNumbers.length) {
      alert("No phone numbers provided.");
      return;
    }

    if (!confirmBeforeSend || window.confirm(`Send WhatsApp message to ${phoneNumbers.length} contacts?`)) {
      phoneNumbers.forEach((phone) => {
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${phone}?text=${encodedMessage}`;
        window.open(url, "_blank");
      });
    }
  };

  return (
    <Button variant="success" size="sm" onClick={handleSend}>
      {buttonLabel}
    </Button>
  );
}

export default WhatsAppMessageButton;
