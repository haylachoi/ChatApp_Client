import './main-content.css';

import React from 'react';
import Heading from './chat-top/chat-top';
import ChatPrompt from '../main-content/chat-prompt/chat-prompt';
import MessageList from './message-list/message-list';

const MainContent = () => {
  return (
    <div className="chat">
      <Heading />
      <MessageList />
      <ChatPrompt />
    </div>
  );
};

export default MainContent;
