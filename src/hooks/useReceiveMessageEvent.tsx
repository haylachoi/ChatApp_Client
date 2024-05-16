import { chatService } from '@/services/chatService';
import { useCurrentRoom, useRoomActions } from '@/stores/roomStore';
import { useCurrentUser } from '@/stores/authStore';
import React, { useEffect } from 'react';

const useReceiveMessageEvent = () => {
  const currentRoom = useCurrentRoom();
  if (!currentRoom) return;
  const { addMesageToRoom } = useRoomActions();
  useEffect(() => {
    const key = chatService.onReceiveMessage.sub((message) => {
      if (message.roomId == currentRoom.id) {
        addMesageToRoom(message.roomId, message);
      }
    });

    return () => {
      chatService.onReceiveMessage.unsub(key);
    };
  }, [currentRoom]);
};

export default useReceiveMessageEvent;
