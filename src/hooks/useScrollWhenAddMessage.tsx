import { chatService } from '@/services/chatService';
import { useEffect, useRef } from 'react';
import useInView from './useIsInView';
import { MessageIdType, Profile, RoomIdType } from '@/libs/types';
import { useCurrentUser } from '@/stores/authStore';
import { useRoomStore } from '@/stores/roomStore';
import { currentViewPortStore } from '@/stores/chatViewportStore';

const useScrollWhenAddMessage = (
  viewport: HTMLDivElement | undefined,
  lastMessage:HTMLDivElement | undefined,
) => {
  const currentUser = useCurrentUser() as Profile;
  const currentRoom = useRoomStore(({ currentRoom: room }) => ({
    roomId: room?.id as RoomIdType,
    scrollTop: room?.viewportTop,
    chats: room?.chats,
    firstUnseenMessageId: room?.currentRoomMemberInfo.firstUnseenMessageId,
  }));

  const isLastMessageInViewRef = useInView(viewport, lastMessage);
  const receicedMessageRef = useRef<MessageIdType>();

  useEffect(() => {
    if (
      currentRoom.chats &&
      receicedMessageRef.current &&
      currentViewPortStore.lastMessage?.dataset.id &&
      receicedMessageRef.current == +currentViewPortStore.lastMessage?.dataset.id
    ) {
      const lastMessage = currentRoom.chats[currentRoom.chats.length - 1];
      if (
        isLastMessageInViewRef.current &&
        lastMessage.senderId !== currentUser.id
      ) {
        currentViewPortStore.lastMessage?.scrollIntoView({ behavior: 'smooth' });
      } else if (lastMessage.senderId === currentUser.id) {
        currentViewPortStore.lastMessage?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentRoom.chats]);
  useEffect(() => {
    const key = chatService.onReceiveMessage.sub((message) => {
      if (
        currentRoom.chats &&
        currentRoom.chats.length > 0 &&
        message.roomId == currentRoom.roomId
      ) {
        receicedMessageRef.current = message.id;
      }
    });

    return () => chatService.onReceiveMessage.unsub(key);
  }, [currentRoom.roomId, currentRoom.chats]);
};

export default useScrollWhenAddMessage;
