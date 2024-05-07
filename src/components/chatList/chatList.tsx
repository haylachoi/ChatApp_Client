import { useEffect, useState } from 'react'
import { MdOutlineGroupAdd } from "react-icons/md";
import { IoPersonAddOutline } from "react-icons/io5";
import './chatList.css'
import AddUser from '../addUser/add-user'
import React from 'react'
import { roomService } from '@/services/roomService'
import Modal from '@/components/ui/modal/modal'

import { useCurrentUser } from '@/stores/userStore'
import {
  useCurrentRoom,
  useRoomActions,
  useRoomChats,
} from '@/stores/roomStore'
import { convertRawRoomToRoom } from '@/libs/utils'
import CreateGroup from '../create-group/create-group';

const ChatList = () => {
  const [isSearchFriendOpen, setIsSearchFriendOpen] = useState(false)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [input, setInput] = useState('')

  const currentUser = useCurrentUser()
  const roomChats = useRoomChats()
  const currentRoom = useCurrentRoom()
  const { fetchRoomChats, addRoomChat, setCurrentRoom } = useRoomActions()

  useEffect(() => {
    if (currentUser?.id) {
      fetchRoomChats(currentUser.id)
    }

    const createRoomEventId = roomService.onCreateRoom.sub((rawRoom) => {
      if (!currentUser || !currentUser.id) return;
      const room = convertRawRoomToRoom(rawRoom, currentUser.id);
      console.log(room);
      if (room) {
        addRoomChat(room)
      }
    })
    
    return () => {
      roomService.onCreateRoom.unsub(createRoomEventId)
    }
  }, [])
  
  if (!currentUser || !currentUser.id) return <></>;

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
       <button className="add-btn" onClick={() => setIsSearchFriendOpen((prev) => !prev)}>
          <IoPersonAddOutline className="add-icon" />
        </button>
        <button className="add-btn" onClick={() => setIsCreateGroupOpen((prev) => !prev)}>
          <MdOutlineGroupAdd className="add-icon" />
        </button>
       </div>
      </div>
      {roomChats &&
        roomChats.map((roomChat) => {
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
              //  style={{
              //    backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
              //  }}
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
              {roomChat.isGroup && (
                <>
                  <img src={'./avatar.png'} loading="lazy" alt="" />
                  <div className="texts">
                    <span>{roomChat.name}</span>
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
      <Modal isOpen={isSearchFriendOpen} onClose={() => setIsSearchFriendOpen(false)}>
        <AddUser />
      </Modal>
      <Modal isOpen={isCreateGroupOpen} onClose={() => setIsCreateGroupOpen(false)}>
        <CreateGroup />
      </Modal>
      {/* {addMode && <AddUser />} */}
    </div>
  )
}

export default ChatList
