import { chatService } from "@/services/chatService";
import {  useEffect, useRef } from "react";
import useInView from "./useIsInView";
import { Profile } from "@/libs/types";
import { useCurrentUser } from "@/stores/authStore";
import { useRoomStore } from "@/stores/roomStore";

const useScrollWhenAddMessage = (viewportRef: React.MutableRefObject<HTMLDivElement | null>, lastMessageRef: React.MutableRefObject<HTMLDivElement | null> ) => {
  const currentUser = useCurrentUser() as Profile;
  const currentRoom = useRoomStore(({currentRoom : room}) => ({
    roomId: room?.id as string,
    scrollTop: room?.viewportTop,
    chats: room?.chats,
    firstUnseenMessageId: room?.currentRoomMemberInfo.firstUnseenMessageId,
  }));
  
  const isLastMessageInViewRef = useInView(
    viewportRef,
    lastMessageRef,
  );  
  
  const receicedMessageRef = useRef<string>();
 
  useEffect(() => {
    if (currentRoom.chats && receicedMessageRef.current && receicedMessageRef.current == lastMessageRef.current?.dataset.id) {
      const lastMessage = currentRoom.chats[currentRoom.chats.length - 1];
      if (isLastMessageInViewRef.current && lastMessage.senderId !== currentUser.id) {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (lastMessage.senderId === currentUser.id) {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
   
  }, [currentRoom.chats]);
  useEffect(() => {
    const key = chatService.onReceiveMessage.sub((message) => {
      if (currentRoom.chats && currentRoom.chats.length > 0 && message.roomId == currentRoom.roomId) {
       receicedMessageRef.current = message.id;
      }
    })

    return () => chatService.onReceiveMessage.unsub(key);
  }, [currentRoom.roomId, currentRoom.chats]);
}

export default useScrollWhenAddMessage
