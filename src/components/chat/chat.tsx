import {
  useEffect,
  useRef,
} from 'react';
import './chat.css';

import React from 'react';
import { roomService } from '@/services/roomService';
import Message from './message/message';
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
  const lastSeenMessageRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<(HTMLDivElement | null)[]>([]);
 

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
    currentRoom.lastMessage?.id == undefined ||
    currentRoom.chats.length == 0
      ? undefined
      : +currentRoom.chats[currentRoom.chats.length - 1].id <
        +currentRoom.lastMessage.id;


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
          const messages = result.data;     
          replaceChats(currentRoom.id, messages);
        }

        // if (currentRoom.currentRoomMemberInfo.lastSeenMessageId) {
        //   lastSeenMessageRef.current?.scrollIntoView({
        //     behavior: 'instant',
        //     block: 'center',
        //     inline: 'nearest',
        //   });
        // } else if (lastMessageRef.current) {
        //   lastMessageRef.current.scrollIntoView({ behavior: 'instant' });
        // }
      } catch (error) {
        console.log(error);
      }
    };
    initChat();
  }, [currentRoom]);

 useEffect(() => {
  if(currentRoom.chats && currentRoom.chats.length > 0){
    const lastMessage = currentRoom.chats[currentRoom.chats.length-1];
    const firstUnseenMessageId = currentRoom.currentRoomMemberInfo.lastSeenMessageId;
    if (firstUnseenMessageId) {
      lastSeenMessageRef.current?.scrollIntoView({ behavior: 'smooth' , block: 'nearest' });
    }    
    else if (isInView && lastMessage.senderId !== currentUser.id){
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    } 
    else if ( lastMessage.senderId === currentUser.id) {
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
              lastSeenMessageRef={lastSeenMessageRef}
            />
          ))}
      </InfiniteScrollable>
      <ChatPrompt/>
     
    </div>
  );
};

export default Chat;
