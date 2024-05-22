import { chatService } from '@/services/chatService';
import { useCurrentChats, useCurrentRoomId,  useCurrentRoomPreviousLastMessageId, useRoomActions } from '@/stores/roomStore';
import { useEffect } from 'react';

const useReceiveMessageEvent = () => {
  const previousLastMessageId = useCurrentRoomPreviousLastMessageId();
  const currentRoomId = useCurrentRoomId();
  const currentChats = useCurrentChats();
  
  const { addMesageToRoom } = useRoomActions();
  useEffect(() => {
    const key = chatService.onReceiveMessage.sub((message) => {
      if (message.roomId === currentRoomId) {
        if (!currentChats || currentChats.length < 1 || currentChats[currentChats.length -1].id === previousLastMessageId) {
          addMesageToRoom(message.roomId, message);
        }
      }  
    });

    return () => {
      chatService.onReceiveMessage.unsub(key);
    };
  }, [previousLastMessageId, currentRoomId, currentChats]);
};

export default useReceiveMessageEvent;
