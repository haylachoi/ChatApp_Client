import './room-info.css';
import { RoomIdType, RoomMemberInfo } from '@/libs/types';
import { useRoomStore } from '@/stores/roomStore';
import React from 'react';
import { useAppModalActions, ModalElement } from '@/stores/modalStore';
import { useShallow } from 'zustand/react/shallow';

const RoomInfo = () => {
  const currentRoom = useRoomStore(useShallow(({ currentRoom: room }) => ({
    isGroup: room?.isGroup,
    name: room?.name,
    avatar: room?.avatar,
    otherMembers: room?.otherRoomMemberInfos as RoomMemberInfo[],
  })));

  const otherMembers = currentRoom.otherMembers;
  const { openModal, setCurrentModal } = useAppModalActions();

  const handleOpenRoomDetail = () => {
    if (!currentRoom.isGroup) return;
    setCurrentModal(ModalElement.groupManager);
    openModal();
  };
  return (
    <div className="room-info">
      <button className="btn-none info-btn" onClick={handleOpenRoomDetail}>
        <img
          src={
            (currentRoom.isGroup
              ? currentRoom.avatar
              : otherMembers[0].user.avatar) || './avatar.png'
          }
          alt=""
        />
      </button>
      <div className="texts">
        <span>
          {currentRoom.isGroup
            ? currentRoom.name
            : otherMembers[0].user.fullname}
        </span>
        <p>Lorem ipsum dolor, sit amet.</p>
      </div>
    </div>
  );
};

export default RoomInfo;
