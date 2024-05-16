import { Reaction } from '@/libs/types';
import { chatService } from '@/services/chatService';
import { roomService } from '@/services/roomService';
import { userService } from '@/services/userService';
import { useRoomActions, useRoomChats } from '@/stores/roomStore';
import { LucideIcon } from 'lucide-react';
import React, { useEffect } from 'react'

const useUpdateLastMessageEvent = () => {
    const {updateLastMessage, updateCanDisplayRoom} = useRoomActions();
    const roomChats = useRoomChats();
    useEffect(() => {       
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
}

export default useUpdateLastMessageEvent
