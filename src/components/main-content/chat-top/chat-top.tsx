import './chat-top.css';
import React from 'react';
import RoomInfo from './room-info/room-info';
import ChatTopActions from './chat-top-action/chat-top-actions';


const Heading = () => {
  return (
    <div className="chat-top">
      <RoomInfo/>
      <ChatTopActions/>
    </div>
  );
};

export default Heading;