import React, { forwardRef, useMemo } from 'react';
import { format } from 'timeago.js';
import './message.css';
import { MessageData, Profile, RoomMemberInfo } from '@/libs/types';
import ReactionMenuButton from './reaction/reaction-menu-button';
import { ReactionIcon } from './reaction-icon/reaction-icon';
import { useCurrentUser } from '@/stores/authStore';
import {
  useCurrentChats,
  useIsCurrentRoomGroup,
  useRoomStore,
} from '@/stores/roomStore';
import clsx from 'clsx';
import { useQuoteStore } from '@/stores/quoteStore';
import MessageQuote from '@/components/message-quote/message-quote';
import { QuoteIcon } from 'lucide-react';


interface MessageProps {
  index: number;
  message: MessageData;
  // unseenMessagesRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  // lastMessageRef: React.MutableRefObject<HTMLDivElement | null>;
  // firstUnseenMessageRef: React.MutableRefObject<HTMLDivElement | null>;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(({
  index,
  message,
  // unseenMessagesRef,
  // firstUnseenMessageRef,
  // lastMessageRef,
}, forwardedRef) => {
  const currentMember = useRoomStore(
    (state) => state.currentRoom?.currentRoomMemberInfo,
  ) as RoomMemberInfo;
  const otherMembers = useRoomStore(
    (state) => state.currentRoom?.otherRoomMemberInfos,
  ) as RoomMemberInfo[];

  const currentUser = useCurrentUser() as Profile;
  const currentChats = useCurrentChats() as MessageData[];
  const isGroup = useIsCurrentRoomGroup() as boolean;
  const {setQuote} = useQuoteStore();

  const messageOwner = useMemo(
    () => otherMembers.find((info) => info.user.id === message.senderId)?.user,
    [message.senderId],
  );

  const initReactionData: { id: string; users: string[] }[] = [];
  const messageReactionData = message.messageDetails.reduce((acc, md) => {
    if (md.reactionId) {
      const pair = acc.find((pair) => pair.id === md.reactionId);
      if (pair) {
        pair.users.push(md.userId);
      } else {
        acc.push({ id: md.reactionId, users: [md.userId] });
      }
    }
    return acc;
  }, initReactionData);

  // const handleRef: React.LegacyRef<HTMLDivElement> | undefined = (el) => {
  //   if (
  //     currentMember.firstUnseenMessageId &&
  //     message.id >= currentMember.firstUnseenMessageId &&
  //     message.senderId !== currentUser.id &&
  //     !unseenMessagesRef.current.find((e) => e?.dataset.id == message.id)
  //   ) {
  //     unseenMessagesRef.current.push(el);
  //   }
  //   if (message.id == currentMember.firstUnseenMessageId) {
  //     firstUnseenMessageRef.current = el;
  //   }

  //   if (currentChats && index == currentChats?.length - 1)
  //     lastMessageRef.current = el;
  // };

  const handleSetQuote = (message: MessageData) => {
    setQuote(message);
  }
  return (
    <div
      id={`private_message_${message.id}`}
      ref={forwardedRef}
      data-id={message.id}
      className={clsx('message-box', 'fade-in', {
        own: message.senderId === currentUser?.id,
      })}
      key={message?.id}>
      {messageOwner && (
        <img
          className="message-avatar"
          src={messageOwner.avatar ?? '/avatar.png'}
        />
      )}
      <div className="message-wrapper">
        <div className="message-content">
          {isGroup && (
            <p
              className="message-owner"
              style={
                {
                  '--name-color': messageOwner?.fullname.toHSL(),
                } as React.CSSProperties
              }>
              {messageOwner?.fullname}
            </p>
          )}
          {message.isImage && <img src={message.content} alt="" />}
          {!message.isImage && (           
            <>
              {message.quote && (
                <MessageQuote quote={message.quote}/>
              )}
              <pre>
                {message.content} {message.id}
              </pre>
            </>
          )}
        </div>
        {messageReactionData.length > 0 && (
          <div className="reaction-tray fade-in">
            {messageReactionData.map((data) => (
              <ReactionIcon key={data.id} id={data.id} />
            ))}
          </div>
        )}
        {currentUser && message.senderId != currentUser.id && (
         <>
          <div className="reaction-menu">
            <ReactionMenuButton message={message} />
          </div>
          <button className="quote-btn btn-none" onClick={() => handleSetQuote(message)}>
            <QuoteIcon fill="white" size={24}/>
          </button>
         </>
        )}
        <div className="message-status">
          <span>{format(new Date(message.createdAt!))}</span>
        </div>
      </div>
    </div>
  );
});

export default Message;
