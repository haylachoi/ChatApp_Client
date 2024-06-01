import './room.css';
import { RoomData, RoomIdType } from '@/libs/types';
import { useAuthStore } from '@/stores/authStore';
import { currentViewPortStore } from '@/stores/chatViewportStore';
import { useCurrentRoomId, useRoomActions } from '@/stores/roomStore';
import clsx from 'clsx';
import React from 'react';
interface RoomProps {
  room: RoomData;
}

const Room: React.FC<RoomProps> = ({ room }) => {
  const currentUserId = useAuthStore((state) => state.currentUser?.id);
  const currentRoomId = useCurrentRoomId() as RoomIdType;
  const { setCurrentRoom } = useRoomActions();
  console.log('room');
  const lastMessageSenderName =
    room.lastMessage?.senderId == currentUserId
      ? 'Bạn'
      : room.otherRoomMemberInfos.find(
          (rm) => rm.user.id === room.lastMessage?.senderId ?? 0,
        )?.user.fullname;

  const lastMessageContent = room.lastMessage?.isImage
    ? 'Hình ảnh'
    : room.lastMessage?.content;
  const handleClick = () => {
    currentViewPortStore.cacheScrollTop(currentRoomId);
    currentViewPortStore.resetCurrentViewPortStore();
    setCurrentRoom(room);
  };
  return (
    <div
      className={`room-item ${currentRoomId == room.id ? 'room-current' : ''}`}
      key={room.id}
      onClick={handleClick}>
      <img src={room.avatar || './avatar.png'} loading="lazy" alt="" />
      <div className="texts">
        <span>{room.name}</span>
        {room.lastMessage && (
          <div className="room-additional-info">
            <span className="message-content">
              {lastMessageSenderName}
              {': '}
              <span
                className={clsx({
                  'message-img-icon': room.lastMessage.isImage,
                })}>
                {lastMessageContent}
              </span>
            </span>
            {room.currentRoomMemberInfo.unseenMessageCount > 0 && (
              <span className="message-unseen-count">
                {`(${room.currentRoomMemberInfo.unseenMessageCount})`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Room);
// export default Room;
