import { useEffect, useRef } from 'react';
import './chat.css';

import React from 'react';
import Message from './message/message';
import { useRoomActions, useRoomStore } from '@/stores/roomStore';
import Heading from './heading/heading';
import InfiniteScrollable from '../ui/infinite-scrollable/infinite-scrollable';
import ChatPrompt from './chat-prompt/chat-prompt';
import useObserveUnseenMessage from '@/hooks/useObserveUnseenMessage';
import useInitChat from '@/hooks/useInitChat';
import useFetchChat from '@/hooks/useFetchChat';
import useSetViewportScrollTop from '@/hooks/useSetViewportScrollTop';
import useScrollWhenAddMessage from '@/hooks/useScrollWhenAddMessage';
import { Profile, RoomMemberInfo } from '@/libs/types';
import { useCurrentUser } from '@/stores/authStore';
import { useChatViewportActions } from '@/stores/chatViewportStore';

const Chat = () => {
  const currentUser = useCurrentUser() as Profile;
  const currentRoom = useRoomStore(({ currentRoom: room }) => ({
    chats: room?.chats,
    firstUnseenMessageId: room?.currentRoomMemberInfo.firstUnseenMessageId,
    currentMember: room?.currentRoomMemberInfo as RoomMemberInfo
  }));

  const { setCurrentViewportRef } = useChatViewportActions();

  const chatViewportRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const firstUnseenMessageRef = useRef<HTMLDivElement | null>(null);
  const unseenMessagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const messagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const fetchFunc = useFetchChat();

  useInitChat(() => {
    setTimeout(() => {   
      if (currentRoom.firstUnseenMessageId) {
        firstUnseenMessageRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'instant' });
      }
    }, 0);
  });
  useObserveUnseenMessage(chatViewportRef, unseenMessagesRef);
  useScrollWhenAddMessage(chatViewportRef, lastMessageRef);
  useSetViewportScrollTop(chatViewportRef);

  useEffect(() => {
    setCurrentViewportRef(chatViewportRef);
  }, []);

  return (
    <div className="chat">
      <Heading />
      <InfiniteScrollable
        ref={chatViewportRef}
        className="center"
        {...fetchFunc}>
        {currentRoom.chats &&
          currentRoom.chats.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              index={index}
              // lastMessageRef={lastMessageRef}
              // unseenMessagesRef={unseenMessagesRef}
              // firstUnseenMessageRef={firstUnseenMessageRef}
              ref={el => {
                if (messagesRef.current.find((e) => e?.dataset.id == message.id)) {
                  messagesRef.current.push(el);
                }

                if (
                  currentRoom.currentMember.firstUnseenMessageId &&
                  message.id >= currentRoom.currentMember.firstUnseenMessageId &&
                  message.senderId !== currentUser.id &&
                  !unseenMessagesRef.current.find((e) => e?.dataset.id == message.id)
                ) {
                  unseenMessagesRef.current.push(el);
                }

                if (message.id == currentRoom.currentMember.firstUnseenMessageId) {
                  firstUnseenMessageRef.current = el;
                }
            
                if (currentRoom.chats && index == currentRoom.chats?.length - 1)
                  lastMessageRef.current = el;
              }}
            />
          ))}
      </InfiniteScrollable>
      <ChatPrompt />
    </div>
  );
};

export default Chat;
