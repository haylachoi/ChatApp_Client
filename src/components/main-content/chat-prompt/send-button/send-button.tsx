import './send-button.css';
import React from 'react';


interface SendButtonProps {
  onclick: () => void;
}
const SendButton: React.FC<SendButtonProps> = ({onclick}) => {
  return (
    <button
    className="sendButton"
    onClick={onclick}
    // disabled={isCurrentUserBlocked || isReceiverBlocked}
    >
    Send
  </button>
  )
}

export default SendButton
