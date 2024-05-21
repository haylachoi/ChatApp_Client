import { useEffect, useMemo, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { IoPersonAddOutline } from 'react-icons/io5';
import './chatList.css';
import React from 'react';

import { useCurrentUser } from '@/stores/authStore';
import {
  useCurrentRoom,
  useRoomActions,
  useRoomChats,
} from '@/stores/roomStore';
import { ModalElement, useAppModalActions } from '@/stores/modalStore';
import useJoinRoomEvent from '@/hooks/useJoinRoomEvent';
import { Room } from '@/libs/types';

const ChatList = () => {
  const currentRoom = useCurrentRoom();
  const currentUser = useCurrentUser();
  if (!currentUser || !currentUser.id) return <></>;

  const { setCurrentModal, openModal } = useAppModalActions();
  const [input, setInput] = useState('');

  const roomChats = useRoomChats();
  const { fetchRoomChats, setCurrentRoom } = useRoomActions();

  let filtedRooms: Room[] = useMemo(() => {
    let filter = roomChats.filter((room) => {
      if (room.isGroup) {
        return room.name?.toLowerCase().includes(input.toLowerCase());
      } else {
        return room.otherRoomMemberInfos[0].user.fullname
          .toLowerCase()
          .includes(input.toLowerCase());
      }
    });
  
    filter.sort((a, b) => {
      if (a.lastMessage && b.lastMessage) {
        return +b.lastMessage.id - +a.lastMessage.id;
      }
      if (a.lastMessage) return -1;
      return 1;
    });
    console.log(filter);
    return filter;
  }, [roomChats])

  const handleOpenAddUser = () => {
    setCurrentModal(ModalElement.addUser);
    openModal();
  };

  const handleOpenCreateGroup = () => {
    setCurrentModal(ModalElement.createGroup);
    openModal();
  };

  useJoinRoomEvent();
  useEffect(() => {
    if (currentUser?.id) {
      fetchRoomChats(currentUser.id);
    }
  }, []);

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="group-btn">
          <button className="add-btn" onClick={handleOpenAddUser}>
            <IoPersonAddOutline className="add-icon" />
          </button>
          <button className="add-btn" onClick={handleOpenCreateGroup}>
            <MdOutlineGroupAdd className="add-icon" />
          </button>
        </div>
      </div>
      {filtedRooms &&
        filtedRooms.map((roomChat) => {
          if (!roomChat.currentRoomMemberInfo.canDisplayRoom) return;
          return (
            <div
              className={`item ${
                currentRoom?.id == roomChat.id ? 'room-current' : ''
              }`}
              key={roomChat.id}
              onClick={() => {
                setCurrentRoom(roomChat);
              }}>
              <img
                src={roomChat.avatar || './avatar.png'}
                loading="lazy"
                alt=""
              />
              <div className="texts">
                <span>{roomChat.name}</span>
                {roomChat.lastMessage && (
                  <div className="room-additional-info">
                  <span className="message-unseen-content">
                    {` ${
                      roomChat.lastMessage?.senderId == currentUser.id
                        ? 'Bạn'
                        : roomChat.otherRoomMemberInfos.find(rm => rm.user.id === roomChat.lastMessage?.senderId ?? 0)?.user.fullname
                    }: ${
                      roomChat.lastMessage?.isImage ? (
                        <span className="message-img-icon">Hình ảnh</span>
                      ) : (
                        roomChat.lastMessage?.content
                      )
                    }                         
                    `}                
                  </span>
                  {roomChat.currentRoomMemberInfo.unseenMessageCount > 0 && (
                    <span
                      className={`${
                        roomChat.lastMessage ? 'message-unseen' : ''
                      }`}>
                      {`(${roomChat.currentRoomMemberInfo.unseenMessageCount})`}
                    </span>
                  )}
                </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ChatList;
