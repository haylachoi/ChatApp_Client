import { chatService } from '@/services/chatService';
import { useCurrentRoom, useRoomActions } from '@/stores/roomStore';
import { useCurrentUser } from '@/stores/authStore';
import React, { useEffect } from 'react';

const useReceiveMessageEvent = () => {
  const currentRoom = useCurrentRoom();
  const { addMesageToRoom } = useRoomActions();
  useEffect(() => {
    if (!currentRoom) return;
    const key = chatService.onReceiveMessage.sub((message) => {
      if (message.roomId === currentRoom.id) {
        if (!currentRoom.chats || currentRoom.chats.length < 1 || currentRoom.chats[currentRoom.chats.length -1].id === currentRoom.previousLastMessageId) {
          addMesageToRoom(message.roomId, message);
        }
      }  
    });

    return () => {
      chatService.onReceiveMessage.unsub(key);
    };
  }, [currentRoom]);
};

export default useReceiveMessageEvent;
