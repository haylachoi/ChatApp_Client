import './message-list.css';
import InfiniteScrollable from '@/components/ui/infinite-scrollable/infinite-scrollable';
import useFetchChat from '@/hooks/useFetchChat';
import useObserveUnseenMessage from '@/hooks/useObserveUnseenMessage';
import useScrollWhenAddMessage from '@/hooks/viewport/useScrollWhenAddMessage';
import useSetViewportScrollTop from '@/hooks/viewport/useSetViewportScrollTop';
import { RoomMemberInfo } from '@/libs/types';
import { useCurrentUserId } from '@/stores/authStore';
import { currentViewPortStore } from '@/stores/chatViewportStore';
import { useRoomStore } from '@/stores/roomStore';
import { useShallow } from 'zustand/react/shallow';
import MessageItem from './message-item/message-item';
import React, { useCallback } from 'react';
import useInitChat from '@/hooks/fetch/useInitChat';

const MessageList = () => {
  const currentUserId = useCurrentUserId();
  const chats = useRoomStore((state) => state.currentRoom?.chats);
  const currentRoom = useRoomStore(
    useShallow(({ currentRoom: room }) => ({
      currentMember: room?.currentRoomMemberInfo as RoomMemberInfo,
    })),
  );

  const fetchFunc = useFetchChat();
  useInitChat();
  useObserveUnseenMessage();
  useScrollWhenAddMessage();
  useSetViewportScrollTop();

  const handleRegisterRef = useCallback((el: HTMLDivElement | null) => {
    currentViewPortStore.chatViewport = el ?? undefined;
  }, []);

  return (
    <InfiniteScrollable
      ref={handleRegisterRef}
      className="message-list"
      {...fetchFunc}>
      {chats &&
        chats.map((message, index) => (
          <MessageItem
            key={message.id}
            message={message}
            isLastMessage={chats && index == chats?.length - 1}
            isFirstUnseenMessage={
              message.id == currentRoom.currentMember.firstUnseenMessageId
            }
            isUnseen={
              currentRoom.currentMember.firstUnseenMessageId !== undefined &&
              message.id >= currentRoom.currentMember.firstUnseenMessageId &&
              message.senderId !== currentUserId &&
              !currentViewPortStore.unseenMessages.some(
                (e) => e?.dataset.id == message.id.toString(),
              )
            }
          />
        ))}
    </InfiniteScrollable>
  );
};

export default MessageList;
