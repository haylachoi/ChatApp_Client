import './message-item.css';
import { MessageData } from '@/libs/types';
import { useCurrentUserId } from '@/stores/authStore';
import { currentViewPortStore } from '@/stores/chatViewportStore';
import clsx from 'clsx';
import React, { forwardRef } from 'react';
import MessageAvatar from './message-avatar/message-avatar';
import MessageContent from './message-content/message-content';

import MessageStatus from './message-status/message-status';
import ReactionMenuButton from './reaction-menu-button/reaction-menu-button';
import UserReactionTray from './user-reaction-tray/user-reaction-tray';
import QuoteButton from './message-quote-button/message-quote-button';

interface MessageProps {
  message: MessageData;
  isLastMessage?: boolean;
  isFirstUnseenMessage?: boolean;
  isUnseen?: boolean;
}

const MessageItem = forwardRef<HTMLDivElement, MessageProps>(
  (
    { message, isLastMessage, isFirstUnseenMessage, isUnseen },
    forwardedRef,
  ) => {
    const currentUserId = useCurrentUserId();
  
    const handleAssignRef: React.LegacyRef<HTMLDivElement> | undefined = (
      el,
    ) => {
      if (typeof forwardedRef == 'function') {
        forwardedRef(el);
      }
      if (isFirstUnseenMessage) {
        currentViewPortStore.firstUnseenMessage = el ?? undefined;
      }
      if (isLastMessage) {
        currentViewPortStore.lastMessage = el ?? undefined;
      }
      if (isUnseen && el) {
        currentViewPortStore.unseenMessages.push(el);
      }
    };
    return (
      <div
        id={`private_message_${message.id}`}
        ref={handleAssignRef}
        data-id={message.id}
        className={clsx('message-item', 'fade-in', {
          own: message.senderId === currentUserId,
        })}
        key={message?.id}>
        {message.senderId !== currentUserId && (
          <MessageAvatar message={message} />
        )}
        <div className="message-wrapper">
          <MessageContent message={message} />
          {message.messageDetails.length > 0 && (
            <UserReactionTray message={message} />
          )}
          {currentUserId && message.senderId != currentUserId && (
            <>
              <div className="reaction-wrapper">
                <ReactionMenuButton
                  messageId={message.id}
                  messageDetails={message.messageDetails}
                />
              </div>
              <div className="quote-wrapper">
                <QuoteButton message={message} />
              </div>
            </>
          )}
          <MessageStatus message={message} />
        </div>
      </div>
    );
  },
);

export default React.memo(MessageItem);
// export default Message;
