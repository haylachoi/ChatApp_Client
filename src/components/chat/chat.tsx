import './chat.css';

import React from 'react';
import Message from './message/message';
import { useRoomStore } from '@/stores/roomStore';
import Heading from './heading/heading';
import InfiniteScrollable from '../ui/infinite-scrollable/infinite-scrollable';
import ChatPrompt from './chat-prompt/chat-prompt';
import useObserveUnseenMessage from '@/hooks/useObserveUnseenMessage';
import useInitChat from '@/hooks/useInitChat';
import useFetchChat from '@/hooks/useFetchChat';
import useSetViewportScrollTop from '@/hooks/useSetViewportScrollTop';
import useScrollWhenAddMessage from '@/hooks/useScrollWhenAddMessage';
import { RoomMemberInfo } from '@/libs/types';
import { useCurrentUserId } from '@/stores/authStore';
import { currentViewPortStore, useChatViewportActions } from '@/stores/chatViewportStore';
import { useShallow } from 'zustand/react/shallow';

const Chat = () => {
  const currentUserId = useCurrentUserId();
  const chats = useRoomStore((state) => state.currentRoom?.chats);
  const currentRoom = useRoomStore(useShallow(({ currentRoom: room }) => ({
    firstUnseenMessageId: room?.currentRoomMemberInfo.firstUnseenMessageId,
    currentMember: room?.currentRoomMemberInfo as RoomMemberInfo
  })));

  const fetchFunc = useFetchChat();

  useInitChat(() => {
    setTimeout(() => {   
      if (currentRoom.firstUnseenMessageId) {   
        currentViewPortStore.firstUnseenMessage?.scrollIntoView({ behavior: 'instant', block: 'center' });
      } else if (currentViewPortStore.lastMessage) {
        currentViewPortStore.lastMessage.scrollIntoView({ behavior: 'instant' });
      }
    }, 0);
  });
  useObserveUnseenMessage(currentViewPortStore.chatViewport, currentViewPortStore.unseenMessages);
  useScrollWhenAddMessage(currentViewPortStore.chatViewport, currentViewPortStore.lastMessage);
  useSetViewportScrollTop(currentViewPortStore.chatViewport);

  return (
    <div className="chat">
      <Heading />
      <InfiniteScrollable
        ref={(el) => {
          currentViewPortStore.chatViewport = el ?? undefined;
        }}
        className="center"
        {...fetchFunc}>
        {chats &&
          chats.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              isLastMessage = {chats && index == chats?.length - 1}
              isFirstUnseenMessage= {message.id == currentRoom.currentMember.firstUnseenMessageId}
              isUnseen = {currentRoom.currentMember.firstUnseenMessageId !== undefined &&
                message.id >= currentRoom.currentMember.firstUnseenMessageId &&
                message.senderId !== currentUserId && !currentViewPortStore.unseenMessages.some((e) => e?.dataset.id == message.id.toString())
                }         
            />
          ))}
         
      </InfiniteScrollable>
      <ChatPrompt />
    </div>
  );
};

export default Chat;