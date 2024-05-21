import React from 'react';
import { format } from 'timeago.js';
import './message.css';
import { useReactionsStore } from '@/stores/reactionStore';
import { Reaction, MessageData, User } from '@/libs/types';
import { chatService } from '@/services/chatService';
import ReactionMenuButton from './reaction/reaction-menu-button';
import { ReactionIcon } from './reaction-icon/reaction-icon';
import { useCurrentRoom } from '@/stores/roomStore';
import { useCurrentUser } from '@/stores/authStore';

interface MessageProps {
  index: number;
  message: MessageData;
  messagesRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  lastMessageRef: React.MutableRefObject<HTMLDivElement | null>;
  firstUnseenMessageRef: React.MutableRefObject<HTMLDivElement | null>;
}

const Message: React.FC<MessageProps> = ({
  index,
  message,
  messagesRef,
  firstUnseenMessageRef,
  lastMessageRef,
}) => {
  const currentRoom = useCurrentRoom();
  const currentUser = useCurrentUser();
  if (!currentRoom || !currentUser) return <></>;

  const { reactions } = useReactionsStore();
  const reactionArray: Reaction[] = [];
  reactions.forEach((reaction) => reactionArray.push(reaction));

  const messageOwner = currentRoom.otherRoomMemberInfos.find(
    (info) => info.userId === message.senderId,
  )?.user;
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

  const handleRef: React.LegacyRef<HTMLDivElement> | undefined = (el) => {
    if (
      !message.messageDetails.find((md) => md.userId == currentUser.id) &&
      message.senderId !== currentUser?.id &&
      !messagesRef.current.find((e) => e?.dataset.id == message.id)
    ) {
      messagesRef.current.push(el);
    }
    if (message.id == currentRoom.currentRoomMemberInfo.firstUnseenMessageId) {
      firstUnseenMessageRef.current = el;
    }

    if (currentRoom?.chats && index == currentRoom?.chats?.length - 1)
      lastMessageRef.current = el;
  };
  return (
    <div
      id={`private_message_${message.id}`}
      ref={handleRef}
      data-id={message.id}
      className={
        message.senderId === currentUser?.id ? 'message-box own' : 'message-box'
      }
      key={message?.id}>
      {messageOwner && (
        <img
          className="message-avatar"
          src={messageOwner.avatar ?? '/avatar.png'}
        />
      )}
      <div className="message-wrapper">
        <div className="message-content">
          {currentRoom.isGroup && (
            <p className="message-owner" style={{"--name-color": messageOwner?.fullname.toHSL()} as React.CSSProperties}>{messageOwner?.fullname}</p>
          )}
          {message.isImage && <img src={message.content} alt="" />}
          {!message.isImage && (
            <p>
              {message.content} {message.id}
            </p>
          )}
        </div>
        {messageReactionData.length > 0 && (
          <div className="reaction-tray">
            {messageReactionData.map((data) => (
              <ReactionIcon key={data.id} id={data.id} />
            ))}
          </div>
        )}
        {currentUser && message.senderId != currentUser.id && (
          <div className="reaction-menu">
            <ReactionMenuButton message={message} />
          </div>
        )}
        <div className="message-status">
          {/* <span>{message.isReaded ? 'Đã xem' : 'Chưa xem'}</span> */}
          <span>{format(new Date(message.createdAt!))}</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
