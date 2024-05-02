import Chat from '@/components/ui/chat/chat'
import List from '@/components/ui/sidebar/list'
import { Reaction } from '@/libs/types'
import { chatService } from '@/services/chatService'
import { userService } from '@/services/userService'
import { useReactionsStore } from '@/stores/reactionStore'
import { useRoomStore } from '@/stores/roomStore'
import { LucideIcon, ThumbsDown, ThumbsUp } from 'lucide-react'
import React, { useEffect } from 'react'
import "./main.css";
import { roomService } from '@/services/roomService'

const Main = () => {
  const { currentRoom, roomChats, updateSeenMessage, updateLastMessage, addMesageToRoom , updateReactionMessage, updateCanMessageDisplay} =
    useRoomStore();
  const { setReactions } = useReactionsStore();
  const reactionIconMapping = {
    Like: ThumbsUp,
    Hate: ThumbsDown
  }
  useEffect(() => {
    const seenMessageEventId = chatService.onUpdateSeenMessage.sub((message, privateRoom) => {
      updateSeenMessage(message.privateRoomId, message, privateRoom)
    })

    return () => {
      chatService.onUpdateSeenMessage.unsub(seenMessageEventId)
    }
  }, [])

  useEffect(() => {
    const reactionMessageEventId = chatService.onUpdateReactionMessage.sub((message) => {
      updateReactionMessage(message);
    })
    
    return () => {
      chatService.onUpdateSeenMessage.unsub(reactionMessageEventId)
    }
  }, [])

  useEffect(() => {
    userService
      .getReactions()
      .then((result) => {
        const map = new Map<number,Reaction>();
        result.data.forEach((reaction: Reaction) => {
          const name = reaction.name;
          reaction.icon = reactionIconMapping[reaction.name as keyof {Like: LucideIcon, Hate: LucideIcon}];
          map.set(reaction.id, reaction);
        });
        setReactions(map);
      })
      .catch((error) => {})

    const key = chatService.onReceiveMessage.sub((message) => {
      updateLastMessage(message.privateRoomId, message)
      let room = roomChats.find((room) => room.id == message.privateRoomId);
      if (room && !room.canRoomDisplay) {
        roomService.updateCanMessageDisplay(room.id, true).then((result) => {
          if (result.isSuccess) {
            const roomInfo = result.data;
            updateCanMessageDisplay(roomInfo.privateRoomId, roomInfo.canRoomDisplay);
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
      <List />
     </div>

     <div className="main-content">
     {currentRoom && <Chat />}
      {/* <Detail/> */}
     </div>
    </>
  )
}

export default Main
