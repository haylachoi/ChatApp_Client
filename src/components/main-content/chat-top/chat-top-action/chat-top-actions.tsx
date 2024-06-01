import './chat-top-actions.css';
import { useRoomStore } from '@/stores/roomStore';

import React from 'react'
import AddMemberButton from './add-member-button/add-member-button';
import CallVideoButton from './call-video-button/call-video-button';

const ChatTopActions = () => {
  const isGroup = useRoomStore((state) => state.currentRoom?.isGroup);
 
  return (
    <div className="chat-top-actions">
    {isGroup && (
     <AddMemberButton/>
    )}
    {!isGroup && (
      <CallVideoButton/>
    )}
    {/* TODO: implement  */}
    <img className="size-m" src="./video.png" alt="" />
    <img className="size-m" src="./info.png" alt="" />
  </div>
  )
}

export default ChatTopActions
