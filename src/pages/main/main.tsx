import Sidebar from '@/components/sidebar/sidebar'
import { Reaction } from '@/libs/types'
import { chatService } from '@/services/chatService'
import { userService } from '@/services/userService'
import { useReactionsStore } from '@/stores/reactionStore'
import { LucideIcon, ThumbsDown, ThumbsUp } from 'lucide-react'
import React, { useEffect } from 'react'
import "./main.css";
import { roomService } from '@/services/roomService'
import { useCurrentRoom, useRoomActions, useRoomChats } from '@/stores/roomStore'
import { useCurrentUser } from '@/stores/userStore'
import { convertRawRoomToRoom } from '@/libs/utils'
import Chat from '@/components/chat/chat'
import AppModal from '@/components/app-modal/app-modal'

const Main = () => {
  const currentUser = useCurrentUser();
  if (!currentUser ) return <></>;
  const currentRoom = useCurrentRoom();

  const roomChats = useRoomChats();
  const { updateSeenMessage, updateLastMessage, updateReactionMessage, updateCanDisplayRoom} =
    useRoomActions();

  const { setReactions } = useReactionsStore();
  const reactionIconMapping = {
    Like: ThumbsUp,
    Hate: ThumbsDown
  }
  useEffect(() => {
    const seenMessageEventId = chatService.onUpdateIsReaded.sub((messageDetail, rawRoom) => {
      const room = convertRawRoomToRoom(rawRoom, currentUser.id);
      console.log(messageDetail, room);
      if (!room) return;
      updateSeenMessage(room, messageDetail);
    })

    return () => {
      chatService.onUpdateIsReaded.unsub(seenMessageEventId)
    }
  }, [])

  useEffect(() => {
    const reactionMessageEventId = chatService.onUpdateReactionMessage.sub((roomId, messageDetail) => {
      updateReactionMessage(roomId, messageDetail);
    })
    
    return () => {
      chatService.onUpdateIsReaded.unsub(reactionMessageEventId)
    }
  }, [])

  useEffect(() => {
    userService
      .getReactions()
      .then((result) => {
        const map = new Map<string,Reaction>();
        result.data.forEach((reaction: Reaction) => {
          const name = reaction.name;
          reaction.icon = reactionIconMapping[reaction.name as keyof {Like: LucideIcon, Hate: LucideIcon}];
          map.set(reaction.id, reaction);
        });
        setReactions(map);
      })
      .catch((error) => {})

    const key = chatService.onReceiveMessage.sub((message) => {    
      updateLastMessage(message.roomId, message)
      let room = roomChats.find((room) => room.id == message.roomId);
      if (room && !room.currentRoomMemberInfo.canDisplayRoom) {
        roomService.updateCanMessageDisplay(room.id, true).then((result) => {
          if (result.isSuccess) {
            const roomInfo = result.data;
            updateCanDisplayRoom(room.id, roomInfo.canDisplayRoom);
          }
        });
      }
    })

    return () => {
      chatService.onReceiveMessage.unsub(key)
    }
  }, [])

  useEffect(() => {
   
      userService.onConnected((user) => {
        Notification.requestPermission().then((per) => {
          if (per === 'granted') {
            var notification = new Notification('Thông báo', {
              body: `${user.fullname} đã online`,
              icon: 'icon.jpg',
            })
          }
        })
      })
      userService.onDisconnected((message) => {
        Notification.requestPermission().then((per) => {
          if (per === 'granted') {
            var notification = new Notification('Thông báo', {
              body: message,
              icon: 'icon.jpg',
            })
          }
        })
      })
    
  }, [])

  return (
    <>
     <div className="side-bar">
      <Sidebar />
     </div>

     <div className="main-content">
     {currentRoom && <Chat />}
      {/* <Detail/> */}
     </div>
     <AppModal/>
    </>
  )
}

export default Main
