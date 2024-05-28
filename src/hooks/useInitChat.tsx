import { roomService } from "@/services/roomService";
import { useRoomActions, useRoomStore } from "@/stores/roomStore";
import { useEffect, useRef, useState } from "react";

const useInitChat = (scrollIntoView?: () => void) => {
  const currentRoom = useRoomStore(({currentRoom: room}) => ({
    roomId: room?.id as string,
    firstMessageId: room?.firstMessageId,
    chats: room?.chats,
  }));
  const {
    replaceChats,
    updateFirstMessageId,
  } = useRoomActions();
  
  useEffect(() => {
    const initChat = async () => {
      try {
        // update first message id
        if (currentRoom.firstMessageId === undefined) {
          const result = await roomService.getFirstMessage(currentRoom.roomId);
          const message = result.data;
          if (message) {
            updateFirstMessageId(currentRoom.roomId, message.id);
          }
        }
        // load some message
        if (currentRoom.roomId && !currentRoom.chats) {         
          const result = await roomService.getSomeMessages(currentRoom.roomId);
          const messages = result.data;
          replaceChats(currentRoom.roomId, messages);     
          if (scrollIntoView) scrollIntoView();
        }        
      } catch (error) {
        console.log(error);
      }
    };

    initChat();
  }, [currentRoom.roomId]);
}

export default useInitChat
