import {
  KeyboardEventHandler,
  LegacyRef,
  UIEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import './chat.css';

import { format } from 'timeago.js';
import React from 'react';
import { chatService } from '@/services/chatService';
import { roomService } from '@/services/roomService';
import useDebounce from '@/hooks/useDebouce';
import { useReactionsStore } from '@/stores/reactionStore';
import Message from './message/message';
import { Room } from '@/libs/types';
import { useCurrentUser } from '@/stores/authStore';
import { useCurrentRoom, useRoomActions } from '@/stores/roomStore';
import Heading from './heading/heading';
import InfiniteScrollable from '../ui/infinite-scrollable/infinite-scrollable';
import ChatPrompt from './chat-prompt/chat-prompt';
import useObserveUnseenMessage from '@/hooks/useObserveUnseenMessage';
import useReceiveMessageEvent from '@/hooks/useReceiveMessageEvent';
import useIsLastMessageInView from '@/hooks/useIsLastMessageInView';

const Chat = () => {
  const currentUser = useCurrentUser();
  const currentRoom = useCurrentRoom();
  
  if (!currentRoom || !currentUser) {
    return <></>;
  }

  const {
    replaceChats,
    updateFirstMessageId,
    addPreviousMesasges,
    addNextMesasges,
  } = useRoomActions();


  const chatViewportRef = useRef<HTMLDivElement | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const firstUnseenMessageRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<(HTMLDivElement | null)[]>([]);
 
  
  const [isGoToUnseenMessage, setIsGoToUnseenMessage] = useState(false);
  

  useObserveUnseenMessage(chatViewportRef, messagesRef);
  useReceiveMessageEvent();
  const isInView = useIsLastMessageInView(chatViewportRef, lastMessageRef);
  const canFetchPreviewMessage =
    currentRoom.chats == undefined ||
    currentRoom.firstMessageId == undefined ||
    currentRoom.chats.length == 0
      ? undefined
      : +currentRoom.chats[0].id > +currentRoom.firstMessageId;

  const canFetchNextMessage =
    currentRoom.chats == undefined ||
    currentRoom.lastMessageId == undefined ||
    currentRoom.chats.length == 0
      ? undefined
      : +currentRoom.chats[currentRoom.chats.length - 1].id <
        +currentRoom.lastMessageId;


  const handleGoToLast = () => {
    if (!currentRoom.chats || currentRoom.chats.length === 0) {
      return;
    }
    roomService
      .getNextMessages(
        currentRoom.id,
        currentRoom.chats[currentRoom.chats.length - 1].id,
        null,
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {});
  };

  const fetchPrevious = async () => {
    if (!currentRoom || !currentRoom.chats) return;

    var result = await roomService.getPreviousMessages(
      currentRoom.id,
      currentRoom.chats[0].id,
    );
    if (result.isSuccess) {
      addPreviousMesasges(currentRoom.id, result.data);
    }
  };
  const fetchNext = async () => {
    if (!currentRoom || !currentRoom.chats) return;

    var result = await roomService.getNextMessages(
      currentRoom.id,
      currentRoom.chats[currentRoom.chats.length - 1].id,
    );
    addNextMesasges(currentRoom.id, result.data);
  };
  useEffect(() => {
    const initChat = async () => {
      try {
        // update first message id
        if (currentRoom.firstMessageId === undefined) {
          const result = await roomService.getFirstMessage(currentRoom.id);
          const message = result.data;
          if (message) {
            updateFirstMessageId(currentRoom.id, message.id);
          }
        }
        // load some message
        if (currentRoom.id && !currentRoom.chats) {
          const result = await roomService.getSomeMessages(currentRoom.id);
          // console.log('start', result, currentRoom.id);
          const messages = result.data;
          replaceChats(currentRoom.id, messages);
        }

        if (currentRoom.currentRoomMemberInfo.firstUnseenMessageId) {
          firstUnseenMessageRef.current?.scrollIntoView({
            behavior: 'instant',
            block: 'center',
            inline: 'nearest',
          });
        } else if (lastMessageRef.current) {
          lastMessageRef.current.scrollIntoView({ behavior: 'instant' });
        }
      } catch (error) {
        console.log(error);
      }
    };
    initChat();
  }, [currentRoom]);

 useEffect(() => {
  if(currentRoom.chats && currentRoom.chats.length > 0){
    const lastMessage = currentRoom.chats[currentRoom.chats.length-1];
    if (isInView && lastMessage.senderId !== currentUser.id){
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    } 
    if ( lastMessage.senderId === currentUser?.id) {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }
 },[currentRoom.chats?.length])
  return (
    <div className="chat">
      <Heading />      
      <InfiniteScrollable ref={chatViewportRef}
        className="center"
        fetchNext={fetchNext}
        fetchPrevious={fetchPrevious}
        canFetchNext={!!canFetchNextMessage}
        canFetchPrevious={!!canFetchPreviewMessage}>
        {currentRoom.chats &&
          currentRoom.chats.map((message, index) => (
            <Message
              key={message.id}
              index={index}
              message={message}
              lastMessageRef={lastMessageRef}
              messagesRef={messagesRef}
              firstUnseenMessageRef={firstUnseenMessageRef}
            />
          ))}
        {/* <button className="go-to-last" onClick={handleGoToLast}>Go To</button> */}
      </InfiniteScrollable>
      <ChatPrompt/>
     
    </div>
  );
};

export default Chat;
