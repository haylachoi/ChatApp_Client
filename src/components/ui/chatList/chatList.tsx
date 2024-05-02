import { useEffect, useState } from 'react'
import './chatList.css'
import AddUser from '../../ui/addUser/addUser'
import { useUserStore } from '../../../stores/userStore'

import React from 'react'
import { useRoomStore } from '@/stores/roomStore'
import { roomService } from '@/services/roomService'
import Modal from '@/components/commons/modal/modal'
import { PrivateRoom } from '@/libs/types'

const ChatList = () => {
  const [addMode, setAddMode] = useState(false)
  const [input, setInput] = useState('')

  const { currentUser } = useUserStore()
  const { roomChats, currentRoom, setRoomChats, addRoomChat, setCurrentRoom } =
    useRoomStore()

  useEffect(() => {
    roomService
      .getPrivateRooms()
      .then((result: any) => {
        setRoomChats(result.data);
        console.log(result.data);
      })
      .catch((error) => {
        console.log(error)
      })

    // roomService.onCreateRoom((result) => {
    //   console.log('listen create room', result)
    //   let room = result.data as PrivateRoom
    //   addRoomChat(result.data)
    // })

    const createRoomEventId = roomService.onCreateRoom.sub((room) => {
      addRoomChat(room)
    })

    return () => {
      roomService.onCreateRoom.unsub(createRoomEventId)
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
        <img
          src={addMode ? './minus.png' : './plus.png'}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {roomChats &&
        roomChats.map((roomChat) => {
          if (!roomChat.canRoomDisplay) return undefined;
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
                <img
                  src={roomChat?.friend.avatar || './avatar.png'}
                  loading="lazy"
                  alt=""
                />
                <div className="texts">
                  <span>{roomChat?.friend.fullname}</span>
                  {roomChat.lastUnseenMessage && (
                    <div className="room-additional-info">
                      <span>{roomChat.lastUnseenMessage?.content}</span>
                      <span
                        className={`${
                          roomChat?.lastUnseenMessage ? 'message-unseen' : ''
                        }`}>
                        {`(${roomChat.unseenMessageCount})`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          
        })}
      <Modal isOpen={addMode} onClose={() => setAddMode(false)}>
        <AddUser />
      </Modal>
      {/* {addMode && <AddUser />} */}
    </div>
  )
}

export default ChatList
