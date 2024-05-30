import React, { forwardRef, useMemo } from 'react';
import { format } from 'timeago.js';
import './message.css';
import { MessageData } from '@/libs/types';
import ReactionMenuButton from './reaction/reaction-menu-button';
import {  useCurrentUserId } from '@/stores/authStore';
import {
  useRoomStore,
} from '@/stores/roomStore';
import clsx from 'clsx';
import { useQuoteStore } from '@/stores/quoteStore';
import { QuoteIcon } from 'lucide-react';
import UserReactionTray from './user-reaction-tray/user-reaction-tray';
import MessageContent from './message-content/message-content';
import MessageAvatar from './message-avatar/message-avatar';
import { currentViewPortStore } from '@/stores/chatViewportStore';
interface MessageProps {
  message: MessageData;
  isLastMessage?: boolean;
  isFirstUnseenMessage?:boolean;
  isUnseen?: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(({
  message,
  isLastMessage,
  isFirstUnseenMessage,
  isUnseen,
}, forwardedRef) => {
  const currentUserId = useCurrentUserId();
  const setQuote = useQuoteStore((state) => state.setQuote);
  
  console.log('message')
 
  const messageOwner =  useRoomStore((state) => state.currentRoom?.otherRoomMemberInfos.find((info) => info.user.id === message.senderId)?.user);
  const handleSetQuote = (message: MessageData) => {
    setQuote(message);
  }
  return (
    <div
      id={`private_message_${message.id}`}
      ref={(el) => {
        if (typeof forwardedRef == 'function') {
          forwardedRef(el);
        }
        if (isFirstUnseenMessage) {
          currentViewPortStore.firstUnseenMessage = el;
        }
        if (isLastMessage) {
          currentViewPortStore.lastMessage = el;
        }
        if (isUnseen && el) {
          currentViewPortStore.unseenMessages.push(el);
        }

      }}
      data-id={message.id}
      className={clsx('message-box', 'fade-in', {
        own: message.senderId === currentUserId,
      })}
      key={message?.id}>
      {messageOwner && (
        <MessageAvatar message={message}/>
      )}
      <div className="message-wrapper">
        <MessageContent message={message}/>
        {message.messageDetails.length > 0 && (     
          <UserReactionTray message={message}/>
        )}
        {currentUserId && message.senderId != currentUserId && (
         <>
          <div className="reaction-menu">
            <ReactionMenuButton messageId={message.id} messageDetails={message.messageDetails} />
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


export default React.memo(Message);
// export default Message;
