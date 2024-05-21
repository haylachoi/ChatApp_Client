import { useEffect, useState } from 'react'
import { MdOutlineGroupAdd } from "react-icons/md";
import { IoPersonAddOutline } from "react-icons/io5";
import './chatList.css'
import React from 'react'

import { useCurrentUser } from '@/stores/authStore'
import {
  useCurrentRoom,
  useRoomActions,
  useRoomChats,
} from '@/stores/roomStore'
import { ModalElement, useAppModalActions } from '@/stores/modalStore';
import useJoinRoomEvent from '@/hooks/useJoinRoomEvent';

const ChatList = () => {
  const currentRoom = useCurrentRoom()
  const currentUser = useCurrentUser()
  if (!currentUser || !currentUser.id) return <></>;

  const {setCurrentModal, openModal} = useAppModalActions();
  const [input, setInput] = useState('')

  const roomChats = useRoomChats()
  const { fetchRoomChats, setCurrentRoom } = useRoomActions()

  const filtedRooms = roomChats.filter((room) => {
    if (room.isGroup) {
      return room.name?.toLowerCase().includes(input.toLowerCase());
    } else {
      return room.otherRoomMemberInfos[0].user.fullname.toLowerCase().includes(input.toLowerCase());
    }
  })
  const handleOpenAddUser = () => {
    setCurrentModal(ModalElement.addUser);
    openModal();
  }

  const handleOpenCreateGroup = () => {
    setCurrentModal(ModalElement.createGroup);
    openModal();
  }

  useJoinRoomEvent();
  useEffect(() => {
    if (currentUser?.id) {
      fetchRoomChats(currentUser.id)
    }
  }, [])
  

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
                setCurrentRoom(roomChat)
              }}          
            >
              {!roomChat.isGroup && (
                <>
                  <img
                    src={
                      roomChat.otherRoomMemberInfos[0].user.avatar ||
                      './avatar.png'
                    }
                    loading="lazy"
                    alt=""
                  />
                  <div className="texts">
                    <span>
                      {roomChat.otherRoomMemberInfos[0].user.fullname}
                    </span>
                    {roomChat.currentRoomMemberInfo.lastUnseenMessage && (
                      <div className="room-additional-info">
                        <span className="message-unseen-content">                     
                          {
                            roomChat.currentRoomMemberInfo.lastUnseenMessage.isImage ? <span className="message-img-icon">Hình ảnh</span> : roomChat.currentRoomMemberInfo.lastUnseenMessage
                            .content
                          }
                        </span>
                        <span
                          className={`${
                            roomChat.currentRoomMemberInfo.lastUnseenMessage
                              ? 'message-unseen'
                              : ''
                          }`}>
                          {`(${roomChat.currentRoomMemberInfo.unseenMessageCount})`}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
              {roomChat.isGroup && (
                <>
                  <img src={'./avatar.png'} loading="lazy" alt="" />
                  <div className="texts">
                    <span>{roomChat.groupInfo.name}</span>
                    {roomChat.currentRoomMemberInfo.lastUnseenMessage && (
                      <div className="room-additional-info">
                        <span>
                          {
                            roomChat.currentRoomMemberInfo.lastUnseenMessage
                              .content
                          }
                        </span>
                        <span
                          className={`${
                            roomChat.currentRoomMemberInfo.lastUnseenMessage
                              ? 'message-unseen'
                              : ''
                          }`}>
                          {`(${roomChat.currentRoomMemberInfo.unseenMessageCount})`}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}   
    
    </div>
  )
}

export default ChatList
