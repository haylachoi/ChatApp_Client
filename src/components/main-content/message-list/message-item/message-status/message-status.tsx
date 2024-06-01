import './message-status.css';
import { MessageData } from '@/libs/types';
import React from 'react';
import { format } from 'timeago.js';

interface MessageStatusProps {
  message: MessageData;
}
const MessageStatus: React.FC<MessageStatusProps> = ({ message }) => {
  return (
    <div className="message-status">
      <span>{format(new Date(message.createdAt!))}</span>
    </div>
  );
};

export default MessageStatus;
