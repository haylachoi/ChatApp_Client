import './room.css';
import {  RoomData, RoomIdType } from '@/libs/types';
import { useAuthStore } from '@/stores/authStore';
import {
  useChatViewportStore,
  resetCurrentViewPortStore,
} from '@/stores/chatViewportStore';
import { useCurrentRoomId, useRoomActions } from '@/stores/roomStore';
import React from 'react';
import _ from 'lodash'
interface RoomProps {
  room: RoomData;
}

const Room: React.FC<RoomProps> = ({ room }) => {
  const currentUserId = useAuthStore((state) => state.currentUser?.id);
  const viewportRef = useChatViewportStore((state) => state.currentViewportRef);
  const currentRoomId = useCurrentRoomId() as RoomIdType;
  const {setCurrentRoom, setViewportScrollTop} = useRoomActions();
  console.log('room');

  const handleClick = () => {
    if (viewportRef) {
      setViewportScrollTop(currentRoomId, viewportRef.current?.scrollTop ?? 0);
    }
    resetCurrentViewPortStore();
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
            <span className="message-unseen-content">
              {` ${
                room.lastMessage?.senderId == currentUserId
                  ? 'Bạn'
                  : room.otherRoomMemberInfos.find(
                      (rm) => rm.user.id === room.lastMessage?.senderId ?? 0,
                    )?.user.fullname
              }:                         
                    `}
              {room.lastMessage?.isImage ? (
                <span className="message-img-icon">Hình ảnh</span>
              ) : (
                room.lastMessage?.content
              )}
            </span>
            {room.currentRoomMemberInfo.unseenMessageCount > 0 && (
              <span className={`${room.lastMessage ? 'message-unseen' : ''}`}>
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
