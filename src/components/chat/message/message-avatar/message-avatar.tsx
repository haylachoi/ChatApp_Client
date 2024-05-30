import './message-avatar.css';
import React, { useMemo } from 'react';
import { useRoomStore } from '@/stores/roomStore';
import { MessageData, RoomMemberInfo } from '@/libs/types';

interface MessageAvatarProps {
  message: MessageData
}
const MessageAvatar: React.FC<MessageAvatarProps> = ({message}) => {
  const otherMembers = useRoomStore(
    (state) => state.currentRoom?.otherRoomMemberInfos,
  ) as RoomMemberInfo[];

  const messageOwner = useMemo(
    () => otherMembers.find((info) => info.user.id === message.senderId)?.user,
    [message.senderId],
  );
  return (
    <img
          className="message-avatar"
          src={messageOwner?.avatar ?? '/avatar.png'}
        />
  )
}

export default MessageAvatar
