import {
  useEffect,
  useRef,
} from 'react';
import './chat.css';

import React from 'react';
import { roomService } from '@/services/roomService';
import Message from './message/message';
import { useCurrentUser } from '@/stores/authStore';
import { RoomInfo, RoomMemberDetail, RoomStatus, useCurrentChats, useCurrentRoomId, useCurrentRoomInfo, useCurrentRoomMembers, useCurrentRoomStatus, useRoomActions } from '@/stores/roomStore';
import Heading from './heading/heading';
import InfiniteScrollable from '../ui/infinite-scrollable/infinite-scrollable';
import ChatPrompt from './chat-prompt/chat-prompt';
import useObserveUnseenMessage from '@/hooks/useObserveUnseenMessage';
import useReceiveMessageEvent from '@/hooks/useReceiveMessageEvent';
import useIsLastMessageInView from '@/hooks/useIsLastMessageInView';
import { MessageData, Profile, RoomMemberInfo } from '@/libs/types';

const Chat = () => {
  const currentUser = useCurrentUser() as Profile;
  const currentChats = useCurrentChats() as MessageData[];
  const currentRoomStatus = useCurrentRoomStatus() as RoomStatus;
  const currentRoomInfo = useCurrentRoomInfo() as RoomInfo;
  const currentRoomId = useCurrentRoomId() as string;
  const currentRoomMembers = useCurrentRoomMembers() as RoomMemberDetail;

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
    currentChats == undefined ||
    currentRoomStatus.firstMessageId == undefined ||
    currentChats.length == 0
      ? undefined
      : +currentChats[0].id > +currentRoomStatus.firstMessageId;

  const canFetchNextMessage =
    currentChats == undefined ||
    currentRoomStatus.lastMessage?.id == undefined ||
    currentChats.length == 0
      ? undefined
      : +currentChats[currentChats.length - 1].id <
        +currentRoomStatus.lastMessage.id;


  const fetchPrevious = async () => {
    if (!currentChats) return;

    var result = await roomService.getPreviousMessages(
      currentRoomId,
      currentChats[0].id,
    );
    if (result.isSuccess) {
      addPreviousMesasges(currentRoomId, result.data);
    }
  };
  const fetchNext = async () => {
    if (!currentChats) return;

    var result = await roomService.getNextMessages(
      currentRoomId,
      currentChats[currentChats.length - 1].id,
    );
    addNextMesasges(currentRoomId, result.data);
  };
  
  useEffect(() => {
    const initChat = async () => {
      try {
        // update first message id
        if (currentRoomStatus.firstMessageId === undefined) {
          const result = await roomService.getFirstMessage(currentRoomId);
          const message = result.data;
          if (message) {
            updateFirstMessageId(currentRoomId, message.id);
          }
        }
        // load some message
        if (currentRoomId && !currentChats) {
          const result = await roomService.getSomeMessages(currentRoomId);
          const messages = result.data;     
          replaceChats(currentRoomId, messages);
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
  }, [currentRoomStatus, currentRoomInfo]);

 useEffect(() => {
  if(currentChats && currentChats.length > 0){
    const lastMessage = currentChats[currentChats.length-1];
    const lastSeenMessageId = currentRoomMembers?.currentMember.lastSeenMessageId;
    if (lastSeenMessageId) {
      lastSeenMessageRef.current?.scrollIntoView({ behavior: 'smooth' , block: 'nearest' });
    }    
    else if (isInView && lastMessage.senderId !== currentUser.id){
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    } 
    else if ( lastMessage.senderId === currentUser.id) {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }
 },[currentChats?.length])
  return (
    <div className="chat">
      <Heading />      
      <InfiniteScrollable ref={chatViewportRef}
        className="center"
        fetchNext={fetchNext}
        fetchPrevious={fetchPrevious}
        canFetchNext={!!canFetchNextMessage}
        canFetchPrevious={!!canFetchPreviewMessage}>
        {currentChats &&
          currentChats.map((message, index) => (
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
